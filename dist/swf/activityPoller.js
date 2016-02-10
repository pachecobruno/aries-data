'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stampit = require('stampit');

var _stampit2 = _interopRequireDefault(_stampit);

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _poller = require('./poller');

var _poller2 = _interopRequireDefault(_poller);

var _activityTask = require('./activityTask');

var _activityTask2 = _interopRequireDefault(_activityTask);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var log = (0, _logger2.default)(__filename);

/**
 * Activity poller
 */
exports.default = _stampit2.default.compose(_poller2.default, _stampit2.default.props({
    pollMethod: 'pollForActivityTask'
}).init(function () {
    // Check for activities
    if (!this.activities instanceof Array) {
        throw new Error('Activities poller requires an array of activities');
    }
}).methods({
    _onTask: function _onTask(result) {
        var _this = this;

        return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var activityType, module, task, config, output;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            activityType = result.activityType;

                            // Get the module for this activityType.

                            module = _this.findModuleForActivity(result.activityType);

                            if (module) {
                                _context.next = 5;
                                break;
                            }

                            throw new Error(activityType.name + '/' + activityType.version + ' not loaded');

                        case 5:

                            // Create an activityTask.
                            task = (0, _activityTask2.default)(result);

                            // If this module has a configProvider, get it.  Always produce an object.

                            _context.t0 = Object;
                            _context.t1 = {};

                            if (!module.getConfig) {
                                _context.next = 14;
                                break;
                            }

                            _context.next = 11;
                            return module.getConfig(task);

                        case 11:
                            _context.t2 = _context.sent;
                            _context.next = 15;
                            break;

                        case 14:
                            _context.t2 = {};

                        case 15:
                            _context.t3 = _context.t2;
                            config = _context.t0.assign.call(_context.t0, _context.t1, _context.t3);
                            _context.next = 19;
                            return module.onTask(task, config);

                        case 19:
                            output = _context.sent;

                            if (!(output && !(0, _lodash2.default)(output))) {
                                _context.next = 22;
                                break;
                            }

                            throw new Error('Return value of activities must be a string');

                        case 22:
                            if (!module.afterTask) {
                                _context.next = 25;
                                break;
                            }

                            _context.next = 25;
                            return module.afterTask(task, config);

                        case 25:
                            _context.next = 27;
                            return _this.client.respondActivityTaskCompleted({
                                taskToken: result.taskToken,
                                result: output
                            });

                        case 27:
                            _context.next = 34;
                            break;

                        case 29:
                            _context.prev = 29;
                            _context.t4 = _context['catch'](0);

                            log(_context.t4);
                            // Respond failure.
                            _context.next = 34;
                            return _this.client.respondActivityTaskFailed({
                                taskToken: result.taskToken,
                                details: '',
                                reason: ''
                            });

                        case 34:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 29]]);
        }))();
    },
    findModuleForActivity: function findModuleForActivity(activityType) {
        return this.activities.find(function (a) {
            return a.config.name === activityType.name && a.config.version === activityType.version;
        });
    }
}));