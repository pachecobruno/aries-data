'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.applyTransforms = applyTransforms;
exports.default = singleS3StreamInput;

var _s3DownloadStream = require('s3-download-stream');

var _s3DownloadStream2 = _interopRequireDefault(_s3DownloadStream);

var _highland = require('highland');

var _highland2 = _interopRequireDefault(_highland);

var _aws = require('../util/aws');

var _nodeStreamMeter = require('node-stream-meter');

var _nodeStreamMeter2 = _interopRequireDefault(_nodeStreamMeter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Apply split/json parsing transform streams.
 * @param {Object} source - read stream.
 * @param {Boolean/String} split - split on newlines and/or parse json.
 */
function applyTransforms(source, split) {
    // Wrap with highland.
    var readStream = (0, _highland2.default)(source);

    // Split on new lines.
    if (split === true) {
        return readStream.split();
    }

    // Split on new lines, then parse individual lines into objects.
    // Ignore errors - typically caused by trailing new lines in input.
    if (split === 'json') {
        // eslint-disable-next-line no-unused-vars
        return readStream.split().map(JSON.parse).errors(function (err) {});
    }

    // No transformations.
    return readStream;
}

/**
 * Single S3 Stream Input
 * @param {Boolean|String} split - Split the input on new lines and optionally parse.
 * @param {Boolean} removeAfter - Remove file after we finish processing.
 * @returns {Object} Json to locate the output file.
 */
function singleS3StreamInput() {
    var split = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

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
                    var s3Params, client, head, readStream, stream, streamCounter, input, newActivityTask, newArgs, result;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    if ((activityTask.input || {}).key) {
                                        _context.next = 2;
                                        break;
                                    }

                                    return _context.abrupt('return');

                                case 2:

                                    // Location of s3 file.
                                    s3Params = {
                                        Bucket: process.env.AWS_S3_TEMP_BUCKET,
                                        Key: activityTask.input.key
                                    };

                                    // Create S3 client.

                                    client = (0, _aws.createS3Client)();

                                    // Check if file is zero lenth.

                                    _context.next = 6;
                                    return client.headObject(s3Params);

                                case 6:
                                    head = _context.sent;

                                    if (!(head.ContentLength === 0)) {
                                        _context.next = 9;
                                        break;
                                    }

                                    return _context.abrupt('return');

                                case 9:

                                    // Get a read stream to the source.
                                    readStream = (0, _s3DownloadStream2.default)({
                                        client: (0, _aws.createS3Client)(false),
                                        concurrency: 6,
                                        params: s3Params
                                    });

                                    // Split chunks by newlines if required.

                                    stream = applyTransforms(readStream, split);

                                    // get meter stream to count bytes in stream

                                    streamCounter = (0, _nodeStreamMeter2.default)();

                                    // handle the 'end' event emitted by meter stream so we can log out the bytes
                                    // TODO: associate bytes with an appId

                                    streamCounter.on('end', function () {
                                        _this.log.info({ totalBytesIn: streamCounter.bytes });
                                    });

                                    // Merge parsed input object with a file stream.
                                    input = _extends({}, activityTask.input, { file: stream.pipe(streamCounter) });

                                    // Create new activityTask replacing the original input with the file.
                                    // const newActivityTask = activityTask.assign({ input });

                                    newActivityTask = { input: input };

                                    // Create args for original function.

                                    newArgs = [newActivityTask].concat(args);

                                    // Return the result.

                                    _context.next = 18;
                                    return callback.apply(_this, newArgs);

                                case 18:
                                    result = _context.sent;

                                    if (!process.env.ARIES_REMOVE_FILES_AFTER_TASK) {
                                        _context.next = 23;
                                        break;
                                    }

                                    _context.next = 22;
                                    return client.deleteObject(s3Params);

                                case 22:
                                    _this.log.info('Deleted ' + s3Params.Key);

                                case 23:
                                    return _context.abrupt('return', result);

                                case 24:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this);
                }))();
            }
        });
    };
}