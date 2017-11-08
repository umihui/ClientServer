const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Util = require('./Util');
const elastic = require('../database/elastic-search');
const db = require('../database/db');
const sendBooking = require('./booking-sending');
const sendEyeball = require('./eyeball-sending');
const setupConsumers = require('./polling-sqs');


var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {

  const app = express();
  const port = 3000;
//store incoming eyeball, send every 10s
let cache = {};
let count = 0;
let dbCount = 0;
let bookingCount = 0;
let sqsCount = 0;
let eyeballRes = 0;


app.use(bodyParser.json());


app.post('/eyeball', (req, res) => {
  count += 1;
  console.log('EYEBALL RECEIVE >>>>',count);
  const trip = req.body;
  delete trip.rider_profile;
  console.log('TRIP', trip);
  if (cache[trip.zone]) {
    cache[trip.zone] += 1;
  } else {
    cache[trip.zone] = 1;
  }
  trip.status = 'pending';
  Util.getSurgeRatioByZone(trip.zone)
    .then((result) => {
      const surge = Number(result['surge-ratio']);
      trip['surge-ratio'] = surge;
      eyeballRes++;
      console.log('EYE RESPONSE', eyeballRes);
      res.status(201).json(surge);
      // db('requests').insert(trip)
      //   .then(() => {
      //     dbCount++;
      //     console.log('addindex >>>>>>>>>', dbCount);
      //     elastic.addToIndex(trip)
            
      //   })
    })
});


// confirm booking come with surge price
// send booking to messege bus
// send eyeball sum to surge per 10 seconds

app.post('/booking', (req, res) => {
  bookingCount++
  const trip = req.body;
  console.log('BOOKING >>>>>>>', bookingCount);
  delete trip.rider_type;
  trip.status = 'accepted';
  sendBooking(trip, (err, result) => {
    if (err) {
      console.log('FAIL SEND', err)
    } else {
      sqsCount++;
      console.log('SQS BOOKING', sqsCount);
      res.status(200).end();
    }
  })



  // db('requests')
  //   .where('rider_id', trip.rider_id)
  //   .update(trip)
  //      // send booking to SQS
  //     .then(() => sendBooking(trip, (err, result) => {
  //       if (err) {
  //         console.log('FAIL SEND', err)
  //       } else {
  //         sqsCount++;
  //         console.log('SQS BOOKING', sqsCount);
  //         res.status(200).end();
  //       }
  //     })) 
});


const sendEyeballInterval = setInterval(() => 
  sendEyeball(cache, (err, result) => {  
    if (err) {
      console.log('FAIL SEND', err);
    } else {
      console.log('Send eyeball',cache);
      cache = {};
      console.log('after',cache);
    }
  }), 10000);




  module.exports = app.listen(port, () => {
  console.log(`Shortly is listening on ${port}`);
});

const getSurgeRate = setInterval(setupConsumers, 5000);
}