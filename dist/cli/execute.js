'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runTask = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * Apply the cli arguments to the module.
 */
var runTask = exports.runTask = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(handler, args) {
        var start, output, _process$hrtime, _process$hrtime2, seconds, duration;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        // Log out arguments.
                        log.debug('Executing task with ' + args.length + ' args.');

                        // Start timer.
                        start = process.hrtime();

                        // Attempt to execute the task.

                        _context2.next = 4;
                        return handler.onTask.apply(handler, args);

                    case 4:
                        output = _context2.sent;


                        // Get duration.
                        _process$hrtime = process.hrtime(start), _process$hrtime2 = _slicedToArray(_process$hrtime, 1), seconds = _process$hrtime2[0];
                        duration = _moment2.default.duration(seconds, 'seconds').humanize();

                        log.debug('Task executed in ' + duration + ' (' + seconds + ' sec).');

                        // Mimic legacy SWF behavior.
                        return _context2.abrupt('return', { input: output });

                    case 9:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function runTask(_x2, _x3) {
        return _ref3.apply(this, arguments);
    };
}();

exports.parse = parse;
exports.JSONparse = JSONparse;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _tunnel = require('../util/tunnel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Create logger.
var log = (0, _logger2.default)(__filename);
/**
 * Execute an aries module.
 */

exports.default = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref2) {
        var repo = _ref2.repo,
            args = _ref2._;

        var pkg, Module, handler, parsedArgs, _parsedArgs, task, config, result;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;

                        // Require in the specified module.
                        pkg = require(repo || process.cwd());

                        // Grab `default` if it exists.

                        Module = pkg.default ? pkg.default : pkg;

                        // Log module name.

                        log.debug('Loaded ' + ((Module.props || {}).name || 'unnamed module') + '.');

                        // Instantiate a new task handler.
                        handler = new Module();
                        parsedArgs = parse(args);
                        _parsedArgs = _slicedToArray(parsedArgs, 2), task = _parsedArgs[0], config = _parsedArgs[1];

                        if (!(config.connection || {}).vpnConnection) {
                            _context.next = 10;
                            break;
                        }

                        _context.next = 10;
                        return (0, _tunnel.createTunnel)(config.connection.vpnConnection);

                    case 10:
                        _context.next = 12;
                        return runTask(handler, parsedArgs);

                    case 12:
                        result = _context.sent;


                        // Log the result.
                        log.debug('Task result: ', result);

                        // Return the result.
                        return _context.abrupt('return', result);

                    case 17:
                        _context.prev = 17;
                        _context.t0 = _context['catch'](0);

                        // Log the error.
                        log.error('Error executing task:', _context.t0);

                        // Rethrow the error.
                        throw _context.t0;

                    case 21:
                        _context.prev = 21;

                        // Log out final message.
                        log.debug('Finished executing task.');
                        return _context.finish(21);

                    case 24:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 17, 21, 24]]);
    }));

    function execute(_x) {
        return _ref.apply(this, arguments);
    }

    return execute;
}();

;

/**
 * Parse strings from cli.
 */
function parse(args) {
    // Destructure.
    var _args3 = _slicedToArray(args, 3),
        task = _args3[0],
        config = _args3[1],
        executionDate = _args3[2];

    // Return the parsed version.


    return [JSONparse(task), JSONparse(config), new Date(executionDate)];
};

/**
 * Helper function to return the original string if json parse fails.
 */
function JSONparse(str) {
    try {
        return JSON.parse(str);
    } catch (err) {
        return str;
    }
};