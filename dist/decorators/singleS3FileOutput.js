'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = singleS3FileOutput;

var _thenifyAll = require('thenify-all');

var _thenifyAll2 = _interopRequireDefault(_thenifyAll);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _aws = require('../util/aws');

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var log = (0, _logger2.default)(__filename);

function singleS3FileOutput() {

    // Acting as a factory, return the decorator function.
    return function (target, key, descriptor) {
        // Copy of the original function.
        var callback = descriptor.value;

        // Create s3 client.
        var client = (0, _aws.createS3Client)();

        // Return a new descriptor with our wrapper function.
        return _extends({}, descriptor, {
            value: function value() {
                var _this = this,
                    _arguments = arguments;

                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var file, key, params, response;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.next = 2;
                                    return callback.apply(_this, _arguments);

                                case 2:
                                    file = _context.sent;

                                    if (file) {
                                        _context.next = 5;
                                        break;
                                    }

                                    return _context.abrupt('return');

                                case 5:

                                    // Create a UUID for the filename.
                                    key = _uuid2.default.v4();

                                    // Create upload params.

                                    params = {
                                        Bucket: process.env.AWS_S3_TEMP_BUCKET,
                                        Key: key,
                                        Body: file
                                    };

                                    // Upload the file.

                                    _context.next = 9;
                                    return client.upload(params);

                                case 9:
                                    response = _context.sent;

                                    log('Successfully uploaded ' + key + '.');

                                    // Return the filename.
                                    return _context.abrupt('return', key);

                                case 12:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this);
                }))();
            }
        });
    };
};