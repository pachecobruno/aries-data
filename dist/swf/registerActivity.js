'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var log = (0, _logger2.default)(__filename);

/**
 * Export a function to register activities with SWF
 */

exports.default = (function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(domain, config) {
        var client, activityTypes, matchedActivity, fullConfig;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // Create client.
                        client = (0, _client2.default)();

                        // Get registered activities for this domain.

                        _context.next = 3;
                        return client.listActivityTypes({
                            domain: domain,
                            registrationStatus: 'REGISTERED'
                        });

                    case 3:
                        activityTypes = _context.sent;

                        // Find one that matches the name/version in config.
                        matchedActivity = activityTypes.typeInfos.find(function (at) {
                            return at.activityType.name === config.name && at.activityType.version === config.version;
                        });

                        // Return early if it's already registered.

                        if (!matchedActivity) {
                            _context.next = 7;
                            break;
                        }

                        return _context.abrupt('return', log(config.name + '/' + config.version + ' already registered'));

                    case 7:

                        // Merge config and register activity.
                        fullConfig = Object.assign({ domain: domain }, config);
                        _context.next = 10;
                        return client.registerActivityType(fullConfig);

                    case 10:
                        return _context.abrupt('return', log(config.name + '/' + config.version + ' has been registered'));

                    case 11:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function registerActivity(_x, _x2) {
        return ref.apply(this, arguments);
    };
})();