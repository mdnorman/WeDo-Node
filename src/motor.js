'use strict';

const MotorIds = [0x00, 0x01, 0x02, 0x03, 0xEE, 0xEF];

/**
 * Check to make sure motor values are sane.
 *
 * @param value The motor value
 */
const processMotorValue = (value) => {
  if (0 < value && value <= 100) {
    return value + 27;
  }

  if (-100 <= value && value < 0) {
    return value - 27;
  }
  
  return 0;
};

module.exports = {
  processMotorValue,
  MotorIds
};
