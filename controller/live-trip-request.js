const helper = require('./live-trip-helper');
const axios = require('axios');


let count = 0;
let bookingCount = 0;
let nobooking = 0;

const generateRandomBatch = () => {
  //console.log('COUNT >>>>>>>>>>', count);
  const n = Math.floor(Math.random() * 1000);
  
  helper.getBatchTrips(n)
    .then((results) => {
      results.forEach((trip) => {
        count += 1;
        console.log('COUNT BEFORE Axios >>>>>>>>', count);
        return axios({
          method: 'post',
          url: 'http://localhost:3000/eyeball',
          data: trip,
          timeout: 10000
        })
          .then((response) => {
            // response here should be surge ratio
            const confirm = helper.turndownRate(response.data, trip.rider_profile.profile);
            if (confirm) {
              bookingCount++;
              console.log('LIVE BOOKING >>>>>>>>>>', bookingCount)
              delete trip.rider_profile;
              helper.applySurge(trip, response.data)
                .then(result => axios({
                  method: 'post',
                  url: 'http://localhost:3000/booking',
                  data: trip,
                })
                  .then(() => console.log('success booking '))
                );
            } else {
              nobooking++;
              console.log('NO BOOKING', nobooking);
            }
          })
          .catch((err) => {
            console.log('fail', err);
          });
      });
    });
};  


//const interval = setInterval(generateRandomBatch, 1000);
generateRandomBatch();
generateRandomBatch();


module.exports = () => {
  const interval = setInterval(generateRandomBatch, 1000);
  return interval;
}

// console.log("INTERVAL ID is", interval);
// while (count > 40) {
//   console.log('cleaning interval id:', interval);
//   clearInterval(interval);
// }
