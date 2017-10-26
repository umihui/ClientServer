const FakeTrip = require('./fake-trips-helper');
const db = require('./db');

var insertTrip = (trip) => {
  db('trips').insert(trip)
}


  let trip = new FakeTrip();
  console.log(trip);
  insertTrip(trip);
