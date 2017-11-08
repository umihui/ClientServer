const db = require('../database/db');

const perMin = 20;
const perKm = 120;
const timeRatio = 1;
const minimum = 600;

const convertPrice = (distance) => {
  const time = (distance / 200) * timeRatio;
  const basePrice = Math.round(((distance / 1000) * perKm) + (time * perMin));
  return basePrice > minimum ? basePrice : minimum;
};

const zoneNo = (x, y) => {
  const ones = Math.floor(x / 1000) + 1;
  const tens = Math.floor(y / 1000);
  return (tens * 10) + ones;
};

const makeliveTrip = (trip) => {
  const result = trip;
  delete result.id;
  result['base-price'] = convertPrice(result.distance) / 100;
  result.zone = zoneNo(result['pickup-x'], result['pickup-y']);
  result.created_at = new Date();
  return result;
};

const getBatchTrips = (n) => {
  const values = [];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 189200;
    values.push(Math.round(a));
  }
  return db.select().from('trips')
    .whereIn('id', values)
    .then(results => results.map(trip => makeliveTrip(trip)))
    .then(results => db.select().from('riders').orderByRaw('RANDOM()').limit(n)
      .then((riders) => {
        return results.map((trip, i) => {
          trip.rider_id = riders[i].id;
          trip.rider_profile = riders[i].profile;
          return trip;
        })
      })
    );
};

// input is like 0.9,0.8
const conversion = (rate) => {
  const a = Math.random();
  console.log(a, rate);
  if (a < rate) {
    return false;
  }
  return true;
};

const turndownRate = (surge, profile) => {
  if (surge >= 1 && surge <= 1.5) {
    return conversion(profile[0]);
  }
  if (surge >= 1.6 && surge <= 2) {
    return conversion(profile[1]);
  }
  if (surge >= 2.1 && surge <= 3) {
    return conversion(profile[2]);
  }
  if (surge >= 3.1 && surge <= 4) {
    return conversion(profile[3]);
  }
  if (surge > 4) {
    return conversion(profile[4]);
  }
};

// apply surge ratio on incoming trips
const applySurge = (trip, surge) => {
  const result = trip;
  const price = trip['base-price'] * surge;
  result['final-price'] = Math.round(price * 100) / 100;
  result['surge-ratio'] = surge;
  return Promise.resolve(result);
};


module.exports = {
  getBatchTrips,
  turndownRate,
  applySurge
};

//getBatchTrips(1000).then(() => console.log('done'));

// sample of output{
//   'pickup-x': 4038,
//   'pickup-y': 5883,
//   'dropoff-x': 6733,
//   'dropoff-y': 6775,
//   distance: 3973,
//   rider_id: 'a2be85e1-6b54-429d-93b0-b67e9f700aae',
//   'base-price': 8.74,
//   zone: 55,
//   created_at: 2017-10-31T19:25:47.767Z,
//   rider_type: { type: 'average', profile: [ 0.2, 0.3, 0.5, 0.7 ] } }