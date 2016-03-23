'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base Activity
 */

var Activity = (function () {
    function Activity() {
        _classCallCheck(this, Activity);

        var props = this.constructor.props;

        if (!(props.name && props.version)) {
            throw new Error('Activities require a name and version');
        }

        this.log = (0, _logger2.default)('activity:' + props.name);
    }

    _createClass(Activity, [{
        key: 'onTask',
        value: (function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(activityTask) {
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
                return ref.apply(this, arguments);
            }

            return onTask;
        })()
    }]);

    return Activity;
})();

Activity.props = {
    defaultTaskHeartbeatTimeout: '900',
    defaultTaskScheduleToStartTimeout: '120',
    defaultTaskScheduleToCloseTimeout: '3800',
    defaultTaskStartToCloseTimeout: '3600'
};
exports.default = Activity;
;