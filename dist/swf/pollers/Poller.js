'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _dec, _class, _class2, _temp; // import Queue from 'promise-queue';

var _aws = require('../../util/aws');

var _logger = require('../../decorators/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Poller = (_dec = (0, _logger2.default)(), _dec(_class = (_temp = _class2 = (function () {
    function Poller(config) {
        _classCallCheck(this, Poller);

        // Create an SWF client.
        this.client = (0, _aws.createSWFClient)();

        // Check for valid configuration.
        if (!(config.domain && config.taskList)) {
            throw new Error('Poller requires a domain and taskList');
        }

        // Save config for later.
        this.config = config;

        // Create a queue to manage concurrency.
        // TODO: IMPLEMENT ME.  Once implemented, the poller
        // can fetch jobs one after another, up to maxConcurrent and process them.
        // this.queue = new Queue(Poller.maxConcurrent, Infinity);

        this.stopPoller = true;
    }

    /**
     * Start polling.
     */

    // Maximum tasks to run concurrently.

    _createClass(Poller, [{
        key: 'start',
        value: function start() {
            this.log.info('Starting poller.');
            this.stopPoller = false;
            this.poll();
        }

        /**
         * Stop polling.
         */

    }, {
        key: 'stop',
        value: function stop() {
            this.log.info('Stopping poller.');
            this.stopPoller = true;
        }

        /**
         * Poll this pollers poll method until `stop` is called.
         */

    }, {
        key: 'poll',
        value: (function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var pollMethod, result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!this.stopPoller) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt('return');

                            case 2:

                                // this.emit('poll');
                                this.log.info('Polling...');

                                _context.prev = 3;

                                // Grab static poll method string.
                                pollMethod = this.constructor.pollMethod;

                                this.log.info(pollMethod);

                                // Call the poll method.
                                _context.next = 8;
                                return this.client[pollMethod](this.config);

                            case 8:
                                result = _context.sent;

                                this.log.info(result);

                                // If we have stuff to do, call _onTask.

                                if (!result.taskToken) {
                                    _context.next = 13;
                                    break;
                                }

                                _context.next = 13;
                                return this._onTask(result);

                            case 13:
                                _context.next = 18;
                                break;

                            case 15:
                                _context.prev = 15;
                                _context.t0 = _context['catch'](3);

                                this.log.error(_context.t0);
                                // this.emit('error', e);

                            case 18:
                                return _context.abrupt('return', this.poll());

                            case 19:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[3, 15]]);
            }));

            function poll() {
                return ref.apply(this, arguments);
            }

            return poll;
        })()
    }]);

    return Poller;
})(), _class2.maxConcurrent = 10, _temp)) || _class);
exports.default = Poller;
;