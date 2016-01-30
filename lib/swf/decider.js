import stampit from 'stampit';
import logger from '../util/logger';
import flatten from 'lodash.flatten';
import isFunction from 'lodash.isfunction';
import camelCase from 'lodash.camelcase';

/**
 * Base Decider
 * Provides some helper methods to help dealing with decisions.
 */
export default stampit.init(function() {
    // Provider a logger to deciders.
    this.log = logger('decider');
}).methods({
    // Base implementation of onTask.  Return no decisions.
    async onTask(decisionTask) {
        const self = this;

        // Map through fresh events calling async event handlers, producing decisions.
        const decisions = decisionTask.newEvents().map(async function(e) {
            // Get method name for this event handler. ex - onWorkflowExecutionStarted.
            const methodName = `on${e.eventType}`;

            // Return early if this method name is not implemented.
            if (!isFunction(self[methodName])) return [];

            // Get name of attributes on event for this eventType. ex - workflowExecutionStartedAttributes.
            const attrsKey = `${camelCase(e.eventType)}EventAttributes`;

            // Call implementation, passing decisisionTask and this events attrs.
            return await self[methodName].call(self, decisionTask, e[attrsKey]);
        });

        // Flatten arrays after all decisions have resolved.
        return flatten(await Promise.all(decisions));
    },

    addTaskList(attrs) {
        return Object.assign(attrs, {
            taskList: {
                name: `${this.taskList}-activities`,
            },
        });
    },

    scheduleActivity(attrs) {
        return {
            decisionType: 'ScheduleActivityTask',
            scheduleActivityTaskDecisionAttributes: this.addTaskList(attrs),
        };
    },

    completeWorkflow(attrs) {
        return {
            decisionType: 'CompleteWorkflowExecution',
            completeWorkflowExecutionDecisionAttributes: attrs,
        };
    },

    failWorkflow(attrs) {
        return {
            decisionType: 'FailWorkflowExecution',
            failWorkflowExecutionDecisionAttributes: attrs,
        };
    },
});

