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

let surgeRate = { '1': '1.8',
'2': '1.8',
'3': '2.0',
'4': '2.0',
'5': '2.0',
'6': '2.0',
'7': '2.1',
'8': '2.1',
'9': '2.1',
'10': '2.1',
'11': '1.8',
'12': '1.8',
'13': '2.0',
'14': '2.0',
'15': '2.0',
'16': '2.0',
'17': '2.1',
'18': '2.1',
'19': '2.1',
'20': '2.1',
'21': '1.8',
'22': '1.8',
'23': '2.0',
'24': '2.0',
'25': '2.0',
'26': '1.0',
'27': '1.0',
'28': '1.0',
'29': '1.0',
'30': '1.0',
'31': '1.0',
'32': '1.0',
'33': '1.0',
'34': '1.0',
'35': '1.0',
'36': '1.0',
'37': '1.0',
'38': '1.0',
'39': '1.0',
'40': '1.0',
'41': '1.0',
'42': '1.0',
'43': '1.0',
'44': '1.0',
'45': '1.0',
'46': '1.0',
'47': '1.0',
'48': '1.0',
'49': '1.0',
'50': '1.0',
'51': '1.0',
'52': '1.0',
'53': '1.0',
'54': '1.0',
'55': '1.0',
'56': '1.0',
'57': '1.0',
'58': '1.0',
'59': '1.0',
'60': '1.0',
'61': '1.0',
'62': '1.0',
'63': '1.0',
'64': '1.0',
'65': '1.0',
'66': '1.0',
'67': '1.0',
'68': '1.0',
'69': '1.0',
'70': '1.0',
'71': '1.0',
'72': '1.0',
'73': '1.0',
'74': '1.0',
'75': '1.0',
'76': '1.9',
'77': '1.0',
'78': '1.0',
'79': '1.0',
'80': '1.0',
'81': '1.8',
'82': '1.8',
'83': '1.0',
'84': '1.9',
'85': '1.9',
'86': '1.9',
'87': '1.9',
'88': '1.9',
'89': '1.9',
'90': '1.0',
'91': '1.0',
'92': '1.8',
'93': '1.8',
'94': '1.0',
'95': '1.9',
'96': '1.9',
'97': '1.0',
'98': '1.0',
'99': '1.0',
'100': '1.0' }

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
let cache = {};
let tripCache = [];
let count = 0;
let dbCount = 0;
let bookingCount = 0;
let sqsCount = 0;
let eyeballRes = 0;

if (cluster.isMaster) {
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      count += 1;
      tripCache.push(msg.trip);
      if (cache[msg.trip.zone]) {
        cache[msg.trip.zone] += 1;
      } else {
        cache[msg.trip.zone] = 1;
      }
    }
  }

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork().on('message', messageHandler);
  }

  setInterval(() => {
    console.log('EYEBALL RECEIVE >>>>',count);
  }, 1000);

  
  setInterval(() => {
    Util.getSurgeRateUpdate().then(result => {
      console.log('got surge rate', result);
      surgeRate = result;
    })
  }, 5000);
  
  setInterval(() => 
    sendEyeball(cache, (err, result) => {  
      if (err) {
        console.log('FAIL SEND', err);
      } else {
        console.log('Send eyeball',cache);
        cache = {};
      }
    }), 10000);

  setInterval(setupConsumers, 5000);

  setInterval(() => {
    console.log('store database')
    if (tripCache.length > 0) {
      const temp = tripCache;
      tripCache = [];
      Util.storeTrip(temp)
        // .then(() => {
          
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
        //   //cache.forEach((trip) => elastic.addToIndex(trip).then(()=> console.log('add index elastic success')).catch((err)=>console.log('elastic',err)))
        // });
      
    }  
  }, 1000);
  

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });

} else {

  const app = express();
  const port = 3000;
  // //store incoming eyeball, send every 10s




  // app.post('/booking', (req, res) => {
  //   bookingCount++
  //   const trip = req.body;
  //   console.log('BOOKING >>>>>>>', bookingCount);
  //   delete trip.rider_type;
  //   trip.status = 'accepted';
  //   sendBooking(trip, (err, result) => {
  //     if (err) {
  //       console.log('FAIL SEND', err)
  //     } else {
  //       sqsCount++;
  //       console.log('SQS BOOKING', sqsCount);
  //       res.status(200).end();
  //     }
  //   })



  //   // db('requests')
  //   //   .where('rider_id', trip.rider_id)
  //   //   .update(trip)
  //   //      // send booking to SQS
  //   //     .then(() => sendBooking(trip, (err, result) => {
  //   //       if (err) {
  //   //         console.log('FAIL SEND', err)
  //   //       } else {
  //   //         sqsCount++;
  //   //         console.log('SQS BOOKING', sqsCount);
  //   //         res.status(200).end();
  //   //       }
  //   //     })) 
  // });

  app.use(bodyParser.json());
  app.use(responseTime());

  app.post('/eyeball', (req, res) => {

    const trip = req.body;
    delete trip.rider_profile;
    const zone = trip.zone;
    trip.status = 'pending';
    process.send({ cmd: 'notifyRequest', trip: trip });
    
    //tripCache.push(trip);
    const surge = surgeRate[zone];
    trip['surge-ratio'] = surge;
    res.status(201).json(surge);
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
    res.status(200).end();
    sendBooking(trip, (err, result) => {
      if (err) {
        console.log('FAIL SEND', err)
      } else {
        sqsCount++;
        console.log('SQS BOOKING', sqsCount);        
      }
    })

  });

  app.listen(port, () => {
    console.log(`Worker started`);
  });

  
}