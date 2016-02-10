'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stampit = require('stampit');

var _stampit2 = _interopRequireDefault(_stampit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/**
 * Activity Configuration Provider.
 * Responsible for supplying configuration information (if any)
 * Default implementation returns a configuration object that
 * this provider was created with.
 * For example: activityConfigProvier({ config: { setting: 'value' }});
 */
exports.default = _stampit2.default.methods({
    getConfig: function getConfig(task) {
        var _this = this;

        return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!_this.config) {
                                _context.next = 2;
                                break;
                            }

                            return _context.abrupt('return', _this.config);

                        case 2:
                            return _context.abrupt('return', {});

                        case 3:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }))();
    }
});