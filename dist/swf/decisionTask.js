'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stampit = require('stampit');

var _stampit2 = _interopRequireDefault(_stampit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Decision Task
 * Simple wrapper around a decision task poll response.
 */
exports.default = _stampit2.default.refs({
    // Empty events array.  Will be overridden by decision poll response.
    events: []
}).methods({
    getHistory: function getHistory() {
        return this.events;
    },
    newEvents: function newEvents() {
        var _this = this;

        return this.events.filter(function (e) {
            return e.eventId > _this.previousStartedEventId;
        });
    }
});