'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.transformer = transformer;
exports.default = singleS3StreamOutput;

var _aws = require('../util/aws');

var _streamToPromise = require('stream-to-promise');

var _streamToPromise2 = _interopRequireDefault(_streamToPromise);

var _s3Streams = require('s3-streams');

var _s3Streams2 = _interopRequireDefault(_s3Streams);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _through2Linewriter = require('through2-linewriter');

var _through2Linewriter2 = _interopRequireDefault(_through2Linewriter);

var _through2Map = require('through2-map');

var _through2Map2 = _interopRequireDefault(_through2Map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function transformer(readStream, insertNewlines) {
    if (insertNewlines === true) {
        return readStream.pipe((0, _through2Linewriter2.default)());
    } else if (insertNewlines === 'json') {
        return readStream.pipe(_through2Map2.default.obj(JSON.stringify)).pipe((0, _through2Linewriter2.default)());
    }
};

function singleS3StreamOutput() {
    var insertNewlines = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    // Acting as a factory, return the decorator function.
    return function (target, key, descriptor) {
        // Copy of the original function.
        var callback = descriptor.value;

        return _extends({}, descriptor, {
            value: function value() {
                var _this = this;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var readStream, key, params, stream, writeStream, result;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.next = 2;
                                    return callback.apply(_this, args);

                                case 2:
                                    readStream = _context.sent;

                                    if (readStream) {
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
                                        Key: key
                                    };
                                    stream = insertNewlines ? transformer(readStream, insertNewlines) : readStream;

                                    // Create a stream to write to s3.

                                    writeStream = _s3Streams2.default.WriteStream((0, _aws.createS3Client)(true), params);

                                    // Upload and wait for stream to finish.

                                    _this.log.debug('Streaming ' + key + ' to s3.');
                                    _context.next = 12;
                                    return (0, _streamToPromise2.default)(stream.pipe(writeStream));

                                case 12:
                                    result = _context.sent;

                                    _this.log.debug('Successfully streamed ' + key + ' to s3.');

                                    // Return the filename.
                                    return _context.abrupt('return', { key: key });

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