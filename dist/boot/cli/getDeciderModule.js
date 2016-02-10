'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getDeciderModule;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDeciderModule(relativePath) {
    try {
        // Buld path to decider.
        var deciderPath = _path2.default.join(process.cwd(), relativePath);

        // Create decider module.
        return require(deciderPath).default;
    } catch (e) {
        throw new Error('Could not load decider module');
    }
};