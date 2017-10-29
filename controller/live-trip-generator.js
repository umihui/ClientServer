const db = require('../src/db');
const Promise = require('bluebird');
const axios = require('axios');
const http = require('http');

const perMin = 0.2;
const perKm = 1.2;
const timeRatio = 1;
const minimum = 6;
const conversionRate = 0.7;
// live data stream
// inputs : distance from db, surgeRatio, RushHour
const convertPrice = (distance) => {
  const time = (distance / 200) * timeRatio;
  const finalPrice = (distance / 1000 * perKm + time * perMin).toFixed(2);
  return finalPrice > minimum ? finalPrice : minimum ;
};

const zoneNo = (x, y) => {
  const ones = Math.floor(x / 1000) + 1;
  const tens = Math.floor(y / 1000);
  return (tens * 10) + ones;
};

// input is like 0.9,0.8
const conversion = (rate) => {
  const a = Math.random();
  if (a < rate) {
    return true;
  }
  return false;
};

const makeliveTrip = (trip) => {
  const result = trip;
  delete result.id;
  result.rider_id = Math.floor(Math.random() * 200000);
  result['final-price'] = Number(convertPrice(result.distance));
  result.zone = zoneNo(result['pickup-x'], result['pickup-y']);
  result.confirm = conversion(conversionRate);
  result.created_at = new Date();
  return result;
};

const getBatchTrips = (n) => {
  const values = [];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 94769;
    values.push(Math.round(a));
  }
  return db.select().from('trips')
    .whereIn('id', values)
    .then(results => results.map(trip => makeliveTrip(trip)));
};

const generateRandomBatch = () => {
  const n = Math.floor(Math.random() * 10);
  getBatchTrips(n)
    .then((results) => {
      results.forEach((trip) => {
        axios({
          method: 'post',
          url: 'http://localhost:3000/test',
          data: trip,
        })
          .then(() => {
            console.log('success');
          })
          .catch((err) => {
            console.log('fail', err);
          });
      });
    });
}

//setInterval(generateRandomBatch, 500);

module.exports = getBatchTrips;
