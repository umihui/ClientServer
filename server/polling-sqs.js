
const Consumer = require('sqs-consumer');
const AWS = require('aws-sdk');
const db = require('../database/db');
const config = require('./config.js').incomingSQS;


AWS.config.update({
  region: 'us-west-2',
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
});


module.exports = setupConsumers = () => {
  console.log('POLLING start', new Date());
  const app = Consumer.create({
    queueUrl: 'https://sqs.us-west-2.amazonaws.com/373986200290/multipliers-to-client',
    handleMessage: (message, done) => {
      console.log('polling',new Date(), message.Body);
      const data = JSON.parse(message.Body);
      data.multipliers.forEach(function(element) {
        const surge = {zone: element.zone, "surge-ratio": element.multiplier}
        return db('surge-update-log').insert(surge).then(() => true).catch(err => console.log(err));
      });
      done();
    },
    sqs: new AWS.SQS()
  });
  
  app.on('error', (err) => {
    console.log(err.message);
  });
  
  app.start();
};


