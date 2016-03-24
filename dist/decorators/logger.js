'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (name) {
    return function decorator(target) {
        var original = target;

        var ctor = function ctor() {
            this.log = (0, _logger2.default)(name || original.name);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return original.apply(this, args);
        };

        ctor.prototype = original.prototype;

        return ctor;
    };
};

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;