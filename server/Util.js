const db = require('../database/db');
const axios = require('axios');
const Promise = require('bluebird');

// get the latest surge-ratio from db
// output : { 'surge-ratio': '1.4' } value is string
const getSurgeRatioByZone = zoneNum => db('surge-update-log')
  .where('zone', zoneNum)
  .select('surge-ratio')
  .orderBy('created_at', 'desc')
  .first();


// batching trips in cache
const eyeballsByZone = (cache, callback) => {
  const temp = {};
  cache.forEach((zone) => {
    if (temp[zone]) {
      temp[zone] += 1;
    } else {
      temp[zone] = 1;
    }
  });
  callback(temp);
};




module.exports.eyeballsByZone = eyeballsByZone;
module.exports.getSurgeRatioByZone = getSurgeRatioByZone;
