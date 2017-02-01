'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = singleS3FileInput;

var _aws = require('../util/aws');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Single S3 File Input
 * @param {Boolean} removeAfter - Remove file after processing.
 * @returns {Object} Result of decorated function.
 */
function singleS3FileInput() {
    // Return a decorator.
    return function (target, key, descriptor) {
        // Copy of the original function.
        var callback = descriptor.value;

        // Create s3 client.
        var client = (0, _aws.createS3Client)();

        // Return a new descriptor with our new wrapper function.
        return _extends({}, descriptor, {
            value: function value(activityTask) {
                var _this = this;

                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var params, response, fileString, input, newActivityTask, newArgs, result;
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

                                    // Create params.
                                    params = {
                                        Bucket: process.env.AWS_S3_TEMP_BUCKET,
                                        Key: activityTask.input.key
                                    };

                                    // Download file.

                                    _context.next = 5;
                                    return client.getObject(params);

                                case 5:
                                    response = _context.sent;


                                    // Get a string.
                                    fileString = response.Body.toString();

                                    // Merge parsed input object with file contents.

                                    input = _extends({}, activityTask.input, { file: fileString });

                                    // Create new activityTask replacing the original input with the file.
                                    // const newActivityTask = activityTask.assign({ input });

                                    newActivityTask = { input: input };

                                    // Create args for original function.

                                    newArgs = [newActivityTask].concat(args);

                                    // Return the result.

                                    _context.next = 12;
                                    return callback.apply(_this, newArgs);

                                case 12:
                                    result = _context.sent;

                                    if (!process.env.ARIES_REMOVE_FILES_AFTER_TASK) {
                                        _context.next = 17;
                                        break;
                                    }

                                    _context.next = 16;
                                    return client.deleteObject(params);

                                case 16:
                                    _this.log.info('Deleted ' + params.Key);

                                case 17:
                                    return _context.abrupt('return', result);

                                case 18:
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