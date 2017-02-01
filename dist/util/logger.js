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

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = function () {

    // Create a default logger.
    function Logger(streams) {
        _classCallCheck(this, Logger);

        this.log = _bunyan2.default.createLogger({
            // eslint-disable-next-line global-require
            name: require('../../package.json').name,
            serializers: { err: _bunyan2.default.stdSerializers.err },
            streams: streams || this.getDefaultStreams()
        });
    }

    // eslint-disable-next-line class-methods-use-this


    _createClass(Logger, [{
        key: 'getDefaultStreams',
        value: function getDefaultStreams() {
            // Default log level.
            var level = 'trace';

            var stdout = {
                level: level,
                stream: (0, _bunyanFormat2.default)({ outputMode: 'simple', color: false })
            };

            var logPath = process.env.LOG_PATH ? _path2.default.join(process.env.LOG_PATH, _uuid2.default.v4() + '.log') : './app.log';

            var file = {
                level: level,
                path: logPath
            };

            // Return array with our default stream.
            return [stdout, file];
        }

        // Create a base logger.

    }, {
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