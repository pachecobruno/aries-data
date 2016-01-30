import stampit from 'stampit';
import events from 'events';

export default stampit.convertConstructor(events.EventEmitter);
