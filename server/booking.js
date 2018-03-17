

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Util = require('./Util');
const elastic = require('../database/elastic-search');
const db = require('../database/db');
const sendBooking = require('./booking-sending');
const setupConsumers = require('./polling-sqs');
const responseTime = require('response-time');


let cache = {};
let tripCache = [];
let count = 0;
let dbCount = 0;
let bookingCount = 0;
let sqsCount = 0;
let eyeballRes = 0;

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const app = express();
  const port = 8080;
  
  app.use(bodyParser.json());
  app.use(responseTime());
  
  // confirm booking come with surge price
  // send booking to messege bus
  // send eyeball sum to surge per 10 seconds
  
  app.post('/booking', (req, res) => {
    bookingCount++
    const trip = req.body;
    console.log(process.pid,'BOOKING >>>>>>>', bookingCount);
    delete trip.rider_type;
    trip.status = 'accepted';
    res.status(200).end();
    sendBooking(trip, (err, result) => {
      if (err) {
        console.log('FAIL SEND', err)
      } else {
        sqsCount++;
        console.log(process.pid, 'SQS BOOKING', sqsCount);
  
      }
    })
  });
  
  app.listen(port, () => {
    console.log(`Worker started`,port);
  });  

}

