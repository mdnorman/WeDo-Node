'use strict';

const Tilts = {
  Flat: 'flat',
  Forward: 'forward',
  Left: 'left',
  Right: 'right',
  Back: 'back'
};

const TiltSensorIds = [0x26, 0x27];

/**
 * Use a series of elif/value-checks to process the tilt sensor data.
 *
 * @param rawTilt the raw tilt value
 *
 * @returns One of Tilts
 */
const processTilt = (rawTilt) => {
  if (10 <= rawTilt && rawTilt <= 40) {
    return Tilts.Back
  }

  if (60 <= rawTilt && rawTilt <= 90) {
    return Tilts.Right;
  }

  if (170 <= rawTilt && rawTilt <= 190) {
    return Tilts.Forward;
  }
  
  if (220 <= rawTilt && rawTilt <= 240) {
    return Tilts.Left;
  }
  
  return Tilts.Flat;
};

module.exports = {
  processTilt,
  Tilts,
  TiltSensorIds
};
