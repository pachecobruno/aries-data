"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = jsonOutput;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function jsonOutput() {

    // Acting as a factory, return the decorator function.
    return function (target, key, descriptor) {
        // Copy of original function.
        var callback = descriptor.value;

        // Return a new descriptor with our wrapper function.
        return _extends({}, descriptor, {
            value: function value() {
                var _this = this;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var result, str;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.next = 2;
                                    return callback.apply(_this, args);

                                case 2:
                                    result = _context.sent;

                                    if (result) {
                                        _context.next = 5;
                                        break;
                                    }

                                    return _context.abrupt("return");

                                case 5:

                                    // Stringify the returned object.
                                    str = JSON.stringify(result);

                                    // Return the string.

                                    return _context.abrupt("return", str);

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