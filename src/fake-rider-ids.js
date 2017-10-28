const uuid = require('uuid');
const db = require('./db');


for (let i = 0; i < 100000; i++) {
  const id = { rider_id: uuid.v4() };
  db('riders').insert(id).then(() => true);
}

console.log('done');
