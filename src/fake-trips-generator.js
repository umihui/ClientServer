const FakeTrip = require('./fake-trips-helper');
const db = require('./db');

var insertTrip = (trip) => {
  return db('trips').insert(trip)
}

for(var i = 0; i < 100000; i++) {
  let trip = new FakeTrip();
  if (trip.distance) {
    insertTrip(trip).then(() => true);
  }
}
