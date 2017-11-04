var AWS = require('aws-sdk');
var uuid = require('uuid');
var md5 = require('md5');
var Producer = require('sqs-producer');
AWS.config.loadFromPath('/Users/umihui/practice/ClientServer/server/config.json');

var producer = Producer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/732562083814/client-to-matching.fifo',
});


module.exports = sendBooking = (message, cb) =>{ 
  const trip = JSON.stringify(message);
  const params = {
    id:'test',
    body: trip,
    groupId: 'booking',
    deduplicationId: md5(trip) // typically a hash of the message body
  };
  producer.send(params, function(err, data) {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data);
    }
  })
};










// AWS.config.loadFromPath('/Users/umihui/practice/ClientServer/server/config.json');

// var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// var params = {
//   MessageDeduplicationId: uuid.v4(),
//   MessageGroupId: 'booking',
//   QueueUrl: "https://sqs.us-west-2.amazonaws.com/732562083814/client-to-matching.fifo"
// };

// module.exports = sendBooking = (message, cb) =>{ 
//   params.MessageBody = JSON.stringify(message);
//   sqs.sendMessage(params, function(err, data) {
//     if (err) {
//       cb(err, null);
//     } else {
//       cb(null, data.MessageId);
//     }
//   })
// };

