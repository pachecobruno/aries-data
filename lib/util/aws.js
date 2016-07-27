import https from 'https';
import AWS from 'aws-sdk';
import thenify from 'thenify-all';

// AWS.config.update({
//     httpOptions: {
//         agent: new https.Agent({
//             maxSockets: 1024,
//         }),
//     },
// });

export function createSWFClient(raw=false) {
    const client = new AWS.SWF({ region: process.env.AWS_REGION });
    if (raw) return client;

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
        'terminateWorkflowExecution',
    ]);
};

export function createS3Client(raw=false) {
    const client = new AWS.S3({ region: process.env.AWS_REGION });
    if (raw) return client;

    return thenify(client, client, [
        'getObject',
        'putObject',
        'deleteObject',
        'upload',
        'listObjects',
    ]);
};
