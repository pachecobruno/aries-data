'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = singleS3StreamInput;

var _aws = require('../util/aws');

var _s3Streams = require('s3-streams');

var _s3Streams2 = _interopRequireDefault(_s3Streams);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var log = (0, _logger2.default)(__filename);

function singleS3StreamInput(removeAfter) {

    // Acting as a factory, return the decorator function.
    return function (target, key, descriptor) {
        // Copy of the original function.
        var callback = descriptor.value;

        // Return a new descriptor with our new wrapper function.
        return _extends({}, descriptor, {
            value: function value(activityTask) {
                var _this = this;

                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var params, input, newActivityTask, newArgs, result, client;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    // Create params.
                                    params = {
                                        Bucket: process.env.AWS_S3_TEMP_BUCKET,
                                        Key: activityTask.input
                                    };

                                    // Create a stream to source file.

                                    input = _s3Streams2.default.ReadStream((0, _aws.createS3Client)(true), params);

                                    // Create new activityTask replacing the original input with the file.
                                    // const newActivityTask = Object.assign({}, activityTask, { input });

                                    newActivityTask = _extends({}, activityTask, { input: input });

                                    // Create args for original function.

                                    newArgs = [newActivityTask].concat(args);

                                    // Return the result.

                                    _context.next = 6;
                                    return callback.apply(_this, newArgs);

                                case 6:
                                    result = _context.sent;

                                    if (!removeAfter) {
                                        _context.next = 11;
                                        break;
                                    }

                                    client = (0, _aws.createS3Client)();
                                    _context.next = 11;
                                    return client.deleteObject(params);

                                case 11:
                                    return _context.abrupt('return', result);

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