const getBatchTrips = require('./live-trip-helper');
const axios = require('axios');

let  count = 0;

const generateRandomBatch = () => {
  console.log('COUNT >>>>>>>>>>', count);
  count++;
  const n = Math.floor(Math.random() * 10);
  getBatchTrips(n)
    .then((results) => {
      results.forEach((trip) => {
        axios({
          method: 'post',
          url: 'http://localhost:3000/eyeball',
          data: trip,
        })
          .then((response) => {
            if (trip.confirm) {
              axios({
                method: 'post',
                url: 'http://localhost:3000/booking',
                data: trip,
              })
                .then(() => console.log('success booking'));
            }
          })
          .catch((err) => {
            console.log('fail', err);
          });
      });
    });
};  

// const interval = setInterval(generateRandomBatch, 500);


console.log("INTERVAL ID is", interval);
while (count > 40) {
  console.log('cleaning interval id:', interval);
  clearInterval(interval);
}