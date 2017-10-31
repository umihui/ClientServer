const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Util = require('./Util');
const elastic = require('../controller/elastic-search');
const db = require('../src/db');

const app = express();
const port = 3000;

const cache = [];

app.use(bodyParser.json());


// take in user request
// convert to eyeball in memory
// apply surge rate on  booking
// response with surge price


app.post('/eyeball', (req, res) => {
  const trip = req.body
  cache.push(trip.zone);
  db('requests').insert(trip)
    .then(() => {
      console.log('addindex', trip);
      elastic.addToIndex(trip)
        .then(() => res.end());
    });
    // .then(() => {
    //   if (trip.confirm) {
    //     Util.getSurgeRatioByZone(trip.zone)
    //       .then((result) => {
    //         const surge = Number(result['surge-ratio']);
    //         Util.applySurge(trip, surge)
    //           .then(booking => Util.sendBooking(booking))
    //           .then(() => console.log('sendbooking success'));
    //       })
    //   }
    // })
    
});


// confirm booking come with surge price
// send booking to messege bus
// send eyeball sum to surge per 10 seconds

app.post('/booking', (req, res) => {
  const trip = req.body;

});


// setInterval(() => console.log('interval', cache), 10000);

app.listen(port, () => {
  console.log(`Shortly is listening on ${port}`);
});
