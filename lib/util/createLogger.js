import bunyan from 'bunyan';
import bunyanFormat from 'bunyan-format';
import path from 'path';

// Development stream.
class DevStream {
    write(rec) {
        console.log('[%s] %s: %s',
            rec.time.toISOString(),
            bunyan.nameFromLevel[rec.level],
            rec.msg);
    }
}

function getStreams() {
    return [{
        level: 'info', // use trace someday
        stream: bunyanFormat({ outputMode: 'short' }),
    }, {
        level: 'trace',
        path: process.env.LOG_FILE || './app.log',
    }];
}

// Create a base logger.
const log = bunyan.createLogger({
    name: require('../../package.json').name,
    streams: getStreams(),
});

// Exprot a function to create a child logger.
export default function createLogger(options) {
    // If a string is passed, just use it for the name.
    const params = typeof options === 'string'
        ? { component: path.basename(options, '.js') }
        : options;

    // Return a child logger.
    return log.child(params);
};
