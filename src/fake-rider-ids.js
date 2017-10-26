var uuid = require('uuid');
var fs = require('fs');
var db = require('./db');


for(var i = 0; i < 100000; i++) {
  var id = {'rider_id': uuid.v4()};
  db('riders').insert(id).then((result) => true)
}
  // console.log(id);
  // insertId(id);


console.log('done');
