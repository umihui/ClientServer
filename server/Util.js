const db = require('../database/db');
const axios = require('axios');
const Promise = require('bluebird');
//const elastic = require('../database/elastic-search');

// get the latest surge-ratio from db
// output : { 'surge-ratio': '1.4' } value is string
const getSurgeRatioByZone = zoneNum => db('surge-update-log')
  .where('zone', zoneNum)
  .select('surge-ratio')
  .orderBy('created_at', 'desc')
  .first();

//getSurgeRatioByZone(1).then(()=> console.log('done'));
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

// store trip in database 


const storeTrip = (trips) => {
  const size = trips.length;
  return db.batchInsert('requests', trips, size)
    .then(() => console.log('DATABASE BATCH INSERT', new Date()))
    .catch(function(error) { console.log('BATCH',error)});
};




module.exports.eyeballsByZone = eyeballsByZone;
module.exports.getSurgeRatioByZone = getSurgeRatioByZone;
module.exports.storeTrip = storeTrip;