var uuid = require('uuid');
var fs = require('fs');

var list = [];
for (var i = 0; i < 400000; i++) {
  list.push(uuid.v4());
}
fs.writeFileSync('utility/fake-rider-ids.json', JSON.stringify(list))

console.log(list.length);
