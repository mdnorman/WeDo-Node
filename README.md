Node WeDo Library
=================

This library creates support for the Lego WeDo system for Node.

### Usage
    
    const WeDo = require('wedo-support');
    const wd = new WeDo.WeDo();
    
    // Activating the first motor full forward:
    wd.motorA = 100;
    
    // Activating the second motor half speed/force backward:
    wd.motorB = -50;
    
    // Current value of the tilt sensor:
    const theTilt = wd.tilt;
    
    // Current distance value in meters of the distance sensor:
    const theDistance = wd.distance;
