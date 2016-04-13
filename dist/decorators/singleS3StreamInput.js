'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.applyTransforms = applyTransforms;
exports.default = singleS3StreamInput;

var _aws = require('../util/aws');

var _s3Streams = require('s3-streams');

var _s3Streams2 = _interopRequireDefault(_s3Streams);

var _highland = require('highland');

var _highland2 = _interopRequireDefault(_highland);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * Apply split/json parsing transform streams.
 * @param {Object} source - read stream.
 * @param {Boolean/String} split - split on newlines and/or parse json.
 */
function applyTransforms(source, split) {
    // Wrap with highland.
    var readStream = (0, _highland2.default)(source);

    // No transformations.
    if (!split) {
        return readStream;
    }

    // Split on new lines.
    if (split === true) {
        return readStream.split();
    }

    // Split on new lines, then parse individual lines into objects.
    // Ignore errors - typically caused by trailing new lines in input.
    if (split === 'json') {
        return readStream.split().map(JSON.parse).errors(function (err) {});
    }
};

/**
 * Single S3 Stream Input
 * @param {Boolean|String} split - Split the input on new lines and optionally parse.
 * @param {Boolean} removeAfter - Remove file after we finish processing.
 * @returns {Object} Json to locate the output file.
 */
function singleS3StreamInput() {
    var split = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    var removeAfter = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    // Return a decorator.
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
                    var s3Params, readStream, stream, input, newActivityTask, newArgs, result, client;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    // Location of s3 file.
                                    s3Params = {
                                        Bucket: process.env.AWS_S3_TEMP_BUCKET,
                                        Key: activityTask.input.key
                                    };

                                    // Get a read stream to the source.

                                    readStream = _s3Streams2.default.ReadStream((0, _aws.createS3Client)(true), s3Params);

                                    // Split chunks by newlines if required.

                                    stream = applyTransforms(readStream, split);

                                    // Merge parsed input object with a file stream.

                                    input = _extends({}, activityTask.input, { file: stream });

                                    // Create new activityTask replacing the original input with the file.

                                    newActivityTask = activityTask.assign({ input: input });

                                    // Create args for original function.

                                    newArgs = [newActivityTask].concat(args);

                                    // Return the result.

                                    _context.next = 8;
                                    return callback.apply(_this, newArgs);

                                case 8:
                                    result = _context.sent;

                                    if (!removeAfter) {
                                        _context.next = 14;
                                        break;
                                    }

                                    client = (0, _aws.createS3Client)();
                                    _context.next = 13;
                                    return client.deleteObject(s3Params);

                                case 13:
                                    _this.log.info('Deleted ' + s3Params.Key);

                                case 14:
                                    return _context.abrupt('return', result);

                                case 15:
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