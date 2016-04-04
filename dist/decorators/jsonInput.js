"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = jsonInput;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function jsonInput() {

    // Acting as a factory, return the decorator function.
    return function (target, key, descriptor) {
        // Copy of original function.
        var callback = descriptor.value;

        // Return a new descriptor with our wrapper function.
        return _extends({}, descriptor, {
            value: function value(activityTask) {
                var _this = this;

                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var input, newActivityTask, newArgs, result;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    // Parse the input into an object.
                                    input = JSON.parse(activityTask.input);

                                    // Create a clone with new input.

                                    newActivityTask = _extends({}, activityTask, { input: input });

                                    // New array of args to apply to original function.

                                    newArgs = [newActivityTask].concat(args);

                                    // Apply new args to original function.

                                    _context.next = 5;
                                    return callback.apply(_this, newArgs);

                                case 5:
                                    result = _context.sent;
                                    return _context.abrupt("return", result);

                                case 7:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this);
                }))();
            }
        });
    };
};