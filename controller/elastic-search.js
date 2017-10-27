

var elasticsearch = require('elasticsearch');
var Promise = require('bluebird');
var getBatchTrips = require('./live-trip-generator.js')

var log = console.log.bind(console);

var client = new elasticsearch.Client({
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



function closeConnection() {
  client.close();
}


Promise.resolve()
  .then(() => getBatchTrips(5))
  .then(() => addToIndex(trip))
  .then(closeConnection);
db('requests').insert(makeliveTrip(trip)
