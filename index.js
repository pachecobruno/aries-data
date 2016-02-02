/*
 * Main entry point when imported.
 * Export important modules.
 */

import stampit from 'stampit';
import logger from './lib/util/logger';

// Default export is just a basic stamp.
export default stampit.init(function() {
    // Set up a default logger.
    this.log = logger('mixin');
});

export { default as swf } from './lib/swf/client';
export { default as activity } from './lib/swf/activity';
export { default as decider } from './lib/swf/decider';
export { default as activityConfigProvider } from './lib/swf/activityConfigProvider';
export { default as workflowStateProvider } from './lib/swf/workflowStateProvider';
export { default as registerActivity } from './lib/swf/registerActivity';
export { default as boot } from './lib/boot/boot.js';
