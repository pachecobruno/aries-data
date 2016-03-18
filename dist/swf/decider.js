'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stampit = require('stampit');

var _stampit2 = _interopRequireDefault(_stampit);

var _createLogger = require('../util/createLogger');

var _createLogger2 = _interopRequireDefault(_createLogger);

var _lodash = require('lodash.flatten');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isfunction');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.camelcase');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/**
 * Base Decider
 * Provides some helper methods to help dealing with decisions.
 */
exports.default = _stampit2.default.init(function () {
    // Provider a logger to deciders.
    this.log = (0, _createLogger2.default)('decider');
}).methods({
    // Base implementation of onTask.  Return no decisions.

    onTask: function onTask(decisionTask) {
        var _this = this;

        return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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

                            if ((0, _lodash4.default)(_this[methodName])) {
                                _context.next = 12;
                                break;
                            }

                            return _context.abrupt('continue', 17);

                        case 12:

                            // Get name of attributes on event for this eventType. ex - workflowExecutionStartedAttributes.
                            attrsKey = (0, _lodash6.default)(e.eventType) + 'EventAttributes';

                            // Call implementation, passing decisisionTask and this events attrs.

                            _context.next = 15;
                            return _this[methodName].call(_this, decisionTask, e[attrsKey]);

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
            }, _callee, _this, [[5, 22, 26, 34], [27,, 29, 33]]);
        }))();
    },

    // Helper method to produce a 'ScheduleActivityTask' decision.
    scheduleActivity: function scheduleActivity(attrs) {
        return {
            decisionType: 'ScheduleActivityTask',
            scheduleActivityTaskDecisionAttributes: Object.assign({
                taskList: { name: this.taskList + '-activities' }
            }, attrs)
        };
    },

    // Helper method to produce a 'StartTimer' decision.
    startTimer: function startTimer(attrs) {
        return {
            decisionType: 'StartTimer',
            startTimerDecisionAttributes: attrs
        };
    },

    // Helper method to produce a 'ContinueAsNewWorkflowExecution' decision.
    continueAsNewWorkflowExecution: function continueAsNewWorkflowExecution(attrs) {
        return {
            decisionType: 'ContinueAsNewWorkflowExecution',
            continueAsNewWorkflowExecutionDecisionAttributes: Object.assign({
                taskList: { name: this.taskList }
            }, attrs)
        };
    },

    // Helper method to produce a 'CompleteWorkflowExecution' decision.
    completeWorkflow: function completeWorkflow(attrs) {
        return {
            decisionType: 'CompleteWorkflowExecution',
            completeWorkflowExecutionDecisionAttributes: attrs
        };
    },

    // Helper method to produce a 'FailWorkflowExecution' decision.
    failWorkflow: function failWorkflow(attrs) {
        return {
            decisionType: 'FailWorkflowExecution',
            failWorkflowExecutionDecisionAttributes: attrs
        };
    }
});