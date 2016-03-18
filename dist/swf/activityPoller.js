'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stampit = require('stampit');

var _stampit2 = _interopRequireDefault(_stampit);

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.flatten');

var _lodash4 = _interopRequireDefault(_lodash3);

var _poller = require('./poller');

var _poller2 = _interopRequireDefault(_poller);

var _activityTask = require('./activityTask');

var _activityTask2 = _interopRequireDefault(_activityTask);

var _createLogger = require('../util/createLogger');

var _createLogger2 = _interopRequireDefault(_createLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var log = (0, _createLogger2.default)(__filename);

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
            var activityType, Activity, task, config, args, activity, output;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            activityType = result.activityType;

                            // Get the module for this activityType.

                            Activity = _this.findModuleForActivity(result.activityType);

                            if (Activity) {
                                _context.next = 5;
                                break;
                            }

                            throw new Error(activityType.name + '/' + activityType.version + ' not loaded');

                        case 5:

                            // Create an activityTask.
                            task = (0, _activityTask2.default)(result);

                            // If this module has a configProvider, run it.
                            // This allows configProviders to return a single object, or array.
                            // This array will then be applied to the onTask function,
                            // resulting in ability to pass multiple params to onTask.
                            // By convention, the first parameter passed in will always be the activityTask
                            // and the second should always be the task configuration.
                            // This just allows more flexibility for config providers to provide
                            // additional contextual information.

                            if (!Activity.getConfig) {
                                _context.next = 13;
                                break;
                            }

                            _context.next = 9;
                            return Activity.getConfig(task);

                        case 9:
                            _context.t1 = _context.sent;
                            _context.t0 = [_context.t1];
                            _context.next = 14;
                            break;

                        case 13:
                            _context.t0 = [{}];

                        case 14:
                            config = _context.t0;

                            // Ensure a single dimension array.
                            args = (0, _lodash4.default)(config);

                            // Add task as first arg.

                            args.unshift(task);

                            // Create new instance of the activity.
                            activity = new Activity(config);

                            // Run the onTask function.

                            _context.next = 20;
                            return activity.onTask.apply(activity, args);

                        case 20:
                            output = _context.sent;

                            if (!(output && !(0, _lodash2.default)(output))) {
                                _context.next = 23;
                                break;
                            }

                            throw new Error('Return value of activities must be a string');

                        case 23:
                            _context.next = 25;
                            return _this.client.respondActivityTaskCompleted({
                                taskToken: result.taskToken,
                                result: output
                            });

                        case 25:
                            _context.next = 32;
                            break;

                        case 27:
                            _context.prev = 27;
                            _context.t2 = _context['catch'](0);

                            log.error(_context.t2);
                            // Respond failure.
                            _context.next = 32;
                            return _this.client.respondActivityTaskFailed({
                                taskToken: result.taskToken,
                                details: '',
                                reason: ''
                            });

                        case 32:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 27]]);
        }))();
    },
    findModuleForActivity: function findModuleForActivity(activityType) {
        return this.activities.find(function (a) {
            return a.props.name === activityType.name && a.props.version === activityType.version;
        });
    }
}));