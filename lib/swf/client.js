import AWS from 'aws-sdk';
import thenify from 'thenify-all';

export default function createClient() {
    const client = new AWS.SWF({ region: 'us-east-1' });
    return thenify(client, client, [
        'startWorkflowExecution',
        'pollForDecisionTask',
        'pollForActivityTask',
        'respondDecisionTaskCompleted',
        'respondActivityTaskCanceled',
        'respondActivityTaskCompleted',
        'respondActivityTaskFailed',
        'listActivityTypes',
        'registerActivityType',
    ]);
};
