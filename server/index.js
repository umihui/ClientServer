const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Util = require('./Util');
const addToIndex = require('../controller/elastic-search');

const app = express();
const port = 3000;

const cache = [];

app.use(bodyParser.json());


// take in user request
// convert to eyeball in memory
// apply surge rate on true booking
// send booking to messege bus
// send eyeball sum to surge per 10 seconds

app.post('/test', (req, res) => {
  console.log('Server connect', req.body);
  const trip = req.body
  cache.push(trip);
  if (trip.confirm) {
    Util.getSurgeRatioByZone(trip.zone)
      .then((result) => {
        let surge = Number(result['surge-ratio']);
        Util.applySurge(trip, surge)
          .then(booking => addToIndex(booking))
          .then(() => console.log('sendbooking success'));
      })
  }
});


// setInterval(() => console.log('interval', cache), 10000);

app.listen(port, () => {
  console.log(`Shortly is listening on ${port}`);
});
