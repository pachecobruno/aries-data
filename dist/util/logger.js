'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = logger;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function logger(fileName) {
    return (0, _debug2.default)('aries:' + _path2.default.basename(fileName, '.js'));
};