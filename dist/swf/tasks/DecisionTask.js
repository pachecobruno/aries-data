'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Task2 = require('./Task');

var _Task3 = _interopRequireDefault(_Task2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Decision Task
 * Simple wrapper around a decision task poll response.
 */
var DecisionTask = function (_Task) {
    _inherits(DecisionTask, _Task);

    function DecisionTask() {
        _classCallCheck(this, DecisionTask);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(DecisionTask).apply(this, arguments));
    }

    _createClass(DecisionTask, [{
        key: 'getHistory',
        value: function getHistory() {
            return this.events;
        }
    }, {
        key: 'newEvents',
        value: function newEvents() {
            var _this2 = this;

            return this.events.filter(function (e) {
                return e.eventId > _this2.previousStartedEventId;
            });
        }
    }]);

    return DecisionTask;
}(_Task3.default);

exports.default = DecisionTask;
;