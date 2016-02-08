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

export { default as swf } from './swf/client';
export { default as activity } from './swf/activity';
export { default as decider } from './swf/decider';
export { default as activityConfigProvider } from './swf/activityConfigProvider';
export { default as workflowStateProvider } from './swf/workflowStateProvider';
export { default as registerActivity } from './swf/registerActivity';
export { default as boot } from './boot/boot.js';
