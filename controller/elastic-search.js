const db = require('../src/db');
const elasticsearch = require('elasticsearch');
const Promise = require('bluebird');
const getBatchTrips = require('./live-trip-helper.js')

const log = console.log.bind(console);

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

function addToIndex(trip) {
  return client.index({
    index: 'trips',
    type: 'trip',
    body: trip
  });
}

function addToIndexEyeball(trip) {
  return client.index({
    index: 'trips',
    type: 'eyeball',
    body: { zone: trip.zone },
  });
}

// function closeConnection() {
//   client.close();
// }

const liveData = n => Promise.resolve()
  .then(() => getBatchTrips(n))
  .then(results => results.forEach((trip) => {
    db('requests').insert(trip)
      .then(() => {
        console.log('addindex', trip);
        addToIndex(trip);
      });
  }));

module.exports = addToIndex;
//setInterval(() => liveData(5), 1000);


// db('requests').insert(makeliveTrip(trip)
