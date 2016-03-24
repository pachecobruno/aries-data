'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Poller2 = require('./Poller');

var _Poller3 = _interopRequireDefault(_Poller2);

var _DecisionTask = require('../tasks/DecisionTask');

var _DecisionTask2 = _interopRequireDefault(_DecisionTask);

var _logger = require('../../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var log = (0, _logger2.default)(__filename);

/**
 * Decision poller
 */

var DecisionPoller = (function (_Poller) {
    _inherits(DecisionPoller, _Poller);

    function DecisionPoller(config, decider) {
        _classCallCheck(this, DecisionPoller);

        // Check for decider.

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DecisionPoller).call(this, config));

        if (!decider) {
            throw new Error('Decision poller requires a decider');
        }

        // Set the decider.
        _this.decider = decider;
        return _this;
    }
    // Method to call when polling for tasks.

    _createClass(DecisionPoller, [{
        key: '_onTask',
        value: (function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(result) {
                var task, decisions;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;

                                // Create a decisionTask
                                task = new _DecisionTask2.default(result);

                                // Call onTask for a list of decisions to send back.

                                _context.next = 4;
                                return this.decider.onTask(task);

                            case 4:
                                decisions = _context.sent;

                                if (decisions) {
                                    _context.next = 7;
                                    break;
                                }

                                return _context.abrupt('return');

                            case 7:

                                // Respond with decisions.
                                log.info('Submitting ' + decisions.length + ' decisions.');
                                _context.next = 10;
                                return this.client.respondDecisionTaskCompleted({
                                    taskToken: result.taskToken,
                                    decisions: decisions
                                });

                            case 10:
                                _context.next = 17;
                                break;

                            case 12:
                                _context.prev = 12;
                                _context.t0 = _context['catch'](0);

                                log.error('Decision failed. Failing workflow', _context.t0);
                                _context.next = 17;
                                return this.client.respondDecisionTaskCompleted({
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
                }, _callee, this, [[0, 12]]);
            }));

            function _onTask(_x) {
                return ref.apply(this, arguments);
            }

            return _onTask;
        })()
    }]);

    return DecisionPoller;
})(_Poller3.default);

DecisionPoller.pollMethod = 'pollForDecisionTask';
exports.default = DecisionPoller;
;