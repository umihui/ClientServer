const db = require('../database/db');

//first time run
for (let i = 1 ; i <= 100; i++) {
  db('surge-update-log').insert({zone: i, 'surge-ratio': 1}).then(() => true);
}

for (let i = 1; i < 200; i++) {
  const surge = {};
  surge.zone = Math.floor(Math.random() * 100);
  surge['surge-ratio'] = Math.round(((Math.random() * 4) + 1) * 10) / 10;
  setTimeout(() => db('surge-update-log').insert(surge).then(() => true), 500);
}