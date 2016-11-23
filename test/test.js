import test from 'blue-tape';
import nock from 'nock';
import Activity from '../lib/Activity';
import execute, { parse } from '../lib/cli/execute';

test('execute a good activity', t => async function() {
    // String params, from airflow.
    const task = '{}';
    const config = '{}';
    const executionDate = '2016-08-17T19:30:00';

    // Absolute path to mock activity.
    const repo = `${process.cwd()}/test/goodActivity`;

    // Construct param object.
    const params = { repo, _: [task, config, executionDate] };

    // Execute!
    const result = await execute(params);

    // Make sure we have input and the result from the mock task.
    t.equal(result.input, 'result');
}());

test('execute a bad activity', t => {
    // String params, from airflow.
    const task = '{}';
    const config = '{}';
    const executionDate = '2016-08-17T19:30:00';

    // Absolute path to mock activity.
    const repo = `${process.cwd()}/test/badActivity`;

    // Construct param object.
    const params = { repo, _: [task, config, executionDate] };

    // Assert that the promise should fail.
    return t.shouldFail(execute(params));
});

test('parse arguments', t => {
    const task = '{ "key": "val" }';
    const config = '{}';
    const executionDate = '2016-08-17T19:30:00';
    const args = [task, config, executionDate];

    const [parsedTask, parsedConfig, parsedExecutionDate ] = parse(args);

    t.deepEqual(parsedTask, { key: "val" });
    t.deepEqual(parsedConfig, {});
    t.deepEqual(parsedExecutionDate, new Date(executionDate));
    t.end();
});

test('parses a non json object', t => {
    const task = 'None';

    const [ parsedTask ] = parse([task]);

    t.equal(parsedTask, task);
    t.end();
});

test.skip('singleS3StreamInput exits early with no data', t => async function() {
    // String params, from airflow.
    const task = '{"input":{"key":"someobject"}}';
    const config = '{}';
    const executionDate = '2016-08-17T19:30:00';

    // // Mock up env var.
    process.env.AWS_S3_TEMP_BUCKET = 'astronomer-workflows';
    process.env.AWS_REGION = 'us-east-1';

    // Absolute path to mock activity.
    const repo = `${process.cwd()}/test/inputStreamActivity`;

    // Construct param object.
    const params = { repo, _: [task, config, executionDate] };

    nock(`https://${process.env.AWS_S3_TEMP_BUCKET}.s3.amazonaws.com`);

    // Execute!
    const result = await execute(params);

    // Make sure we have input and the result from the mock task.
    t.equal(result.input, 'result');
}());
