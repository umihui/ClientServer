const uuid = require('uuid');
const db = require('../database/db');

const type = {
  student: [0.4, 0.6, 0.8, 1, 1],
  average: [0.2, 0.3, 0.5, 0.7, 1],
  elite: [0, 0.1, 0.3, 0.6, 0.9],
};

for (let i = 0; i < 100000; i++) {
  const rider = { id: uuid.v4() };
  const a = Math.random();
  if (a < 0.2) {
    rider.type = 'student';
    rider.profile = { profile: type.student };
  } else if (a > 0.8) {
    rider.type = 'elite';
    rider.profile = { profile: type.elite };
  } else {
    rider.type = 'average';
    rider.profile = { profile: type.average };
  }
  db('riders').insert(rider).then(() => true);
}

console.log('done');
