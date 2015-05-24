'use strict'

var getEvents = require('../const/events.js');
var Promise = require('bluebird');
var _ = require('lodash');

/*utility function*/

var modules = [];
var getPermissionModel = function (module_name) {
    //coz cashing is slightly faster
    if (modules.hasOwnProperty(module_name)) {
        return modules[module_name];
    }

    modules[module_name] = require('../Model/Permission/' + module_name + '.js');

    return modules[module_name];
}

/**
 * Abstract service
 */
class Abstrasct_Service {
    constructor({
        event_group = ''
    }) {
        //rework this two as state
        this.paused = true;
        this.is_waiting = false;

        this.event_names = event_group ? this.getEvents(event_group) : {};
        this.queues_required = {
            "event-queue": true,
            "task-queue": false
        };

        //@TODO: move to permission logic
        this.required_permissions = [];
    }
    getEvents(event_group) {
        return getEvents(event_group);
    }
    addPermission(name, params) {
        var model = getPermissionModel(name);
        var permission = new model(params);
        this.required_permissions.push(permission);

        return this;
    }
    requestPermission() {
        if (!this.required_permissions.length) return Promise.resolve(true);

        var messages = [];

        _(this.required_permissions).forEach(permission => {
            var request_message = permission.requestMessage();
            messages.push(request_message);
        }).value();

        var request_permission_task = getEvents('permission').request;
        var p = this.emitter.addTask(request_permission_task, messages);

        return p;
    }
    tryToStart() {
        var request = this.requestPermission();
        //@TODO: add timeout()
        //move this to permission logic
        request.then((result) => {
                if (result === true || result.valid === true) {
                    if (this.is_waiting || this.paused) this.start();
                } else {
                    this.is_waiting = true;

                    var details = result.details;
                    for (var i = 0; i < details.length; i += 1) {
                        if (!details[i].valid) {
                            this.required_permissions[i].drop();
                        }
                    }
                }
            })
            .catch(() => {
                throw new Error('Auth error');
            });
    }
    setChannels(options) {
        if (!options.hasOwnProperty('queue')) {

            if (this.queues_required['event-queue'] && this.queues_required['task-queue']) {
                throw new Error('Complex queue required');
            }

            if (this.queues_required['event-queue'] && !options.hasOwnProperty('event-queue')) {
                throw new Error('Event queue or complex queue required');
            }

            if (this.queues_required['task-queue'] && !options.hasOwnProperty('task-queue')) {
                throw new Error('Task queue or complex queue required');
            }

        }

        //@TODO: this should be much better. If EQ and TQ specified they should be combined in complex emitter

        this.emitter = options.queue || options['event-queue'] || options['task-queue'];

    }

    init(config) {
        this.config = config || {};

        if (!this.emitter && (this.queues_required['event-queue'] || this.queues_required['task-queue'])) {
            return Promise.reject('U should set channels before');
        }
        //@TODO:detach it to permission logic
        var permission_events = getEvents('permission');

        _(this.required_permissions).forEach(permission => {
            var event_name = permission_events.restored(permission.getName(), permission.keyToString());
            this.emitter.on(event_name, (d) => {
                console.log('Yeah', d);
                if (this.is_waiting) this.tryToStart();
            });
        }).value();


        return Promise.resolve(true);
    }

    start() {
        //@TODO: What should it do in current context?
        //@TODO: requesPermissions() here
        this.is_waiting = false;
        this.paused = false;

        return this;
    }

    pause() {
        //@TODO: What should it do in current context?
        this.paused = true;

        return this;
    }

    resume() {
        //@TODO: What should it do in current context?
        this.paused = false;

        return this;
    }
}

module.exports = Abstrasct_Service;