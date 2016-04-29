![Aries logo](https://avatars1.githubusercontent.com/u/17130436?v=3&s=200)

# Aries

Aries is a library and CLI that makes it easy to create and run multi-stage workflows written in javascript (es2015/2016), preferably in a distributed cloud environment.  Aries currently supports [Amazon SWF](https://aws.amazon.com/swf/details/) but can evolve to support other services, or some future custom implementation.

## Terminology
- Decider - The decider is a module that recieves workflow events from SWF, and makes decisions on what to do next.  This can include things like completing/failing the workflow, setting timers, rescheduling the workflow to run again, and scheduling activities to be executed.

- Activity - Activities are modules that implement a specific task, that will typically make up a larger workflow.  Activities should be small and not try to do too much, although they can be long running.

## Creating an Activity
We've created a [boilerplate project](https://github.com/aries-data/aries-activity-boilerplate) with all the necessities. To get started, look through a few examples at the [aries-activity Github organization](https://github.com/aries-data). 

The default export of your module should be your new activity, which extends the `Activity` class that is provided by aries.  There are two things required for every activity - the configuration (name/version), and the `onTask` function.  The name and version are used under the hood by [Amazon SWF](https://aws.amazon.com/swf/details/) when we need to deprecate old activity versions and start using new versions.  The current best practice is to `require` the values provided in `package.json` to keep them consistent.

The `onTask` function is called with two parameters, `activityTask` and `config` by default.  In the astronomer cloud, a third parameter, `lastExecuted` is also provided.

`activityTask` is the raw data provided by SWF, when [polling for activity tasks](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SWF.html#pollForActivityTask-property)
`config` is an aribitrary configuration object for a particular execution of this task.  Activity tasks should be as generic as possible, but configuarable using this parameter.  In the astronomer cloud, this object will be created and updated by users in the UI.  In development, this should be a mocked object passed in by your test.
`lastExecuted` is the date this particular activity was executed as a part of the currently running workflow.

##### `onTask` implementation
Workflows should be broken out into small, managable pieces that don't try to do to much.  A typical workflow might have two steps.  (1) Extract, or query for some data that exists in a database, or API.  (2) Transform the output into a format that the destination can work with. 

Currently, `onTask` should only return a string, which will be loaded to s3 as a file, and that file will be passed into other activites.

##### Decorators
We provide a few decorators that can be used in any activity, using the following syntax:
```javascript
import { Activity, singleS3FileInput, singleS3StreamOutput } from 'aries-data';
import flatten from 'flat';
import papa from 'babyparse';

/**
 * Loads a JSON file, transforms it to csv, then loads back to s3.
 */
export default class JsonToCsv extends Activity {
    static props = {
        name: require('../package.json').name,
        version: require('../package.json').version,
    };

    @singleS3FileInput()
    @singleS3StreamOutput()
    async onTask(activityTask, config) {
        // Create array of strings by splitting on newlines.
        const split = activityTask.input.file.split('\n');

        // Turn strings to objects.
        const docs = split.map(o => {
            try {
                return JSON.parse(o)
            } catch(e) {}
        }).filter(Boolean);

        // Flatten json objects.
        const flatDocs = docs.map(d => flatten(d, { delimiter: '_' }));

        // Json to Csv.
        return papa.unparse(flatDocs, { quotes: true, newline: '\n' });
    }
};
```

1. `singleS3FileInput` - Converts activityTask.input from an AWS S3 Key to the contents of a file.
    * Arguments: `removeAfter`: if set to true, the file will be removed after
3. `singleS3StreamInput` - Converts input to a [stream](http://www.streamjs.org)
    * Arguments: `removeAfter`: if set to true, the file will be removed after
4. `singleS3StreamOutput` - Allows you to return a [stream](http://www.streamjs.org), which is converted into a file before uploading to S3.

##### Logging
When testing an activity, `console.log` doesn't work well due to the output getting piped into a TAP reporter, like faucet, which can make debugging difficult. To solve this, aries uses bunyan to handle logging. All activities have access to a logger instance by default, which can be used like this: `this.log.debug('debug info here')`. When testing your activity, logs are written to `app.log`, which can be viewed in a pretty format with `tail -f app.log | bunyan -o short`. If you just want the raw logs, `tail -f app.log` will print the logs in their json format.

##### Testing
For consistency, all activites should use [tape](https://github.com/substack/tape) for testing.  You should split the functionality and logic of your integration into separate functions on your activity.  These functions should be pure and operate on nothing but its input values, then return some result that can be tested.  Ideally, your `onTask` function should just be the glue between the other testable functions of your activity.
- `npm run test`

##### ActivityTester module
The `ActivityTester` module can be imported from `aries-data` into your tests to run full blown tests by using mock input/output files and executing the onTask function. For example, the testing used when flattening json:
```javascript
import JsonFlatten from '..';
test('flattens a stream', t => async function() {
    const tester = new ActivityTester(JsonFlatten); // pass in your activity to the constructor

    tester.interceptS3StreamInput('./test/input'); // file to log input
    tester.testS3StreamOutput('./test/output', t.equal); // file to log output

    const task = { input: { key: '123' } }; // specify `activityTask` to use when testing
    const config = { some: 'thing' }; // specify `config` to use when testing

    const result = await tester.onTask(task, config); // run the task
    t.ok(result);
}());
```

##### Putting it all together
Typically, adding a new "integration" may only involve writing a single activity that will be chained to already existing activities to produce the desired workflow.  For example, if you need to get salesforece API data to redshift, you should only need to write the `aries-activity-salesforce-source` activity.  When running as a workflow, your new `aries-activity-salesforce-source` could read data from salesforce and write the json response objects to an s3 object.  The next activity, `aries-activity-json-to-csv` could transform the data from json objects to csv, and load the result to a new s3 object.  Finally, `aries-activity-redshift-sink` could use the csv output and efficiently load the data using the `COPY` command.

Workflows are not limited in the amount of activities required.  The typical workflow is three steps, but as the project evolves, workflows could contain many steps, with new features like transformations, and enrichment.  They could even branch and take multiple paths, working on things concurrently.

## Roadmap
- [ ] Better support for JSON serialization for `onTask` return values.  Some activities might need to output multiple files as its output, and other activities may need to recieve multiple file names.
- [ ] Abstractions around s3 file uploads.  This could be a `@s3Result` decorator that automatically takes the returned value, uploads/streams it to s3, and returns a JSON object containing s3 keys.  It could also just be a special type of `s3Result` object that wraps the return value(s).
- [ ] More flexible error handling.
- [ ] CLI tooling to create/test/work with activities.
- [ ] Support for more SWF primitives.
- [ ] Support for running multiple jobs concurrently, up to threshold.
