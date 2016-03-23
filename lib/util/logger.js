import bunyan from 'bunyan';
import bunyanFormat from 'bunyan-format';
import path from 'path';

class Logger {

    // Create a default logger.
    constructor() {
        this.log = Logger.createRootLogger();
    }

    // Export function to set logstreams.
    setLogStreams(streams) {
        if (!streams) return;
        this.log = Logger.createRootLogger(streams);
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

    // Create a root logger.
    static createRootLogger(streams) {
        return bunyan.createLogger({
            name: require('../../package.json').name,
            streams: streams || [{
                level: 'trace',
                stream: bunyanFormat({ outputMode: 'short' }),
            }, {
                level: 'trace',
                path: process.env.LOG_FILE || './app.log',
            }]
        });
    }
}

// Export a singleton.
export const logger = new Logger();

// For backwards compat, just export createLogger as default.
export default ::logger.createLogger;
