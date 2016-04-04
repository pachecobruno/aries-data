'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _bunyanFormat = require('bunyan-format');

var _bunyanFormat2 = _interopRequireDefault(_bunyanFormat);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = function () {

    // Create a default logger.

    function Logger(streams) {
        _classCallCheck(this, Logger);

        this.log = _bunyan2.default.createLogger({
            name: require('../../package.json').name,
            serializers: { err: _bunyan2.default.stdSerializers.err },
            streams: streams || [{
                level: 'trace',
                stream: (0, _bunyanFormat2.default)({ outputMode: 'short' })
            }, {
                level: 'trace',
                path: process.env.LOG_FILE || './app.log'
            }]
        });
    }

    // Create a base logger.


    _createClass(Logger, [{
        key: 'createLogger',
        value: function createLogger(options) {
            // If a string is passed, just use it for the name.
            var params = typeof options === 'string' ? { component: _path2.default.basename(options, '.js') } : options;

            // Return a child logger.
            return this.log.child(params);
        }
    }]);

    return Logger;
}();

// Instantiate a singleton.


var logger = new Logger();

// For backwards compat, just export createLogger as default.
exports.default = logger.createLogger.bind(logger);