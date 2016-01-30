import path from 'path';
import swfClient from '../swf/client';
import decisionPoller from '../swf/decisionPoller';

export default function getDecider(decider, domain, taskList) {
    // Buld path to decider.
    const deciderPath = path.join(process.cwd(), decider);

    // Create decider module.
    const deciderModule = require(deciderPath).default({ taskList });

    // Create config for decider.
    const config = { domain, taskList: { name: taskList } };

    // Create swf client.
    const client = swfClient();

    // Create poller.
    return decisionPoller({ client, config, decider: deciderModule });
};
