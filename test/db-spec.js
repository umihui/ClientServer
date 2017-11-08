process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const db = require('../database/db');
const supertest = require('supertest');
const server = require('../server/index.js')

var request = supertest.agent(server);
var testRequest = {
  "pickup-x": 5679,
  "pickup-y": 9582,
  "dropoff-x": 8375,
  "dropoff-y": 9108,
  "distance": 3832,
  "base-price": 8.43,
  "zone": 1,
  "created_at": "2017-11-04T02:44:59.105Z",
  "rider_id": 1,
  "status": "pending",
  "surge-ratio": 2.8
}

describe('schema design', function() {
  beforeEach(function(done) {
    db.migrate.rollback()
    .then(function() {
      db.migrate.latest()
      .then(function() {
        done()
      })
    })
  });
  it('foreign key between request and riders', function(done) {     
    var testRider = {id: 1, type: 'student', profile: {profile:[1,1,1,1,1]}};
    var testRequest = {
      "pickup-x": 5679,
      "pickup-y": 9582,
      "dropoff-x": 8375,
      "dropoff-y": 9108,
      "distance": 3832,
      "base-price": 8.43,
      "zone": 96,
      "created_at": "2017-11-04T02:44:59.105Z",
      "rider_id": "2f47d740-cbe7-4a99-aa1f-1f12ac3d29ea",
      "status": "pending",
      "surge-ratio": 2.8
    }
    var testFn = () => db('riders').insert(testRider)
    .then(() => {db('requests').insert(testRequest);done()});

    testFn()
    .catch((err) => 
      expect(err).to.eql('insert or update on table "requests" violates foreign key constraint "requests_rider_id_foreign"'));
  });
});


describe('POST /eyeball', function() {
  beforeEach(function(done) {
    db.migrate.rollback()
    .then(function() {
      db.migrate.latest()
      .then(function() {
        done()
      })
    })
  });
  it('respond with json', function(done) {
    db('riders').insert({id: 1, type: 'student', profile: {profile:[1,1,1,1,1]}})
    .then(() =>db('surge-update-log').insert({zone: 1, "surge-ratio": 2.3})
      .then(() =>
      request
        .post('/eyeball')
        .send(testRequest)
        //.set('Accept', /application\/json/)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          done();
        })));
  });
});

//test valid type for schema
//test foreign key

//test '/eyeball' return should be a number
//