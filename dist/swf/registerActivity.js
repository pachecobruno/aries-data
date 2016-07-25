'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _aws = require('../util/aws');

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * Export a function to register activities with SWF
 */
exports.default = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(domain, config) {
        var log, client, activityTypes, matchedActivity, fullConfig;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        log = (0, _logger2.default)(__filename);

                        // Create client.

                        client = (0, _aws.createSWFClient)();

                        // Get registered activities for this domain.

                        _context.next = 4;
                        return client.listActivityTypes({
                            domain: domain,
                            registrationStatus: 'REGISTERED'
                        });

                    case 4:
                        activityTypes = _context.sent;


                        // Find one that matches the name/version in config.
                        matchedActivity = activityTypes.typeInfos.find(function (at) {
                            return at.activityType.name === config.name && at.activityType.version === config.version;
                        });

                        // Return early if it's already registered.

                        if (!matchedActivity) {
                            _context.next = 8;
                            break;
                        }

                        return _context.abrupt('return', log.info(config.name + '/' + config.version + ' already registered'));

                    case 8:

                        // Merge config and register activity.
                        fullConfig = Object.assign({ domain: domain }, config);
                        _context.next = 11;
                        return client.registerActivityType(fullConfig);

                    case 11:
                        return _context.abrupt('return', log.info(config.name + '/' + config.version + ' has been registered'));

                    case 12:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function registerActivity(_x, _x2) {
        return _ref.apply(this, arguments);
    }

    return registerActivity;
}();