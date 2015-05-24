'use strict'

var Abstract = require('../Abstract/abstract.js');

class SampleService extends Abstract {
    constructor() {
        super({});
        this.addPermission('ip', 'ya.ru');

    }
}

module.exports = SampleService;