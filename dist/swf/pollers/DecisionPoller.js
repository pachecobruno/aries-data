'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _Poller2 = require('./Poller');

var _Poller3 = _interopRequireDefault(_Poller2);

var _DecisionTask = require('../tasks/DecisionTask');

var _DecisionTask2 = _interopRequireDefault(_DecisionTask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Decision poller
 */
var DecisionPoller = (_temp = _class = function (_Poller) {
    _inherits(DecisionPoller, _Poller);

    function DecisionPoller(config, Decider) {
        _classCallCheck(this, DecisionPoller);

        // Check for decider.

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DecisionPoller).call(this, config));

        if (!Decider) {
            throw new Error('Decision poller requires a decider');
        }

        // Set the decider.
        _this.decider = new Decider({ taskList: config.taskList.name });
        return _this;
    }
    // Method to call when polling for tasks.


    _createClass(DecisionPoller, [{
        key: '_onTask',
        value: function () {
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
                                this.log.info('Submitting ' + decisions.length + ' decisions.');
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

                                this.log.error('Decision failed. Failing workflow', _context.t0);

                                // TODO: We should retry decisions a few times before failing.
                                // Unexpected things like database timeouts could cause errors.
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
        }()
    }]);

    return DecisionPoller;
}(_Poller3.default), _class.pollMethod = 'pollForDecisionTask', _temp);
exports.default = DecisionPoller;
;