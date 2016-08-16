import test from 'blue-tape';
import execute from '../lib/cli/execute';

test('execute a good activity', t => async function() {
    // String params, from airflow.
    const task = '{}';
    const config = '{}';
    const executionDate = '';

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
    const executionDate = '';

    // Absolute path to mock activity.
    const repo = `${process.cwd()}/test/badActivity`;

    // Construct param object.
    const params = { repo, _: [task, config, executionDate] };

    // Assert that the promise should fail.
    return t.shouldFail(execute(params));
});
