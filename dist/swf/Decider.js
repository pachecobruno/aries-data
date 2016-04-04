'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _lodash = require('lodash.flatten');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isfunction');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.camelcase');

var _lodash6 = _interopRequireDefault(_lodash5);

var _logger = require('../decorators/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base Decider
 * Provides some helper methods to help dealing with decisions.
 */
var Decider = (_dec = (0, _logger2.default)(), _dec(_class = function () {
    function Decider(config) {
        _classCallCheck(this, Decider);

        Object.assign(this, config);
    }

    // Base implementation of onTask.  Return no decisions.


    _createClass(Decider, [{
        key: 'onTask',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(decisionTask) {
                var newEvents, decisions, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, e, methodName, attrsKey, decision;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                // Grab only fresh events.
                                newEvents = decisionTask.newEvents();

                                // Create array to hold all the decisions produced.

                                decisions = [];

                                // Loop through events IN ORDER FROM TIMESTAMP, SEQUENTIALLY, producing decisions.

                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 5;
                                _iterator = newEvents[Symbol.iterator]();

                            case 7:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context.next = 20;
                                    break;
                                }

                                e = _step.value;

                                // Get method name for this event handler. ex - onWorkflowExecutionStarted.
                                methodName = 'on' + e.eventType;

                                // Bail early if this method name is not implemented.

                                if ((0, _lodash4.default)(this[methodName])) {
                                    _context.next = 12;
                                    break;
                                }

                                return _context.abrupt('continue', 17);

                            case 12:

                                // Get name of attributes on event for this eventType. ex - workflowExecutionStartedAttributes.
                                attrsKey = (0, _lodash6.default)(e.eventType) + 'EventAttributes';

                                // Call implementation, passing decisisionTask and this events attrs.

                                _context.next = 15;
                                return this[methodName].call(this, decisionTask, e[attrsKey]);

                            case 15:
                                decision = _context.sent;


                                // Push decisions onto list.
                                decisions.push(decision);

                            case 17:
                                _iteratorNormalCompletion = true;
                                _context.next = 7;
                                break;

                            case 20:
                                _context.next = 26;
                                break;

                            case 22:
                                _context.prev = 22;
                                _context.t0 = _context['catch'](5);
                                _didIteratorError = true;
                                _iteratorError = _context.t0;

                            case 26:
                                _context.prev = 26;
                                _context.prev = 27;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 29:
                                _context.prev = 29;

                                if (!_didIteratorError) {
                                    _context.next = 32;
                                    break;
                                }

                                throw _iteratorError;

                            case 32:
                                return _context.finish(29);

                            case 33:
                                return _context.finish(26);

                            case 34:
                                return _context.abrupt('return', (0, _lodash2.default)(decisions).filter(Boolean));

                            case 35:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[5, 22, 26, 34], [27,, 29, 33]]);
            }));

            function onTask(_x) {
                return ref.apply(this, arguments);
            }

            return onTask;
        }()

        // Helper method to produce a 'ScheduleActivityTask' decision.

    }, {
        key: 'scheduleActivity',
        value: function scheduleActivity(attrs) {
            return {
                decisionType: 'ScheduleActivityTask',
                scheduleActivityTaskDecisionAttributes: Object.assign({
                    taskList: { name: this.taskList + '-activities' }
                }, attrs)
            };
        }

        // Helper method to produce a 'StartTimer' decision.

    }, {
        key: 'startTimer',
        value: function startTimer(attrs) {
            return {
                decisionType: 'StartTimer',
                startTimerDecisionAttributes: attrs
            };
        }

        // Helper method to produce a 'ContinueAsNewWorkflowExecution' decision.

    }, {
        key: 'continueAsNewWorkflowExecution',
        value: function continueAsNewWorkflowExecution(attrs) {
            return {
                decisionType: 'ContinueAsNewWorkflowExecution',
                continueAsNewWorkflowExecutionDecisionAttributes: Object.assign({
                    taskList: { name: this.taskList }
                }, attrs)
            };
        }

        // Helper method to produce a 'CompleteWorkflowExecution' decision.

    }, {
        key: 'completeWorkflow',
        value: function completeWorkflow(attrs) {
            return {
                decisionType: 'CompleteWorkflowExecution',
                completeWorkflowExecutionDecisionAttributes: attrs
            };
        }

        // Helper method to produce a 'FailWorkflowExecution' decision.

    }, {
        key: 'failWorkflow',
        value: function failWorkflow(attrs) {
            return {
                decisionType: 'FailWorkflowExecution',
                failWorkflowExecutionDecisionAttributes: attrs
            };
        }
    }]);

    return Decider;
}()) || _class);
exports.default = Decider;
;