import bunyan from 'bunyan';
import bunyanFormat from 'bunyan-format';
import path from 'path';

class Logger {

    // Create a default logger.
    constructor(streams) {
        this.log = bunyan.createLogger({
            name: require('../../package.json').name,
            serializers: { err: bunyan.stdSerializers.err },
            streams: streams || [{
                level: 'trace',
                stream: bunyanFormat({ outputMode: 'short' }),
            }, {
                level: 'trace',
                path: process.env.LOG_FILE || './app.log',
            }]
        });
    }

    // Create a base logger.
    createLogger(options) {
        // If a string is passed, just use it for the name.
        const params = typeof options === 'string'
            ? { component: path.basename(options, '.js') }
            : options;

        // Return a child logger.
        return this.log.child(params);
    }
}

// Instantiate a singleton.
const logger = new Logger();

// For backwards compat, just export createLogger as default.
export default ::logger.createLogger;
