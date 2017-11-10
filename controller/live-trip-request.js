const helper = require('./live-trip-helper');
const axios = require('axios');


let sendCount = 0;
let resCount = 0;
let bookingCount = 0;
let nobooking = 0;

let sendAmount = 0;

const requestBooking = (trip) => {
  return axios({
    method: 'post',
    url: 'http://localhost:8080/booking',
    data: trip,
    //timeout: 10000
  })
    .then((response) => console.log('success booking ', response.headers))
    .catch((err) => {
      console.log('fail', err.config.url);
    });
}

const generateRandomBatch = () => {
  //console.log('COUNT >>>>>>>>>>', count);
  const n = Math.floor(Math.random() * 1000);
  sendAmount += n;
  helper.getBatchTrips(n)
    .then((results) => {
      results.forEach((trip) => {
        sendCount += 1;
        console.log('COUNT BEFORE Axios >>>>>>>>', sendCount);
        return axios({
          method: 'post',
          url: 'http://localhost:3000/eyeball',
          data: trip,
          //timeout: 15000
        })
          .then((response) => {
            resCount++;
            console.log('COUNT Axios response >>>>>>>>', resCount, response.headers);
            // response here should be surge ratio
            const confirm = helper.turndownRate(response.data, trip.rider_profile.profile);
            if (confirm) {
              bookingCount++;
              console.log('LIVE BOOKING >>>>>>>>>>', bookingCount)
              delete trip.rider_profile;
              helper.applySurge(trip, response.data)
                .then(result => axios({
                  method: 'post',
                  url: 'http://localhost:8080/booking',
                  data: trip,
                  //timeout: 10000
                })
                  .then((response) => console.log('success booking ', response.headers))
                  .catch((err) => {
                    console.log('fail', err.config.url);
                  })
                );
            } else {
              nobooking++;
              console.log('NO BOOKING', nobooking);
            }
          })
          .catch((err) => {
            console.log('fail', err.config.url);
          });
      });
    });
};  


// while (sendAmount < 10000) {
//   generateRandomBatch();
// }

function runAThousand() {
  if (sendAmount >= 10000) {
    return;
  }
  generateRandomBatch();
  setTimeout(runAThousand, 1000);
}

runAThousand();

//const interval = setInterval(generateRandomBatch, 1000);


// module.exports = () => {
//   const interval = setInterval(generateRandomBatch, 1000);
//   return interval;
// }

// console.log("INTERVAL ID is", interval);
// while (count > 40) {
//   console.log('cleaning interval id:', interval);
//   clearInterval(interval);
// }
