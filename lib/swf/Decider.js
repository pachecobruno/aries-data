import flatten from 'lodash.flatten';
import isFunction from 'lodash.isfunction';
import camelCase from 'lodash.camelcase';
import logger from '../decorators/logger';

/**
 * Base Decider
 * Provides some helper methods to help dealing with decisions.
 */
@logger()
export default class Decider {
    constructor(config) {
        Object.assign(this, config);
    }

    // Base implementation of onTask.  Return no decisions.
    async onTask(decisionTask) {
        // Grab only fresh events.
        const newEvents = decisionTask.newEvents();

        // Create array to hold all the decisions produced.
        const decisions = [];

        // Loop through events IN ORDER FROM TIMESTAMP, SEQUENTIALLY, producing decisions.
        for (const e of newEvents) {
            // Get method name for this event handler. ex - onWorkflowExecutionStarted.
            const methodName = `on${e.eventType}`;

            // Bail early if this method name is not implemented.
            if (!isFunction(this[methodName])) continue;

            // Get name of attributes on event for this eventType. ex - workflowExecutionStartedAttributes.
            const attrsKey = `${camelCase(e.eventType)}EventAttributes`;

            // Call implementation, passing decisisionTask and this events attrs.
            const decision = await this[methodName].call(this, decisionTask, e[attrsKey]);

            // Push decisions onto list.
            decisions.push(decision);
        }

        // Flatten array and remove any falsy values.
        // This allows implemented event handlers to return
        // a single decision, array of decisions or nothing at all (undefined).
        return flatten(decisions).filter(Boolean);
    }

    // Helper method to produce a 'ScheduleActivityTask' decision.
    scheduleActivity(attrs) {
        return {
            decisionType: 'ScheduleActivityTask',
            scheduleActivityTaskDecisionAttributes: Object.assign({
                taskList: { name: `${this.taskList}-activities` }
            }, attrs),
        };
    }

    // Helper method to produce a 'StartTimer' decision.
    startTimer(attrs) {
        return {
            decisionType: 'StartTimer',
            startTimerDecisionAttributes: attrs,
        };
    }

    // Helper method to produce a 'ContinueAsNewWorkflowExecution' decision.
    continueAsNewWorkflowExecution(attrs) {
        return {
            decisionType: 'ContinueAsNewWorkflowExecution',
            continueAsNewWorkflowExecutionDecisionAttributes: Object.assign({
                taskList: { name: this.taskList }
            }, attrs),
        };
    }

    // Helper method to produce a 'CompleteWorkflowExecution' decision.
    completeWorkflow(attrs) {
        return {
            decisionType: 'CompleteWorkflowExecution',
            completeWorkflowExecutionDecisionAttributes: attrs,
        };
    }

    // Helper method to produce a 'FailWorkflowExecution' decision.
    failWorkflow(attrs) {
        return {
            decisionType: 'FailWorkflowExecution',
            failWorkflowExecutionDecisionAttributes: attrs,
        };
    }
};

