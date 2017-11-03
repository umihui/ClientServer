var AWS = require('aws-sdk');
var uuid = require('uuid');

AWS.config.loadFromPath('/Users/umihui/practice/ClientServer/server/config.json');

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