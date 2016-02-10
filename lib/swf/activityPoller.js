import stampit from 'stampit';
import isString from 'lodash.isstring';
import poller from './poller';
import activityTask from './activityTask';
import logger from '../util/logger';
const log = logger(__filename);

/**
 * Activity poller
 */
export default stampit.compose(poller, stampit.props({
    pollMethod: 'pollForActivityTask',
}).init(function() {
    // Check for activities
    if (!this.activities instanceof Array) {
        throw new Error('Activities poller requires an array of activities');
    }
}).methods({
    async _onTask(result) {
        try {
            const activityType = result.activityType;

            // Get the module for this activityType.
            const module = this.findModuleForActivity(result.activityType);
            if (!module) {
                throw new Error(`${activityType.name}/${activityType.version} not loaded`);
            }

            // Create an activityTask.
            const task = activityTask(result);

            // If this module has a configProvider, get it.  Always produce an object.
            const config = Object.assign({}, module.getConfig ? await module.getConfig(task) : {});

            // Run the task.
            const output = await module.onTask(task, config);

            // Throw erorr if output is not a string.
            if (output && !isString(output)) {
                throw new Error('Return value of activities must be a string');
            }

            // If the activity has an afterTask defined, run it.
            // TODO: Maybe not await and maybe not throw errors generated here.
            if (module.afterTask) {
                await module.afterTask(task, config);
            }

            // Respond completed.
            await this.client.respondActivityTaskCompleted({
                taskToken: result.taskToken,
                result: output,
            });
        } catch(e) {
            log(e);
            // Respond failure.
            await this.client.respondActivityTaskFailed({
                taskToken: result.taskToken,
                details: '',
                reason: '',
            });
        }
    },

    findModuleForActivity(activityType) {
        return this.activities.find(a => {
            return a.config.name === activityType.name && a.config.version === activityType.version;
        });
    },
}));

