import stampit from 'stampit';
import poller from './poller';
import decisionTask from './decisionTask';
import createLogger from '../util/createLogger';
const log = createLogger(__filename);

/**
 * Decision poller
 */
export default stampit.compose(poller, stampit.props({
    pollMethod: 'pollForDecisionTask',
}).init(function() {
    // Check for decider.
    if (!this.decider) {
        throw new Error('Decision poller requires a decider');
    }
}).methods({
    async _onTask(result) {
        try {
            // Create a decisionTask
            const task = decisionTask(result);

            // Call onTask for a list of decisions to send back.
            const decisions = await this.decider.onTask(task);

            // Return early if no decisions returned.
            if (!decisions) return;

            // Respond with decisions.
            log.info(`Submitting ${decisions.length} decisions.`);
            await this.client.respondDecisionTaskCompleted({
                taskToken: result.taskToken,
                decisions,
            });
        } catch(e) {
            log.error('Decision failed. Failing workflow', e);
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
    },
}));

