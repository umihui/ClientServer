const getBatchTrips = require('./live-trip-helper');
const axios = require('axios');

// input is like 0.9,0.8
const conversion = (rate) => {
  const a = Math.random();
  console.log(a, rate);
  if (a < rate) {
    return false;
  }
  return true;
};

const turndownRate = (surge, profile) => {
  if (surge >= 1 && surge <= 1.5) {
    return conversion(profile[0]);
  }
  if (surge >= 1.6 && surge <= 2) {
    return conversion(profile[1]);
  }
  if (surge >= 2.1 && surge <= 3) {
    return conversion(profile[2]);
  }
  if (surge >= 3.1 && surge <= 4) {
    return conversion(profile[3]);
  }
  if (surge > 4) {
    return conversion(profile[4]);
  }
};

let count = 0;

const generateRandomBatch = () => {
  console.log('COUNT >>>>>>>>>>', count);
  count += 1;
  const n = Math.floor(Math.random() * 50);
  getBatchTrips(n)
    .then((results) => {
      results.forEach((trip) => {
        return axios({
          method: 'post',
          url: 'http://localhost:3000/eyeball',
          data: trip,
        })
          .then((response) => {
            // response here should be surge ratio\
            console.log('TEST >>>>>', trip.rider_profile.profile);
            const confirm = turndownRate(response.data, trip.rider_profile.profile);
            if (confirm) {
              delete trip.rider_profile;
              trip['final-price'] = Math.round((trip['final-price'] * response.data) * 100) / 100;
              trip['surge-ratio'] = response.data;
              axios({
                method: 'post',
                url: 'http://localhost:3000/booking',
                data: trip,
              })
                .then(() => console.log('success booking'));
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
