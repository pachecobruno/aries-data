import stampit from 'stampit';

/**
 * Decision Task
 * Simple wrapper around a decision task poll response.
 */
export default stampit.refs({
    // Empty events array.  Will be overridden by decision poll response.
    events: [],
}).methods({
    getHistory() {
        return this.events;
    },

    newEvents() {
        return this.events.filter(e => e.eventId > this.previousStartedEventId);
    },
});
