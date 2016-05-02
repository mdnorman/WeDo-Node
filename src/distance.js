'use strict';

const bisect = require('./bisect.js');

const DistanceSensorIds = [0xB0, 0xB1, 0xB2, 0xB3];

// data from distance sensor -> real measure in cms under ideal conditions (no side object, perpendicular wall)
const RawMeasures = {
  210: 46,
  208: 39,
  207: 34,
  206: 32,
  205: 30.5,
  204: 29,
  203: 27,
  202: 26,
  201: 25,
  200: 24.5,
  199: 23.5,
  198: 22.5,
  197: 22,
  196: 21.5,
  195: 20,
  194: 19.5,
  193: 18,
  192: 17.5,
  191: 17,
  180: 15,
  170: 13,
  160: 12.5,
  150: 11,
  140: 10.5,
  130: 10,
  120: 9.5,
  100: 7.5,
  71: 6.5,
  70: 6,
  69: 5.3,
  68: 0
};

const RawMeasuresKeys = Object.keys(RawMeasures).map(key => Number(key)).sort((a, b) => Number(a) - Number(b));

const interpolateDistanceData = (rawDist) => {
  var leftIndex = bisect.bisectLeft(RawMeasuresKeys, rawDist) - 1;
  if (leftIndex < 0) {
    leftIndex = 0;
  }

  const rightIndex = leftIndex == RawMeasuresKeys.length - 1 ? leftIndex : leftIndex + 1;

  const left = RawMeasuresKeys[leftIndex];
  if (left > rawDist) {
    return RawMeasures[RawMeasuresKeys[leftIndex]];
  }

  const right = RawMeasuresKeys[rightIndex];
  const mright = RawMeasures[right];
  const mleft = RawMeasures[left];
  const addup = mright != mleft ? ((rawDist - left) / (right - left)) * (mright - mleft) : 0;
  return mleft + addup;
};

module.exports = {
  interpolateDistanceData,
  DistanceSensorIds
};
