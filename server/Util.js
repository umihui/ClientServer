const db = require('../src/db');
const axios = require('axios');
const Promise = require('bluebird');

// get the latest surge-ratio from db
// output : { 'surge-ratio': '1.4' } value is string
const getSurgeRatioByZone = (zoneNum) => {
  return db('surge-update-log')
    .where('zone',zoneNum)
    .select('surge-ratio')
    .orderBy('created_at', 'desc')
    .first();
};

// apply surge ratio on incoming trips
const applySurge = (trip, surge) => {
  const result = trip;
  const price = trip['final-Price'] * surge;
  result['final-Price'] = Math.round(price * 100) / 100;
  return Promise.resolve(result);
};

const sendBooking = (booking) => {
  console.log('axios', booking);
  return axios({
    method: 'post',
    url: 'http://localhost:8080/bookings',
    data: booking,
  });
};

// batching trips in cache
const eyeballsByZone = (cache, callback) => {
  const temp = {};
  cache.forEach((trip) => {
    temp[trip.zone] ? temp[trip.zone] += 1 : temp[trip.zone] = 1;
  });
  const result = [];
  for(var key in temp) {
    result.push({zone: Number(key), eyeballs: temp[key]});
  }
  callback(result);
}


const sendEyeballs = (eyeballs) => {
  return axios({
    method: 'post',
    url: 'http://localhost:8080/eyeballs',
    data: eyeballs,
  });
};

module.exports.eyeballsByZone = eyeballsByZone;
module.exports.applySurge = applySurge;
module.exports.sendBooking = sendBooking;
module.exports.sendEyeballs = sendEyeballs;
module.exports.getSurgeRatioByZone = getSurgeRatioByZone; 
