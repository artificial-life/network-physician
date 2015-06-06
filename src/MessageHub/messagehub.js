'use strict'

var Abstract = require('../Abstract/abstract.js');
var http = require('http');
var socketio = require('socket.io');
var events_router = require('socket.io-events');

const DEFAULT_PORT = 80;

class MessageHub extends Abstract {
    constructor() {
        super({});
        this.queues_required = {
            "event-queue": true,
            "task-queue": true
        };
    }
    init(options) {
        super.init(options);
        var port = options.port || DEFAULT_PORT;
        this.io = socketio(port);

        var io = this.io;

        /*   var router = events_router();
        io.use(router);

        router.on('*', function (socket, args, next) {
            console.log('router:', args);
        });
*/
        io.on('connection', (socket) => {


            socket.on('init.client', (msg, fn) => {
                console.log('Client id:', msg.my_id);
                fn({
                    status: 'ok'
                });
            });

            socket.on('broker.list.resources', (msg, fn) => {
                this.emitter.addTask('broker.list.resources', msg).then(function (data) {
                    fn(data);
                });
            });

            socket.on('disconnect', (reason) => {
                console.log('user left:', reason);
            });
        });
    }
    start() {
        super.start();
    }
    pause() {
        super.pause();
    }
}







module.exports = MessageHub;