'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stampit = require('stampit');

var _stampit2 = _interopRequireDefault(_stampit);

var _poller = require('./poller');

var _poller2 = _interopRequireDefault(_poller);

var _decisionTask = require('./decisionTask');

var _decisionTask2 = _interopRequireDefault(_decisionTask);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var log = (0, _logger2.default)(__filename);

/**
 * Decision poller
 */
exports.default = _stampit2.default.compose(_poller2.default, _stampit2.default.props({
    pollMethod: 'pollForDecisionTask'
}).init(function () {
    // Check for decider.
    if (!this.decider) {
        throw new Error('Decision poller requires a decider');
    }
}).methods({
    _onTask: function _onTask(result) {
        var _this = this;

        return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var task, decisions;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            // Create a decisionTask
                            task = (0, _decisionTask2.default)(result);

                            // Call onTask for a list of decisions to send back.

                            _context.next = 4;
                            return _this.decider.onTask(task);

                        case 4:
                            decisions = _context.sent;

                            if (decisions) {
                                _context.next = 7;
                                break;
                            }

                            return _context.abrupt('return');

                        case 7:

                            // Respond with decisions.
                            log('Submitting ' + decisions.length + ' decisions.');
                            _context.next = 10;
                            return _this.client.respondDecisionTaskCompleted({
                                taskToken: result.taskToken,
                                decisions: decisions
                            });

                        case 10:
                            _context.next = 17;
                            break;

                        case 12:
                            _context.prev = 12;
                            _context.t0 = _context['catch'](0);

                            log('Decision failed. Failing workflow', _context.t0);
                            _context.next = 17;
                            return _this.client.respondDecisionTaskCompleted({
                                taskToken: result.taskToken,
                                decisions: [{
                                    decisionType: 'FailWorkflowExecution',
                                    failWorkflowExecutionDecisionAttributes: {
                                        details: '',
                                        reason: ''
                                    }
                                }]
                            });

                        case 17:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 12]]);
        }))();
    }
}));