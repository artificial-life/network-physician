'use strict'

var Abstract = require('./abstract.js');

class BadBoy extends Abstract {
    constructor(params, emitters) {
        super(params, emitters);
        console.log("i'm a bad boy");
        console.log("i'm dropping things");
        console.log("everybody hates me");

        this.init({
            permission_watched: params.permission_to_slay,
            inspector_name: 'everything/bad',
            key_data: params.key_data
        });

        this.execution_time = params.execution_time;
    }
    start() {
        this.stop = false;
        setTimeout(() => {
            console.log('Badboy: Executed!');
            if (!this.stop) this.send('drop', "i'm freaking bad, u know");
        }, this.execution_time);
    }
    stop() {
        this.stop = true;
    }
}

module.exports = BadBoy;