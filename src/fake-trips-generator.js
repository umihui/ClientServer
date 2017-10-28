const FakeTrip = require('./fake-trips-helper');
const db = require('./db');

for (let i = 0; i < 100000; i++) {
  const trip = new FakeTrip();
  if (trip.distance) {
    db('trips').insert(trip).then(() => true);
  }
}
