'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runTask = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var getConnection = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(conn_id) {
        var connectionURL, db, connection, extraJson;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // TODO: support more than just the airflow connection table
                        connectionURL = new _url.URL(process.env.ARIES_CONNECTION_STRING);

                        if (connectionURL.protocol === 'postgresql') {
                            connectionURL.protocol = 'postgres';
                        }
                        // connectionString like postgres://user:pass@host:port
                        db = (0, _knex2.default)({
                            client: 'pg',
                            connection: connectionURL.toString()
                        });
                        _context.next = 5;
                        return db.select().from('connection').where({
                            conn_id: conn_id
                        }).first();

                    case 5:
                        connection = _context.sent;

                        if (connection) {
                            _context.next = 8;
                            break;
                        }

                        throw new Error('Connection ' + conn_id + ' does not exist');

                    case 8:
                        if (!connection.extra) {
                            _context.next = 17;
                            break;
                        }

                        _context.prev = 9;
                        extraJson = JSON.parse(connection.extra);
                        return _context.abrupt('return', _extends({}, connection, extraJson));

                    case 14:
                        _context.prev = 14;
                        _context.t0 = _context['catch'](9);
                        return _context.abrupt('return', connection);

                    case 17:
                        return _context.abrupt('return', connection);

                    case 18:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[9, 14]]);
    }));

    return function getConnection(_x) {
        return _ref.apply(this, arguments);
    };
}();

/**
 * Apply the cli arguments to the module.
 */


var runTask = exports.runTask = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(handler, args) {
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
                        return handler.onTask.apply(handler, _toConsumableArray(args));

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
        return _ref2.apply(this, arguments);
    };
}();

/**
 * Helper function to return the original string if json parse fails.
 */


exports.JSONparse = JSONparse;
exports.decryptConfig = decryptConfig;
exports.parse = parse;

var _url = require('url');

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash.omit');

var _lodash2 = _interopRequireDefault(_lodash);

var _cryptobject = require('cryptobject');

var _cryptobject2 = _interopRequireDefault(_cryptobject);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _tunnel = require('../util/tunnel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var decryptor = _cryptobject2.default.decryptor;
// Create logger.

var log = (0, _logger2.default)(__filename);

function JSONparse(str) {
    try {
        return JSON.parse(str);
    } catch (err) {
        return str;
    }
}

/**
 * decrypts a connection if it's defined and
 * connection._encrypted is true
 * @return {object} the decrypted connection if _encrypted is true.
 * Otherwise the original connection
 * Note: connection.code is not decrypted
 */
function decryptConnection(connection, encryptionKey) {
    if (connection && connection._encrypted) {
        // don't decrypt object.code
        var ignore = ['code'];
        return decryptor(encryptionKey)(connection, ignore);
    }
    return connection;
}

/**
 * checks for a connection object on config and decrypts it
 * if ENCRYPTION_KEY was passed into the environment and
 * connection._encrypted is true. If connection.vpnConnection
 * exists, it will also be decrypted, also only if vpnConnection._encrypted
 * is true..
 * @return {Object} the config with the connection decrypted
 */
function decryptConfig(config) {
    var encryptionKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.env.ENCRYPTION_KEY;

    // if no encryptionKey or connection, just return the config as is
    if (!encryptionKey || !config.connection) return config;
    // exclude the vpnConnection so we can check if it's encrypted separately
    var vpnConnectionOmitted = (0, _lodash2.default)(config.connection, ['vpnConnection']);
    // decrypt connection if _encrypted = true
    var connection = decryptConnection(vpnConnectionOmitted, encryptionKey);
    // decrypt vpnConnection if _encrypted = true
    var vpnConnection = decryptConnection(config.connection.vpnConnection, encryptionKey);
    // put the config back together
    if (vpnConnection) {
        connection.vpnConnection = vpnConnection;
    }
    return _extends({}, config, { connection: connection });
}

/**
 * Parse strings from cli.
 */
function parse(args) {
    // Destructure.
    var _args3 = _slicedToArray(args, 4),
        task = _args3[0],
        config = _args3[1],
        executionDate = _args3[2],
        nextExecutionDate = _args3[3];

    // Return the parsed version.


    return [JSONparse(task), decryptConfig(JSONparse(config)), new Date(executionDate), nextExecutionDate ? new Date(nextExecutionDate) : null];
}

/**
 * Execute an aries module.
 */

exports.default = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(_ref4) {
        var repo = _ref4.repo,
            args = _ref4._;

        var pkg, Module, handler, parsedArgs, _parsedArgs, config, connection, result;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.prev = 0;

                        // Require in the specified module.
                        // eslint-disable-next-line global-require, import/no-dynamic-require
                        pkg = require(repo || process.cwd());

                        // Grab `default` if it exists.

                        Module = pkg.default ? pkg.default : pkg;

                        // Log module name.

                        log.debug('Loaded ' + ((Module.props || {}).name || 'unnamed module') + '.');

                        // Instantiate a new task handler.
                        handler = new Module();
                        parsedArgs = parse(args);

                        // destructure and ignore task at index 0

                        _parsedArgs = _slicedToArray(parsedArgs, 2), config = _parsedArgs[1];

                        // check for conn_id and populate it if exists

                        if (!config.conn_id) {
                            _context3.next = 13;
                            break;
                        }

                        _context3.next = 10;
                        return getConnection(config.conn_id);

                    case 10:
                        connection = _context3.sent;

                        config.connection = connection;
                        log.info('Acquired connection');

                    case 13:
                        if (!(config.connection || {}).vpnConnection) {
                            _context3.next = 16;
                            break;
                        }

                        _context3.next = 16;
                        return (0, _tunnel.createTunnel)(config.connection.vpnConnection);

                    case 16:
                        _context3.next = 18;
                        return runTask(handler, parsedArgs);

                    case 18:
                        result = _context3.sent;


                        // Log the result.
                        log.debug('Task result: ', result);

                        // Return the result.
                        return _context3.abrupt('return', result);

                    case 23:
                        _context3.prev = 23;
                        _context3.t0 = _context3['catch'](0);

                        // Log the error.
                        log.error('Error executing task:', _context3.t0);

                        // Rethrow the error.
                        throw _context3.t0;

                    case 27:
                        _context3.prev = 27;

                        // Log out final message.
                        log.debug('Finished executing task.');
                        return _context3.finish(27);

                    case 30:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this, [[0, 23, 27, 30]]);
    }));

    function execute(_x5) {
        return _ref3.apply(this, arguments);
    }

    return execute;
}();