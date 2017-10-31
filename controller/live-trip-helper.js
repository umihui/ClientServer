const db = require('../src/db');
const Promise = require('bluebird');
const axios = require('axios');

const perMin = 20;
const perKm = 120;
const timeRatio = 1;
const minimum = 600;
// const conversionRate = 0.7;
// live data stream
// inputs : distance from db, surgeRatio, RushHour

const convertPrice = (distance) => {
  const time = (distance / 200) * timeRatio;
  const finalPrice = Math.round(((distance / 1000) * perKm) + (time * perMin));
  return finalPrice > minimum ? finalPrice : minimum;
};

const zoneNo = (x, y) => {
  const ones = Math.floor(x / 1000) + 1;
  const tens = Math.floor(y / 1000);
  return (tens * 10) + ones;
};



const makeliveTrip = (trip) => {
  const result = trip;
  delete result.id;
  result.rider_id = Math.floor(Math.random() * 200000);
  result['final-price'] = convertPrice(result.distance) / 100;
  result.zone = zoneNo(result['pickup-x'], result['pickup-y']);
  result.created_at = new Date();
  return result;
};

const getBatchTrips = (n) => {
  const values = [];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 94400;
    values.push(Math.round(a));
  }
  return db.select().from('trips')
    .whereIn('id', values)
    .then(results => results.map(trip => makeliveTrip(trip)))
    .then(results => db.select().from('riders').orderByRaw('RANDOM()').limit(n)
      .then((riders) => {
        return results.map((trip, i) => {
          trip.rider_id = riders[i].id;
          trip.rider_type = riders[i].type;
          return trip;
        })
      })
    );
};

//getBatchTrips(5);

//let  count = 0;

// const generateRandomBatch = () => {
//   console.log('COUNT >>>>>>>>>>', count);
//   count++;
//   const n = Math.floor(Math.random() * 50);
//   getBatchTrips(n)
//     .then((results) => {
//       results.forEach((trip) => {
//         axios({
//           method: 'post',
//           url: 'http://localhost:3000/test',
//           data: trip,
//         })
//           .then(() => {
//             console.log('success');
//           })
//           .catch((err) => {
//             console.log('fail', err);
//           });
//       });
//     });
// };  

// const interval = setInterval(generateRandomBatch, 500);


// console.log("INTERVAL ID is", interval);
// while (count > 40) {
//   console.log('cleaning interval id:', interval);
//   clearInterval(interval);
// }


module.exports = getBatchTrips;


// sample of output{
//   'pickup-x': 4038,
//   'pickup-y': 5883,
//   'dropoff-x': 6733,
//   'dropoff-y': 6775,
//   distance: 3973,
//   rider_id: 'a2be85e1-6b54-429d-93b0-b67e9f700aae',
//   'final-price': 8.74,
//   zone: 55,
//   created_at: 2017-10-31T19:25:47.767Z,
//   rider_type: { type: 'average', profile: [ 0.2, 0.3, 0.5, 0.7 ] } }