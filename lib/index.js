/*
 * Main entry point when imported.
 * Export important modules.
 */

export * as aws from './util/aws';

export { default as Activity } from './swf/Activity';
export { default as Decider } from './swf/Decider';
export { default as registerActivity } from './swf/registerActivity';

export { default as singleS3FileInput } from './decorators/singleS3FileInput';
export { default as singleS3FileOutput } from './decorators/singleS3FileOutput';
export { default as singleS3StreamInput } from './decorators/singleS3StreamInput';
export { default as singleS3StreamOutput } from './decorators/singleS3StreamOutput';

export { default as startWorker } from './util/startWorker';
export { default as startDecider } from './util/startDecider';

export { default as ActivityTester } from './util/testing/ActivityTester';

export { default as createLogger, setLogStreams } from './util/logger';
export { default as logger } from './decorators/logger';
