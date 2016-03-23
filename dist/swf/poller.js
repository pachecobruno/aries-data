'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _stampit = require('stampit');

var _stampit2 = _interopRequireDefault(_stampit);

var _promiseQueue = require('promise-queue');

var _promiseQueue2 = _interopRequireDefault(_promiseQueue);

var _aws = require('../util/aws');

var _eventEmitter = require('../util/eventEmitter');

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var log = (0, _logger2.default)(__filename);

exports.default = _stampit2.default.compose(_eventEmitter2.default, _stampit2.default.props({
    // Flag to start/stop poller.
    stopPoller: true,

    // Maximum tasks to run concurrently.
    maxConcurrent: 10
}).init(function () {
    // Create an SWF client.
    this.client = (0, _aws.createSWFClient)();

    // Check for valid configuration.
    var config = this.config || {};
    if (!(config.domain && config.taskList)) {
        throw new Error('Poller requires a domain and taskList');
    }

    // Create a queue to manage concurrency.
    // TODO: IMPLEMENT ME.  Once implemented, the poller
    // can fetch jobs one after another, up to maxConcurrent and process them.
    this.queue = new _promiseQueue2.default(this.maxConcurrent, Infinity);
}).methods({
    /**
     * Start polling.
     */

    start: function start() {
        log.info('Starting poller.');
        this.stopPoller = false;
        this.poll();
    },

    /**
     * Stop polling.
     */
    stop: function stop() {
        log.info('Stopping poller.');
        this.stopPoller = true;
    },

    /**
     * Poll this pollers poll method until `stop` is called.
     */
    poll: function poll() {
        var _this = this;

        return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var result;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!_this.stopPoller) {
                                _context.next = 2;
                                break;
                            }

                            return _context.abrupt('return');

                        case 2:

                            _this.emit('poll');

                            _context.prev = 3;
                            _context.next = 6;
                            return _this.client[_this.pollMethod](_this.config);

                        case 6:
                            result = _context.sent;

                            if (!result.taskToken) {
                                _context.next = 10;
                                break;
                            }

                            _context.next = 10;
                            return _this._onTask(result);

                        case 10:
                            _context.next = 16;
                            break;

                        case 12:
                            _context.prev = 12;
                            _context.t0 = _context['catch'](3);

                            log.error(_context.t0);
                            _this.emit('error', _context.t0);

                        case 16:
                            return _context.abrupt('return', _this.poll());

                        case 17:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[3, 12]]);
        }))();
    }
}));