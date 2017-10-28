const getRandom = (min, max) => Math.floor((Math.random() * (max - min)) + min);

const generateCoordinates = (minX, maxX, minY, maxY) => {
  const x = getRandom(minX, maxX);
  const y = getRandom(minY, maxY);
  return { x, y };
};

const generateCoordinatesWithPeakZone = () => {
  const a = Math.random();
  if (a <= 0.7) {
    return generateCoordinates(4001, 10000, 4001, 10000);
  } else if (a > 0.8) {
    return generateCoordinates(0, 10000, 0, 4000);
  }
  return generateCoordinates(0, 4000, 4001, 10000);
};

const validateTrip = (start, end) => {
  const a = start.x - end.x;
  const b = start.y - end.y;
  const distance = Math.floor(Math.sqrt((a * a) + (b * b))) * 1.4;
  if (distance < 1600) {
    return false;
  }
  return Math.round(distance);
};

module.exports = class FakeTrip {
  constructor() {
    const pickup = generateCoordinatesWithPeakZone();
    const dropoff = generateCoordinatesWithPeakZone();
    if (validateTrip(pickup, dropoff)) {
      this['pickup-x'] = pickup.x;
      this['pickup-y'] = pickup.y;
      this['dropoff-x'] = dropoff.x;
      this['dropoff-y'] = dropoff.y;
      this.distance = validateTrip(pickup, dropoff);
    }
  }
};
