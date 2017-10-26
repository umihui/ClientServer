let list = [];

const getFakeTrip = () => {

}

const getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min);

const generateCoordinates = (minX, maxX, minY, maxY) => {
  let x = getRandom(minX, maxX);
  let y = getRandom(minY, maxY);
  return {x, y};
};

const generateCoordinatesWithPeakZone = () => {
  let a = Math.random();
  if (a <= 0.7) {
    return generateCoordinates(4001, 10000, 4001,10000);
  } else if (a > 0.8) {
    return generateCoordinates(0, 10000, 0, 4000)
  } else {
    return generateCoordinates(0, 4000, 4001, 10000);
  }
}

const validateTrip = (start, end) => {
  let a = start.x - end.x;
  let b = start.y - end.y;
  let distance = Math.floor(Math.sqrt(a*a + b*b)) * 1.4;
  if (distance < 1600) {
    return false;
  } else {
    return {distance};
  }
}
