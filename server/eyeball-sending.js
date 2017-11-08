var AWS = require('aws-sdk');
var uuid = require('uuid');
const config = require('./config.js').outingSQS;

AWS.config.update({
  region: 'us-west-2',
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
});

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {
  MessageDeduplicationId: uuid.v4(),
  MessageGroupId: 'eyeball',
  QueueUrl: "https://sqs.us-west-2.amazonaws.com/732562083814/client-to-surge.fifo"
};

module.exports = sendEyeball = (message, cb) =>{ 
  params.MessageBody = JSON.stringify(message);
  sqs.sendMessage(params, function(err, data) {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data.MessageId);
    }
  })
};