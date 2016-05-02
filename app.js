'use strict';

const WeDo = require('./src/wedo.js');

const wd = new WeDo.WeDo();

// console.log('Devices:', wedo.scanForDevices());

wd.motorA = 0;

var done = false;
const showSensors = () => {
  setTimeout(() => {
    // console.log('Raw Data:', wd.rawData);
    console.log(`Tilt: ${wd.tilt} (${wd.rawTilt})`);
    console.log(`Distance: ${wd.distance} (${wd.rawDistance})`);

    if (!done) {
      showSensors();
    }
  }, 100);
};

showSensors();

setTimeout(() => {
  wd.close();
  done = true;
  console.log('done');
}, 5000);
