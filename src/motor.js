'use strict';

const MotorIds = [0x00, 0x01, 0x02, 0x03, 0xEE, 0xEF];

const MaxValue = 100;
const MinValue = -MaxValue;

const MaxRawValue = 127;

/**
 * Check to make sure teh motor value is sane.
 * 
 * @param value The given motor value
 */
const sanitizeMotorValue = (value) => {
  if (value < MinValue) {
    return MinValue;
  }
  
  if (value > MaxValue) {
    return MaxValue;
  }
  
  return value;
};

/**
 * Expand the motor value to fill the total space.
 *
 * @param value The given motor value
 */
const processMotorValue = (value) => {
  if (0 < value && value <= MaxValue) {
    return Math.floor(value * MaxRawValue / MaxValue);
  }

  if (MinValue <= value && value < 0) {
    return Math.ceil(value * MaxRawValue / MaxValue);
  }
  
  return 0;
};

module.exports = {
  sanitizeMotorValue,
  processMotorValue,
  MotorIds
};
