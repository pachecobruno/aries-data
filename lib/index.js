/*
 * Main entry point when imported.
 * Export important modules.
 */

import stampit from 'stampit';
import logger from './util/logger';

// Default export is just a basic stamp.
export default stampit.init(function() {
    // Set up a default logger.
    this.log = logger('mixin');
});

export * as aws from './util/aws';
export { default as Activity } from './swf/activity';
export { default as decider } from './swf/decider';
export { default as activityConfigProvider } from './swf/activityConfigProvider';
export { default as workflowStateProvider } from './swf/workflowStateProvider';
export { default as registerActivity } from './swf/registerActivity';
export { default as boot } from './boot/boot';
export { default as singleS3FileOutput } from './decorators/singleS3FileOutput';
export { default as singleS3FileInput } from './decorators/singleS3FileInput';
export { default as singleS3StreamInput } from './decorators/singleS3StreamInput';
