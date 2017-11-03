const db = require('./db');
const elasticsearch = require('elasticsearch');
const Promise = require('bluebird');

const log = console.log.bind(console);

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
  httpAuth: 'elastic:changeme',
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
    body: { zone: trip.zone, created_at: trip.created_at },
  });
}

// function closeConnection() {
//   client.close();
// }

// const liveData = n => Promise.resolve()
//   .then(() => getBatchTrips(n))
//   .then(results => results.forEach((trip) => {
//     db('requests').insert(trip)
//       .then(() => {
//         console.log('addindex', trip);
//         addToIndex(trip);
//       });
//   }));

module.exports = {
  addToIndex,
  addToIndexEyeball
};
// setInterval(() => liveData(5), 1000);


// db('requests').insert(makeliveTrip(trip)
