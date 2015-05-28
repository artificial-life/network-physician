'use strict'

var Abstract = require('../Abstract/abstract.js');

class SampleService extends Abstract {
    constructor() {
        super({});
        this.addPermission('ip', 'ya.ru');

    }
    start() {
        super.start();
        console.log('SampleService: Started!');
    }
}

module.exports = SampleService;