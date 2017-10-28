const db = require('../src/db');

const test = [
   { 'pickup-x': 6812,
    'pickup-y': 8707,
    'dropoff-x': 4226,
    'dropoff-y': 2785,
    distance: 9047,
    rider_id: 146737,
    finalPrice: 19.9,
    zone: 87,
    confirm: false,
    created_at: '2017-10-28T02:33:54.010Z' },
  { 'pickup-x': 207,
    'pickup-y': 3183,
    'dropoff-x': 5478,
    'dropoff-y': 4608,
    distance: 7644,
    rider_id: 43910,
    finalPrice: 16.82,
    zone: 31,
    confirm: false,
    created_at: '2017-10-28T02:33:54.010Z' },
  { 'pickup-x': 3506,
    'pickup-y': 2223,
    'dropoff-x': 4943,
    'dropoff-y': 5680,
    distance: 5240,
    rider_id: 33629,
    finalPrice: 11.53,
    zone: 24,
    confirm: false,
    created_at: '2017-10-28T02:33:54.010Z'},
  { 'pickup-x': 5773,
    'pickup-y': 8266,
    'dropoff-x': 1147,
    'dropoff-y': 6144,
    distance: 7125,
    rider_id: 174664,
    finalPrice: 15.67,
    zone: 86,
    confirm: false,
    created_at: '2017-10-28T02:33:54.010Z'},
  { 'pickup-x': 6131,
    'pickup-y': 2580,
    'dropoff-x': 8367,
    'dropoff-y': 9896,
    distance: 10710,
    rider_id: 77513,
    finalPrice: 23.56,
    zone: 27,
    confirm: true,
    created_at: '2017-10-28T02:33:54.010Z'}];

const eyeballsByZone = (cache, callback) => {
  const temp = {};
  cache.forEach( (trip) => {
    console.log(trip);
    temp[trip.zone] ? temp[trip.zone] += 1 : temp[trip.zone] = 1;
  })
  const result = [];
  for(var key in temp) {
    result.push({zone: Number(key), eyeballs: temp[key]});
  }
  callback(result);
}
