

const zones = [
  [91,92,93,94,95,96,97,98,99,100],
  [81,82,83,84,85,86,87,88,89,90],
  [71,72,73,74,75,76,77,78,79,80],
  [61,62,63,64,65,66,67,68,69,70],
  [51,52,53,54,55,56,57,58,59,60],
  [41,42,43,44,45,46,47,48,49,50],
  [31,32,33,34,35,36,37,38,39,40],
  [21,22,23,24,25,26,27,28,29,30],
  [11,12,13,14,15,16,17,18,19,20],
  [1,2,3,4,5,6,7,8,9,10]
]

//peakzone 45-50,55-60,65-70,75-80,85-90,95-100
//(4001,10000),(10000,10000)
//(4001,4001),(10000,4001)
//70% start and end in peakzone




//live data stream
const perMin = 0.2;
const perKm = 1.2;
const timeRatio = 1;
const minimum = 6;
//inputs : distance from db, surgeRatio, RushHour
const convertPrice = (distance) => {
  let time = (distance / 200) * timeRatio;
  let finalPrice = (distance / 1000 * perKm + time * perMin).toFixed(2);
  return finalPrice > minimum ? finalPrice : minimum ;
}

const findZone = (start) => {
  let i,j;
  if (start.x === 10000) {
    i = 9;
  } else {
    i = Math.floor(start.x/1000);
  }
  if (start.y === 10000) {
    j = 0;
  } else {
    j = 9 - Math.floor(start.y/1000);
  }
  return zones[j][i];
}

//input is like 0.9,0.8
const conversion = (rate) => {
  let a = Math.random();
  if (a < rate) {
    return true;
  } else {
    return false;
  }
}

//console.log(generateCoordinates(4001,10000,4001,10000));
//6159, 7496,5188, 4074
//console.log(convertPrice(6159, 7496,5188, 4074));
//console.log(generateCoordinatesWithPeakZone());
console.log(convertPrice(5700));
var a = generateCoordinatesWithPeakZone();
console.log(a);
console.log(findZone(a));
