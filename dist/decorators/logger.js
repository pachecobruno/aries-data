'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = logger;

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function logger() {
    return function (target) {
        console.log(target);
        target.prototype.log = (0, _logger2.default)(target.name);
    };
};