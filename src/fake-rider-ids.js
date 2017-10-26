var uuid = require('uuid');
var fs = require('fs');
var db = require('./db');

// var insertId = (id) => {
//   return
// }


  var id = {'rider_id': uuid.v4()};
  db('riders').insert({'riderid':'umi'})
  // console.log(id);
  // insertId(id);


console.log('done');
