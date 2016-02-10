'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stampit = require('stampit');

var _stampit2 = _interopRequireDefault(_stampit);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/**
 * Base Activity
 */
exports.default = _stampit2.default.props({
    config: {
        defaultTaskHeartbeatTimeout: '900',
        defaultTaskScheduleToStartTimeout: '120',
        defaultTaskScheduleToCloseTimeout: '3800',
        defaultTaskStartToCloseTimeout: '3600'
    }
}).init(function () {
    if (!(this.config.name && this.config.version)) {
        throw new Error('Activities require a name and version');
    }

    // Provider a logger to deciders.
    this.log = (0, _logger2.default)('activity:' + this.config.name);
}).methods({
    onTask: function onTask(activityTask) {
        var _this = this;

        return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            return _context.abrupt('return');

                        case 1:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }))();
    }
});