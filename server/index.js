

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Util = require('./Util');
const elastic = require('../database/elastic-search');
const db = require('../database/db');
const sendBooking = require('./booking-sending');
const sendEyeball = require('./eyeball-sending');
const setupConsumers = require('./polling-sqs');
const responseTime = require('response-time');


let cache = {};
let tripCache = [];
let count = 0;
let dbCount = 0;
let bookingCount = 0;
let sqsCount = 0;
let eyeballRes = 0;

  const app = express();
  const port = 3000;
  //store incoming eyeball, send every 10s



  app.use(bodyParser.json());
  app.use(responseTime());

  app.post('/eyeball', (req, res) => {
    count++;
    console.log('EYE receive', count);
    const trip = req.body;
    delete trip.rider_profile;
    
    //console.log('TRIP', trip);
    if (cache[trip.zone]) {
      cache[trip.zone] += 1;
    } else {
      cache[trip.zone] = 1;
    }
    trip.status = 'pending';
    tripCache.push(trip);
    Util.getSurgeRatioByZone(trip.zone)
      .then((result) => {
        const surge = Number(result['surge-ratio']);
        trip['surge-ratio'] = surge;
        // eyeballRes++;
        // console.log('EYE RESPONSE', eyeballRes);
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

  const storeDB = setInterval(() => {
    if (tripCache.length > 0) {
      const cache = tripCache;
      tripCache = [];
      Util.storeTrip(cache)
        .then(() => {
          // const bulktrip = cache.map(ele => {return {trip: ele}});
          // console.log('elastic', bulktrip);
          // elastic.client.bulk({
          //   index: 'trips',
          //   body: bulktrip}, (err, result) => {
          //   if(err) {console.log('elastic',err)}
          //   else {
          //     console.log('elastic SUCCESS');          
          //   }
          // })
          cache.forEach((trip) => elastic.addToIndex(trip).then(()=> console.log('add index elastic success')).catch((err)=>console.log('elastic',err)))
        });
      
    }  
  }, 1000);

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




    app.listen(port, () => {
    console.log(`Worker started`);
  });

  const getSurgeRate = setInterval(setupConsumers, 5000);
