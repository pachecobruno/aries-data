import debug from 'debug';
import path from 'path';

export default function logger(fileName) {
    return debug(`aries:${path.basename(fileName, '.js')}`);
};

