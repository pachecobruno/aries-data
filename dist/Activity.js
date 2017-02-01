'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('./util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _rootPackage = require('./util/rootPackage');

var _rootPackage2 = _interopRequireDefault(_rootPackage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base Activity
 */
var Activity = function () {
    function Activity() {
        _classCallCheck(this, Activity);

        var name = _rootPackage2.default.name;

        if (!name) {
            throw new Error('Activities require a name in package.json');
        }

        this.log = (0, _logger2.default)('activity:' + name);
    }

    // eslint-disable-next-line no-unused-vars, class-methods-use-this


    _createClass(Activity, [{
        key: 'onTask',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(activityTask) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt('return');

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function onTask(_x) {
                return _ref.apply(this, arguments);
            }

            return onTask;
        }()
    }]);

    return Activity;
}();

exports.default = Activity;