const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Util = require('./Util');
const elastic = require('../controller/elastic-search');
const db = require('../src/db');
const sendBooking = require('./booking-sending');
const sendEyeball = require('./eyeball-sending');

const app = express();
const port = 3000;

const cache = {};

app.use(bodyParser.json());


// take in user request
// convert to eyeball in memory
// apply surge rate on  booking
// response with surge price


app.post('/eyeball', (req, res) => {
  const trip = req.body;
  delete trip.rider_profile;
  console.log('TRIP', trip);
  if (cache[trip.zone]) {
    cache[trip.zone] += 1;
  } else {
    cache[trip.zone] = 1;
  }
  db('requests').insert(trip)
    .then(() => {
      console.log('addindex', trip);
      elastic.addToIndexEyeball(trip)
        .then(() => {       
          Util.getSurgeRatioByZone(trip.zone)
            .then((result) => {
              const surge = Number(result['surge-ratio']);
              res.status(201).json(surge);;
            });
        });
    });
});


// confirm booking come with surge price
// send booking to messege bus
// send eyeball sum to surge per 10 seconds

app.post('/booking', (req, res) => {
  const trip = req.body;
  //console.log('BOOKING >>>>>>>', trip);
  delete trip.rider_type;
  db('requests')
    .where('rider_id', trip.rider_id)
    .update(trip)
    .then(() => {
      console.log('ELASTIC SEARCH BOOKING',trip);
      return elastic.addToIndex(trip)
       // send booking to SQS
      .then(() => sendBooking(trip, (err, result) => {
        if (err) {
          console.log('FAIL SEND', err)
        } else {
          res.status(200).end();
        }
      }))
    })
 
});

const sendEyeballInterval = setInterval(() => {
  sendEyeball(cache, (err, result) => {  
    if (err) {
      console.log('FAIL SEND', err)
    } else {
      console.log('Send eyeball');
    }
  }), 10000);




app.listen(port, () => {
  console.log(`Shortly is listening on ${port}`);
});