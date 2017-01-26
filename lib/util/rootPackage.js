import root from 'app-root-path';

/**
 * Exports the root package.json as an object
 * Use to retrieve metadata about the activity
 * @return {Object} an object representing the activity's package.json
 */
// eslint-disable-next-line global-require, import/no-dynamic-require
export default require(`${root}/package.json`);

