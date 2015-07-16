'use strict'

/* test */

var iconfig = require('../inspectors-config.json');
var Promise = require('bluebird');

/* services */

var Doctor = require('./Physician/physician.js');
var Auth = require('./Auth/auth.js');
var MessageHub = require('./MessageHub/messagehub.js');
var Sample = require('./SampleService/sampleservice.js');
var Broker = require('./Broker-sample/broker.js');

var Queue = require('custom-queue');

var doctor = new Doctor();
var auth = new Auth();
var sample = new Sample();
var broker = new Broker();
var hub = new MessageHub();
//var ee = new EventEmitter2({
//    wildcard: false,
//    newListener: false,
//    maxListeners: 10
//});

var ee = new Queue();

doctor.setChannels({
    "event-queue": ee
});

auth.setChannels({
    "queue": ee
});

broker.setChannels({
    "queue": ee
});

hub.setChannels({
    "queue": ee
});

sample.setChannels({
    "queue": ee
});

Promise.props({
    auth: auth.init(),
    doctor: doctor.init(iconfig),
    sample: sample.init(),
    hub: hub.init({
        port: 9999
    }),
    broker: broker.init()
}).then(function () {
    auth.launch();
    doctor.launch();
    sample.launch();
    hub.launch();
    broker.launch();
});