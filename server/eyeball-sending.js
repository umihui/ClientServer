var AWS = require('aws-sdk');

AWS.config.loadFromPath('/Users/umihui/practice/ClientServer/server/config.json');

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {
 QueueUrl: "https://sqs.us-west-1.amazonaws.com/732562083814/client-eyeball-sending"
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