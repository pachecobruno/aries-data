'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.flatten');

var _lodash4 = _interopRequireDefault(_lodash3);

var _Poller2 = require('./Poller');

var _Poller3 = _interopRequireDefault(_Poller2);

var _ActivityTask = require('./tasks/ActivityTask');

var _ActivityTask2 = _interopRequireDefault(_ActivityTask);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var log = (0, _logger2.default)(__filename);

/**
 * Activity poller
 */

var ActivityPoller = (function (_Poller) {
    _inherits(ActivityPoller, _Poller);

    function ActivityPoller(config, activities) {
        _classCallCheck(this, ActivityPoller);

        // Check for activities

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ActivityPoller).call(this, config));

        if (!activities instanceof Array) {
            throw new Error('Activities poller requires an array of activities');
        }

        // Keep a list of activities
        _this.activities = activities;
        return _this;
    }

    // Method to call when polling for tasks.

    _createClass(ActivityPoller, [{
        key: '_onTask',
        value: (function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(result) {
                var activityType, Activity, task, config, args, activity, output;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                activityType = result.activityType;

                                // Get the module for this activityType.

                                Activity = this.findModuleForActivity(result.activityType);

                                if (Activity) {
                                    _context.next = 5;
                                    break;
                                }

                                throw new Error(activityType.name + '/' + activityType.version + ' not loaded');

                            case 5:

                                // Create an activityTask.
                                task = new _ActivityTask2.default(result);

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
                                return this.client.respondActivityTaskCompleted({
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
                                return this.client.respondActivityTaskFailed({
                                    taskToken: result.taskToken,
                                    details: '',
                                    reason: ''
                                });

                            case 32:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 27]]);
            }));

            function _onTask(_x) {
                return ref.apply(this, arguments);
            }

            return _onTask;
        })()
    }, {
        key: 'findModuleForActivity',
        value: function findModuleForActivity(activityType) {
            return this.activities.find(function (a) {
                return a.props.name === activityType.name && a.props.version === activityType.version;
            });
        }
    }]);

    return ActivityPoller;
})(_Poller3.default);

ActivityPoller.pollMethod = 'pollForActivityTask';
exports.default = ActivityPoller;
;