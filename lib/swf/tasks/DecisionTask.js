import Task from './Task';

/**
 * Decision Task
 * Simple wrapper around a decision task poll response.
 */
export default class DecisionTask extends Task {
    getHistory() {
        return this.events;
    }

    newEvents() {
        return this.events.filter(e => e.eventId > this.previousStartedEventId);
    }
};
