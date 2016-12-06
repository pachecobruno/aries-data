import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;
import nock from 'nock';
import execute, { parse } from '../lib/cli/execute';

describe('execute', function() {

  describe('#execute', function() {
    it('executes goodActivity', async function() {
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
      assert.equal(result.input, 'result');
    });

    it('it rejects badActivity', function() {
      // String params, from airflow.
      const task = '{}';
      const config = '{}';
      const executionDate = '2016-08-17T19:30:00';

      // Absolute path to mock activity.
      const repo = `${process.cwd()}/test/badActivity`;

      // Construct param object.
      const params = { repo, _: [task, config, executionDate] };

      // Assert that the promise should fail.
      return assert.isRejected(execute(params));
    });
  });

  describe('#parse', function() {
    it('parses arguments', function() {
      const task = '{ "key": "val" }';
      const config = '{}';
      const executionDate = '2016-08-17T19:30:00';
      const args = [task, config, executionDate];

      const [parsedTask, parsedConfig, parsedExecutionDate ] = parse(args);

      assert.deepEqual(parsedTask, { key: "val" });
      assert.deepEqual(parsedConfig, {});
      assert.deepEqual(parsedExecutionDate, new Date(executionDate));
    });

    it('parses a non json object', function() {
      const task = 'None';

      const [ parsedTask ] = parse([task]);

      assert.equal(parsedTask, task);
    });
  });

  describe('singleS3StreamInput', function() {
    it.skip('exits early with no data', async function() {
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
      assert.equal(result.input, 'result');
    });
  });
});
