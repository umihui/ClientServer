const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());


// take in user request
// convert to eyeball in memory
// apply surge rate on true booking
  // read surge rate from db
// send booking to messege bus
// send eyeball sum to surge per 10 seconds
// schema design

app.post('/test', (req, res) => {
  console.log('Server connect', req.body);
});

app.listen(port, () => {
  console.log(`Shortly is listening on ${port}`);
});
