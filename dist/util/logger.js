'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.logger = undefined;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _bunyanFormat = require('bunyan-format');

var _bunyanFormat2 = _interopRequireDefault(_bunyanFormat);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = (function () {

    // Create a default logger.

    function Logger() {
        _classCallCheck(this, Logger);

        this.log = Logger.createRootLogger();
    }

    // Export function to set logstreams.

    _createClass(Logger, [{
        key: 'setLogStreams',
        value: function setLogStreams(streams) {
            if (!streams) return;
            this.log = Logger.createRootLogger(streams);
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

        // Create a root logger.

    }], [{
        key: 'createRootLogger',
        value: function createRootLogger(streams) {
            return _bunyan2.default.createLogger({
                name: require('../../package.json').name,
                streams: streams || [{
                    level: 'trace',
                    stream: (0, _bunyanFormat2.default)({ outputMode: 'short' })
                }, {
                    level: 'trace',
                    path: process.env.LOG_FILE || './app.log'
                }]
            });
        }
    }]);

    return Logger;
})();

// Export a singleton.

var logger = exports.logger = new Logger();

// For backwards compat, just export createLogger as default.
exports.default = logger.createLogger.bind(logger);