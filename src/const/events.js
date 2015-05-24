'use strict'

var events = {
    doctor: {
        healthy: 'now.healthy',
        unhealthy: 'now.unhealthy',
        register: 'inspector.register'
    },
    permission: {
        dropped: function (name, key) {
            return 'permission.dropped.' + name + '.' + key;
        },
        restored: function (name, key) {
            return 'permission.restored.' + name + '.' + key;
        },
        request: 'permission.request'
    }
};

function getEvent(service, name) {
    if (!name) {
        return events[service];
    }
    return events[service][name];
};

module.exports = getEvent;