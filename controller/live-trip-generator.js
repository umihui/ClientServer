const db = require('../src/db');
const Promise = require('bluebird');

const zones = [
  [91,92,93,94,95,96,97,98,99,100],
  [81,82,83,84,85,86,87,88,89,90],
  [71,72,73,74,75,76,77,78,79,80],
  [61,62,63,64,65,66,67,68,69,70],
  [51,52,53,54,55,56,57,58,59,60],
  [41,42,43,44,45,46,47,48,49,50],
  [31,32,33,34,35,36,37,38,39,40],
  [21,22,23,24,25,26,27,28,29,30],
  [11,12,13,14,15,16,17,18,19,20],
  [1,2,3,4,5,6,7,8,9,10]
];

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

const findZone = (x, y) => {
  let i,j;
  if (x === 10000) {
    i = 9;
  } else {
    i = Math.floor(x/1000);
  }
  if (y === 10000) {
    j = 0;
  } else {
    j = 9 - Math.floor(y/1000);
  }
  return zones[j][i];
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
  trip.finalPrice = convertPrice(trip.distance);
  trip.zone = findZone(trip['pickup-x'],trip['pickup-y']);
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
  .then(results => results.map(trip => console.log(makeliveTrip(trip))));
};

getBatchTrips(5);
