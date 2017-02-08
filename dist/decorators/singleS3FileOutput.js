'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = singleS3FileOutput;

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _aws = require('../util/aws');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
                var _this = this;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var file, s3Params, response;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.next = 2;
                                    return callback.apply(_this, args);

                                case 2:
                                    file = _context.sent;

                                    if (file) {
                                        _context.next = 5;
                                        break;
                                    }

                                    return _context.abrupt('return');

                                case 5:

                                    // Create upload params.
                                    s3Params = {
                                        Bucket: process.env.AWS_S3_TEMP_BUCKET,
                                        Key: _uuid2.default.v4(),
                                        Body: file
                                    };

                                    // Upload the file.

                                    _this.log.debug('Uploading ' + s3Params.Key + ' to s3.');
                                    // eslint-disable-next-line no-unused-vars
                                    _context.next = 9;
                                    return client.upload(s3Params);

                                case 9:
                                    response = _context.sent;

                                    _this.log.debug('Successfully uploaded ' + s3Params.Key + '.');

                                    // Return the filename.
                                    return _context.abrupt('return', { key: s3Params.Key });

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
}