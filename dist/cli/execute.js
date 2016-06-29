'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// Run the task, keep some stats.

var runTask = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(handler, args) {
        var start, output, _process$hrtime, _process$hrtime2, seconds, duration;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // Log out arguments.
                        log.debug('Executing task with ' + args.length + ' args.');
                        // args.forEach((arg, i) => log.debug(`${i} ->`, arg));

                        // Start timer.
                        start = process.hrtime();

                        // Attempt to execute the task.

                        _context.next = 4;
                        return handler.onTask.apply(handler, args);

                    case 4:
                        output = _context.sent;


                        // Get duration.
                        _process$hrtime = process.hrtime(start);
                        _process$hrtime2 = _slicedToArray(_process$hrtime, 1);
                        seconds = _process$hrtime2[0];
                        duration = _moment2.default.duration(seconds, 'seconds').humanize();

                        log.debug('Task executed in ' + duration + ' (' + seconds + ' sec).');

                        // Mimic legacy SWF behavior.
                        return _context.abrupt('return', { input: output });

                    case 11:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function runTask(_x, _x2) {
        return ref.apply(this, arguments);
    };
}();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

// Create logger.
var log = (0, _logger2.default)(__filename);

// Function to parse json if it can.
var parse = function parse(arg) {
    try {
        return JSON.parse(arg);
    } catch (e) {
        return arg;
    }
};;

// Export function to execute aries repos.

exports.default = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref) {
        var repo = _ref.repo;
        var _ = _ref._;
        var args, pkg, Module, handler, output;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;

                        // Parse args.
                        args = _.map(parse);

                        // Require in the module.

                        pkg = require(repo || process.cwd());

                        // Grab `default` if it exists.

                        Module = pkg.default ? pkg.default : pkg;

                        // Log module name.

                        log.debug('Loaded ' + ((Module.props || {}).name || 'unnamed module') + '.');

                        // Instantiate a new task handler.
                        handler = new Module();

                        // Run the handler and get the output.

                        _context2.next = 8;
                        return runTask(handler, args);

                    case 8:
                        output = _context2.sent;


                        // Stringify the final output and log it to STDOUT for airflow, with no bunyan chrome.
                        log.debug('Task return value:');
                        console.log(JSON.stringify(output));

                        _context2.next = 17;
                        break;

                    case 13:
                        _context2.prev = 13;
                        _context2.t0 = _context2['catch'](0);

                        log.error('Error executing task:', _context2.t0);
                        process.exit(1);

                    case 17:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 13]]);
    }));

    function execute(_x3) {
        return ref.apply(this, arguments);
    }

    return execute;
}();