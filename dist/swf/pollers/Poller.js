'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); // import Queue from 'promise-queue';

var _aws = require('../../util/aws');

var _logger = require('../../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = (0, _logger2.default)(__filename);

var Poller = (function () {
    // Flag to start/stop poller.

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
        // this.queue = new Queue(this.maxConcurrent, Infinity);
    }

    /**
     * Start polling.
     */

    // Maximum tasks to run concurrently.

    _createClass(Poller, [{
        key: 'start',
        value: function start() {
            log.info('Starting poller.');
            this.stopPoller = false;
            this.poll();
        }

        /**
         * Stop polling.
         */

    }, {
        key: 'stop',
        value: function stop() {
            log.info('Stopping poller.');
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
                                _context.prev = 2;

                                // Grab static poll method string.
                                pollMethod = this.constructor.pollMethod;

                                // Call the poll method.

                                _context.next = 6;
                                return this.client[pollMethod](this.config);

                            case 6:
                                result = _context.sent;

                                if (!result.taskToken) {
                                    _context.next = 10;
                                    break;
                                }

                                _context.next = 10;
                                return this._onTask(result);

                            case 10:
                                _context.next = 15;
                                break;

                            case 12:
                                _context.prev = 12;
                                _context.t0 = _context['catch'](2);

                                log.error(_context.t0);
                                // this.emit('error', e);

                            case 15:
                                return _context.abrupt('return', this.poll());

                            case 16:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[2, 12]]);
            }));

            function poll() {
                return ref.apply(this, arguments);
            }

            return poll;
        })()
    }]);

    return Poller;
})();

Poller.stopPoller = true;
Poller.maxConcurrent = 10;
exports.default = Poller;
;