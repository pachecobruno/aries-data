'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.default = createLogger;

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _bunyanFormat = require('bunyan-format');

var _bunyanFormat2 = _interopRequireDefault(_bunyanFormat);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Development stream.

var DevStream = (function () {
    function DevStream() {
        _classCallCheck(this, DevStream);
    }

    _createClass(DevStream, [{
        key: 'write',
        value: function write(rec) {
            console.log('[%s] %s: %s', rec.time.toISOString(), _bunyan2.default.nameFromLevel[rec.level], rec.msg);
        }
    }]);

    return DevStream;
})();

function getStreams() {
    return [{
        level: 'info', // use trace someday
        stream: (0, _bunyanFormat2.default)({ outputMode: 'short' })
    }, {
        level: 'trace',
        path: process.env.LOG_FILE || './app.log'
    }];
}

// Create a base logger.
var log = _bunyan2.default.createLogger({
    name: require('../../package.json').name,
    streams: getStreams()
});

// Exprot a function to create a child logger.
function createLogger(options) {
    // If a string is passed, just use it for the name.
    var params = typeof options === 'string' ? { component: _path2.default.basename(options, '.js') } : options;

    // Return a child logger.
    return log.child(params);
};