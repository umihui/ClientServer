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

const surgeRate = { '1': { mult: 1 },
'2': { mult: 1 },
'3': { mult: 1 },
'4': { mult: 1 },
'5': { mult: 1 },
'6': { mult: 1 },
'7': { mult: 1 },
'8': { mult: 1 },
'9': { mult: 1 },
'10': { mult: 1 },
'11': { mult: 1 },
'12': { mult: 1 },
'13': { mult: 1 },
'14': { mult: 1 },
'15': { mult: 1 },
'16': { mult: 1 },
'17': { mult: 1 },
'18': { mult: 1 },
'19': { mult: 1 },
'20': { mult: 1 },
'21': { mult: 1 },
'22': { mult: 1 },
'23': { mult: 1 },
'24': { mult: 1 },
'25': { mult: 1 },
'26': { mult: 1 },
'27': { mult: 1 },
'28': { mult: 1 },
'29': { mult: 1 },
'30': { mult: 1 },
'31': { mult: 1 },
'32': { mult: 1 },
'33': { mult: 1 },
'34': { mult: 1 },
'35': { mult: 1 },
'36': { mult: 1 },
'37': { mult: 1 },
'38': { mult: 1 },
'39': { mult: 1 },
'40': { mult: 1 },
'41': { mult: 1 },
'42': { mult: 1 },
'43': { mult: 1 },
'44': { mult: 1 },
'45': { mult: 1 },
'46': { mult: 1 },
'47': { mult: 1 },
'48': { mult: 1 },
'49': { mult: 1 },
'50': { mult: 1 },
'51': { mult: 1 },
'52': { mult: 1 },
'53': { mult: 1 },
'54': { mult: 1 },
'55': { mult: 1 },
'56': { mult: 1 },
'57': { mult: 1 },
'58': { mult: 1 },
'59': { mult: 1 },
'60': { mult: 1 },
'61': { mult: 1 },
'62': { mult: 1 },
'63': { mult: 1 },
'64': { mult: 1 },
'65': { mult: 1 },
'66': { mult: 1 },
'67': { mult: 1 },
'68': { mult: 1 },
'69': { mult: 1 },
'70': { mult: 1 },
'71': { mult: 1 },
'72': { mult: 1 },
'73': { mult: 1 },
'74': { mult: 1 },
'75': { mult: 1 },
'76': { mult: 1 },
'77': { mult: 1 },
'78': { mult: 1 },
'79': { mult: 1 },
'80': { mult: 1 },
'81': { mult: 1 },
'82': { mult: 1 },
'83': { mult: 1 },
'84': { mult: 1 },
'85': { mult: 1 },
'86': { mult: 1 },
'87': { mult: 1 },
'88': { mult: 1 },
'89': { mult: 1 },
'90': { mult: 1 },
'91': { mult: 1 },
'92': { mult: 1 },
'93': { mult: 1 },
'94': { mult: 1 },
'95': { mult: 1 },
'96': { mult: 1 },
'97': { mult: 1 },
'98': { mult: 1 },
'99': { mult: 1 },
'100': { mult: 1 } }

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
      if (cache[msg.zone]) {
        cache[msg.zone] += 1;
      } else {
        cache[msg.zone] = 1;
      }
    }
  }

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork().on('message', messageHandler);
  }

  setInterval(() => {
    console.log('EYEBALL RECEIVE >>>>',count);
  }, 1000);


  setInterval(() => 
  sendEyeball(cache, (err, result) => {  
    if (err) {
      console.log('FAIL SEND', err);
    } else {
      console.log('Send eyeball',cache);
      cache = {};
    }
  }), 10000);

  //setInterval(setupConsumers, 5000);

  setInterval(() => {
    if (tripCache.length > 0) {
      const cache = tripCache;
      tripCache = [];
      Util.storeTrip(cache)
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
    process.send({ cmd: 'notifyRequest', zone: zone });
    trip.status = 'pending';
    tripCache.push(trip);
    const surge = surgeRate[zone].mult;
    trip['surge-ratio'] = surge;
    res.status(201).json(surge);
    // Util.getSurgeRatioByZone(trip.zone)
    //   .then((result) => {
    //     const surge = Number(result['surge-ratio']);
    //     trip['surge-ratio'] = surge;
    //     res.status(201).json(surge);
    //   })

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

  // const storeDB = setInterval(() => {
  //   if (tripCache.length > 0) {
  //     const cache = tripCache;
  //     tripCache = [];
  //     Util.storeTrip(cache)
  //       // .then(() => {
          
  //         // const bulktrip = cache.map(ele => {return {trip: ele}});
  //         // console.log('elastic', bulktrip);
  //         // elastic.client.bulk({
  //         //   index: 'trips',
  //         //   body: bulktrip}, (err, result) => {
  //         //   if(err) {console.log('elastic',err)}
  //         //   else {
  //         //     console.log('elastic SUCCESS');          
  //         //   }
  //         // })
  //       //   //cache.forEach((trip) => elastic.addToIndex(trip).then(()=> console.log('add index elastic success')).catch((err)=>console.log('elastic',err)))
  //       // });
      
  //   }  
  // }, 1000);

    app.listen(port, () => {
      console.log(`Worker started`);
    });

  
}