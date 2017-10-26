const db = require('../src/db');
const Promise = require('bluebird');

let perMin = 0.2;
let perKm = 1.2;
let timeRatio = 1;
let minimum = 6;
let conversionRate = 0.5;
//live data stream
//inputs : distance from db, surgeRatio, RushHour
const convertPrice = (distance) => {
  let time = (distance / 200) * timeRatio;
  let finalPrice = (distance / 1000 * perKm + time * perMin).toFixed(2);
  return finalPrice > minimum ? finalPrice : minimum ;
}

const zoneNo = (x, y) => {
	let ones = Math.floor(x/1000) + 1;
	let tens = Math.floor(y/1000);
	return (tens * 10 + ones);
}

//input is like 0.9,0.8
const conversion = (rate) => {
  let a = Math.random();
  if (a < rate) {
    return true;
  } else {
    return false;
  }
}

const makeliveTrip = (trip) => {
  delete trip.id;
  trip['rider_id'] = Math.floor(Math.random() * 200000);
  trip.finalPrice = Number(convertPrice(trip.distance));
  trip.zone = zoneNo(trip['pickup-x'],trip['pickup-y']);
  trip.confirm = conversion(conversionRate);
  return trip;
}

const getBatchTrips = (n) => {
  let values = [];
  for (var i = 0; i < n; i++) {
    let a = Math.random() * 94523;
    values.push(Math.round(a));
  }
  db.select().from('trips')
  .whereIn('id', values)
  .then(results => results.forEach(trip => db('requests').insert(makeliveTrip(trip))
    .then(() => console.log('done'))
    )
  );
};

getBatchTrips(5);
