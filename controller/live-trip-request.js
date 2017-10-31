const getBatchTrips = require('./live-trip-helper');
const axios = require('axios');

// input is like 0.9,0.8
const conversion = (rate) => {
  const a = Math.random();
  if (a < rate) {
    return false;
  }
  return true;
};

const turndownRate = (surge, profile) => {
  console.log(surge);
  
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

const generateRandomBatch = () => {
  // console.log('COUNT >>>>>>>>>>', count);
  // count++;
  const n = Math.floor(Math.random() * 10);
  getBatchTrips(n)
    .then((results) => {
      //console.log(results);
      results.forEach((trip) => {
        axios({
          method: 'post',
          url: 'http://localhost:3000/eyeball',
          data: trip,
        })
          .then((response) => {
            // response here should be surge ratio
            console.log('SURGE', typeof response.data);
            const confirm = turndownRate(response.data, trip.rider_type.profile);
            console.log('CONFIRM', confirm)
            if (confirm) {
              trip['final-price'] = Math.round((trip['final-price'] * response.data) * 100) / 100;
              trip['surge-ratio'] = response.data;
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


// console.log("INTERVAL ID is", interval);
// while (count > 40) {
//   console.log('cleaning interval id:', interval);
//   clearInterval(interval);
// }

generateRandomBatch();

//console.log(turndownRate(2.1, [ 0.2, 0.3, 0.5, 0.7 ]));
