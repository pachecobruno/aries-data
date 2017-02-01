'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.applyTransforms = applyTransforms;
exports.default = singleS3StreamOutput;

var _highland = require('highland');

var _highland2 = _interopRequireDefault(_highland);

var _lodash = require('lodash.isstring');

var _lodash2 = _interopRequireDefault(_lodash);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _stream = require('stream');

var _streamMeter = require('stream-meter');

var _streamMeter2 = _interopRequireDefault(_streamMeter);

var _aws = require('../util/aws');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Apply split/json stringify transform streams.
 * @param {Object} source - read stream.
 * @param {Boolean/String} split - split on newlines and/or stringify json.
 */
function applyTransforms(output, split) {
    // Wrap with highland.
    var readStream = (0, _highland2.default)(output);

    // Add new lines between each chunk.
    if (split === true) {
        return readStream.intersperse('\n');
    }

    // Stringify emitted objects, and add new lines.
    if (split === 'json') {
        return readStream.map(JSON.stringify).intersperse('\n');
    }
    return readStream;
}

/**
 * Single S3 Stream Output
 * @param {Boolean|String} split - Split the input on new lines and optionally parse.
 * @returns {Object} Json to locate the output file.
 */
function singleS3StreamOutput() {
    var split = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    // Return a decorator.
    return function (target, key, descriptor) {
        // Copy of the original function.
        var callback = descriptor.value;

        // Return a new descriptor with our new wrapper function.
        return _extends({}, descriptor, {
            value: function value() {
                var _this = this;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var output, source, readStream, streamCounter, s3Params, s3Options, result;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.next = 2;
                                    return callback.apply(_this, args);

                                case 2:
                                    output = _context.sent;

                                    if (output) {
                                        _context.next = 5;
                                        break;
                                    }

                                    return _context.abrupt('return');

                                case 5:

                                    // Create new string object if output is string literal.
                                    source = (0, _lodash2.default)(output) ? String(output) : output;

                                    // Plug in our transformers if needed.

                                    readStream = applyTransforms(source, split);

                                    // get meter stream to count bytes in stream

                                    streamCounter = (0, _streamMeter2.default)();

                                    // handle the 'finish' event emitted by meter stream so we can log out the bytes
                                    // TODO: associate bytes with an appId

                                    streamCounter.on('finish', function () {
                                        _this.log.info({ totalBytesOut: streamCounter.bytes });
                                    });

                                    // Location of s3 file.
                                    s3Params = {
                                        Bucket: process.env.AWS_S3_TEMP_BUCKET,
                                        Key: _uuid2.default.v4(),
                                        Body: readStream.pipe(streamCounter).pipe(new _stream.PassThrough())
                                    };
                                    s3Options = {
                                        partSize: 5 * 1024 * 1024,
                                        queueSize: 5
                                    };

                                    // Upload and wait for stream to finish.

                                    _this.log.debug('Streaming ' + s3Params.Key + ' to s3.');

                                    // eslint-disable-next-line no-unused-vars
                                    _context.next = 14;
                                    return new Promise(function (resolve, reject) {
                                        // Get a new s3 client.
                                        var s3 = (0, _aws.createS3Client)();
                                        var streamError = null;

                                        // Start upload.
                                        var managedUpload = s3.upload(s3Params, s3Options, function (err, data) {
                                            if (streamError) return reject(streamError);
                                            if (err) return reject(err);
                                            return resolve(data);
                                        });

                                        // Watch for input errors, and abort if we have one.
                                        readStream.on('error', function (err) {
                                            streamError = err;
                                            managedUpload.abort();
                                        });
                                    });

                                case 14:
                                    result = _context.sent;


                                    _this.log.debug('Successfully streamed ' + s3Params.Key + ' to s3.');

                                    // Return the filename.
                                    return _context.abrupt('return', { key: s3Params.Key });

                                case 17:
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