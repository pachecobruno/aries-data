import Poller from './Poller';
import DecisionTask from '../tasks/DecisionTask';

/**
 * Decision poller
 */
export default class DecisionPoller extends Poller {
    // Method to call when polling for tasks.
    static pollMethod = 'pollForDecisionTask';

    constructor(config, Decider) {
        super(config);

        // Check for decider.
        if (!Decider) {
            throw new Error('Decision poller requires a decider');
        }

        // Set the decider.
        this.decider = new Decider({ taskList: config.taskList.name });
    }

    async _onTask(result) {
        try {
            // Create a decisionTask
            const task = new DecisionTask(result);

            // Call onTask for a list of decisions to send back.
            const decisions = await this.decider.onTask(task);

            // Return early if no decisions returned.
            if (!decisions) return;

            // Respond with decisions.
            this.log.info(`Submitting ${decisions.length} decisions.`);
            await this.client.respondDecisionTaskCompleted({
                taskToken: result.taskToken,
                decisions,
            });
        } catch(e) {
            this.log.error('Decision failed. Failing workflow', e);

            // TODO: We should retry decisions a few times before failing.
            // Unexpected things like database timeouts could cause errors.
            await this.client.respondDecisionTaskCompleted({
                taskToken: result.taskToken,
                decisions: [{
                    decisionType: 'FailWorkflowExecution',
                    failWorkflowExecutionDecisionAttributes: {
                        details: '',
                        reason: '',
                    },
                }],
            });
        }
    }
};

