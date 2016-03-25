import DecisionPoller from '../swf/pollers/DecisionPoller';
import createLogger from './logger';

export default function startDecider(domain, taskList, decider) {
    const log = createLogger(__filename);

    log.debug('Preparing to start decision poller.');

    // Create config for decider.
    const config = { domain, taskList: { name: taskList } };

    // Create poller.
    const poller = new DecisionPoller(config, decider);

    // Start polling for decisions.
    poller.start();
};
