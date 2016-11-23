import root from 'app-root-path';

/**
 * Exports the root package.json as an object
 * Use to retrieve metadata about the activity
 * @return {Object} an object representing the activity's package.json
 */
export default require(`${root}/package.json`);

