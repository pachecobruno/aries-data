import isString from 'lodash.isstring';
import flatten from 'lodash.flatten';
import Poller from './Poller';
import ActivityTask from '../tasks/ActivityTask';

/**
 * Activity poller
 */
export default class ActivityPoller extends Poller {
    // Method to call when polling for tasks.
    static pollMethod = 'pollForActivityTask';

    constructor(config, activities) {
        super(config);

        // Check for activities
        if (!activities instanceof Array) {
            throw new Error('Activities poller requires an array of activities');
        }

        // Keep a list of activities
        this.activities = activities;
    }

    async _onTask(result) {
        try {
            const activityType = result.activityType;

            // Get the module for this activityType.
            const Activity = this.findModuleForActivity(result.activityType);
            if (!Activity) {
                throw new Error(`${activityType.name}/${activityType.version} not loaded`);
            }

            // Create an activityTask.
            const task = new ActivityTask(result);

            // If this module has a configProvider, run it.
            // This allows configProviders to return a single object, or array.
            // This array will then be applied to the onTask function,
            // resulting in ability to pass multiple params to onTask.
            // By convention, the first parameter passed in will always be the activityTask
            // and the second should always be the task configuration.
            // This just allows more flexibility for config providers to provide
            // additional contextual information.
            const config = Activity.getConfig ? [await Activity.getConfig(task)] : [{}];

            // Ensure a single dimension array.
            const args = flatten(config);

            // Add task as first arg.
            args.unshift(task);

            // Create new instance of the activity.
            const activity = new Activity(config);

            // Run the onTask function.
            const output = await activity.onTask.apply(activity, args);

            // Throw erorr if output is not a string.
            if (output && !isString(output)) {
                throw new Error('Return value of activities must be a string');
            }

            // Respond completed.
            await this.client.respondActivityTaskCompleted({
                taskToken: result.taskToken,
                result: output,
            });
        } catch(e) {
            this.log.error(e);
            // Respond failure.
            await this.client.respondActivityTaskFailed({
                taskToken: result.taskToken,
                details: '',
                reason: '',
            });
        }
    }

    findModuleForActivity(activityType) {
        return this.activities.find(a => {
            return a.props.name === activityType.name && a.props.version === activityType.version;
        });
    }
};
