const helper = require('./live-trip-helper');
const axios = require('axios');

let count = 0;

const generateRandomBatch = () => {
  console.log('COUNT >>>>>>>>>>', count);
  count += 1;
  const n = Math.floor(Math.random() * 100);
  helper.getBatchTrips(n)
    .then((results) => {
      results.forEach((trip) => {
        return axios({
          method: 'post',
          url: 'http://localhost:3000/eyeball',
          data: trip,
        })
          .then((response) => {
            // response here should be surge ratio
            console.log('TEST >>>>>', response.data, trip.rider_profile.profile);
            const confirm = helper.turndownRate(response.data, trip.rider_profile.profile);
            if (confirm) {
              delete trip.rider_profile;
              helper.applySurge(trip, response.data)
                .then(result => axios({
                  method: 'post',
                  url: 'http://localhost:3000/booking',
                  data: trip,
                })
                  .then(() => console.log('success booking'))
                );
            } else {
              console.log('NO BOOKING');
            }
          })
          .catch((err) => {
            console.log('fail', err);
          });
      });
    });
};  


const interval = setInterval(generateRandomBatch, 500);

while (count > 40) {
  console.log('cleaning interval id:', interval);
  clearInterval(interval);
}

// console.log("INTERVAL ID is", interval);
// while (count > 40) {
//   console.log('cleaning interval id:', interval);
//   clearInterval(interval);
// }
