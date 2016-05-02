'use strict';

const HID = require('node-hid');

const distance = require('./distance.js');
const motor = require('./motor.js');
const tilt = require('./tilt.js');

const VendorId = 0x0694;
const ProductId = 0x0003;

/**
 * Find all available devices
 *
 * @returns {*} devices that match WeDo
 */
const scanForDevices = () => HID.devices().filter(dev => dev.vendorId === VendorId && dev.productId === ProductId);

const filterRawData = (data, filterIds) => {
  for (const id in data) {
    if (data.hasOwnProperty(id) && filterIds.indexOf(Number(id)) >= 0) {
      return data[id];
    }
  }

  return null;
};

const processData = (data, dataProcessor) => {
  if (!data) {
    return null;
  }

  return dataProcessor(data);
};

class WeDo {
  /**
   * If a device is not given, it will attach this instance to the first one found.
   * Otherwise you can pass a specific one from the list returned by scan_for_devices.
   *
   * @param device The device to attach to, or null/undefined
   */
  constructor(device) {
    this.number = 0;
    this.deviceInfo = device;
    if (!this.deviceInfo) {
      const devices = scanForDevices();
      if (!devices || !devices.length) {
        throw new Error('Could not find a connected WeDo device');
      }
      this.deviceInfo = devices[0];
    }

    if (!this.deviceInfo.path) {
      throw new Error(`Device info does not have a path: ${this.deviceInfo}`);
    }

    this.device = new HID.HID(this.deviceInfo.path);

    this.initDevice();
    this.valMotorA = 0;
    this.valMotorB = 0;
    this.initDevice();

    this.rawData = null;

    this.device.on('data', data => {
      this.rawData = data;
    });
  }

  /**
   * (Re)init device associated with the WeDo instance
   */
  initDevice() {
    // nothing to do here
  }

  /**
   * Arguments should be in form of a number between 0 and 100, positive or negative. Magic numbers used for
   * the ctrl transfer derived from sniffing USB coms.
   */
  setMotors() {
    const data = [0x0, 0x40,
      motor.processMotorValue(this.valMotorA) & 0xFF,
      motor.processMotorValue(this.valMotorB) & 0xFF,
      0x00, 0x00, 0x00, 0x00, 0x00];

    this.device.write(data)
  }

  /**
   * Sensor data is contained in the 2nd and 4th byte, with sensor IDs being contained in the 3rd and 5th byte respectively.
   */
  get data() {
    var sensorData = {};
    sensorData[this.rawData[3]] = this.rawData[2];
    sensorData[this.rawData[5]] = this.rawData[4];
    return sensorData;
  }

  /**
   * Returns the raw tilt direction (arbitrary units)
   */
  get rawTilt() {
    return filterRawData(this.data, tilt.TiltSensorIds);
  }

  /**
   * Returns the tilt direction (one of the Tilts constants)
   */
  get tilt() {
    return processData(this.rawTilt, tilt.processTilt);
  }

  /**
   * Return the raw evaluated distance from the distance meter (arbitrary units)
   */
  get rawDistance() {
    return filterRawData(this.data, distance.DistanceSensorIds);
  }

  /**
   * Return the evaluated distance in meters from the distance meter.
   * (Note: this is the ideal distance without any objets on the side, you might have to adapt it depending on your construction)
   */
  get distance() {
    return processData(this.rawDistance, distance.interpolateDistanceData);
  }

  /**
   * Get back the last speed/force set for motor A
   *
   * @returns {number} The motor A value
   */
  get motorA() {
    return this.valMotorA;
  }

  /**
   * Sets the speed/force of the motor A, expects a value between -100 and 100
   *
   * @param {number} value The new motor A value
   */
  set motorA(value) {
    if (value < -100 || value > 100) {
      throw new Error(`A motor can only be between -100 and 100: ${value}`)
    }

    this.valMotorA = value;
    this.setMotors();
  }

  /**
   * Get back the last speed/force set for motor B
   *
   * @returns {number} The motor B value
   */
  get motorB() {
    return this.valMotorB;
  }

  /**
   * Sets the speed/force of the motor B, expects a value between -100 and 100
   *
   * @param {number} value The new motor B value
   */
  set motorB(value) {
    if (value < -100 || value > 100) {
      throw new Error(`A motor can only be between -100 and 100: ${value}`)
    }

    this.valMotorB = value;
    this.setMotors();
  }

  /**
   * Stop motors
   */
  stop() {
    this.valMotorA = 0;
    this.valMotorB = 0;
    this.setMotors();
  }

  /**
   * Close the WeDo device
   */
  close() {
    this.stop();
    this.device.close();
    this.device = null;
  }
}

module.exports = {
  scanForDevices,
  WeDo,
  Tilts: tilt.Tilts
};
