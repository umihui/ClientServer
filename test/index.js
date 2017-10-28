const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 8080;


app.use(bodyParser.json());

app.post('/bookings', (req, res) => {
  console.log('Server connect', req.body);
});

app.post('/eyeballs', (req, res) => {
  console.log('Server connect', req.body);
});


app.listen(port, () => {
  console.log(`Shortly is listening on ${port}`);
});
