# aries

Aries is a library and CLI that makes it easy to create and run multi-stage workflows written in javascript (es2015/2016), preferably in a distributed cloud environment.  Aries currently supports [Amazon SWF](https://aws.amazon.com/swf/details/) but can evolve to support other services, or some future custom implementation.

## Terminology
- Decider - The decider is a module that recieves workflow events from SWF, and makes decisions on what to do next.  This can include things like completing/failing the workflow, setting timers, rescheduling the workflow to run again, and scheduling activities to be executed.

- Activity - Activities are modules that implement a specific task, that will typically make up a larger workflow.  Activities should be small and not try to do too much, although they can be long running.

## Creating new activities
First browse through a couple of examples in the [aries-activities org](https://github.com/aries-activities).
In the future, the aries CLI will include commands to generate and boilerplate activities, but for now its a manual process.

#### Create a new aries-activity project
Your project name should always start with `aries-activity-`.  This prefix is used to tell babel to transform this module when running in the cloud, rather than having to maintain a built version within each activity repository.
- `mkdir aries-activity-awesomedb-source && cd $_`
- `npm init -y`
- `git init`

#### Install dependencies
- Install compatible versions of babel packages as well as some testing tools.
`npm install --save-dev babel-core babel-polyfill babel-preset-es2015 babel-cli babel-preset-stage-3 blue-tape faucet nock`

- Install aries.
`npm install --save astronomer-aries`

#### Boilerplate
- Set `main` in `package.json ` to `lib/index.js`.
- Add test command to `package.json` scripts.  This uses `babel-node` to execute tests written with [tape](https://github.com/substack/tape) and pipes the TAP output through [faucet](https://github.com/substack/faucet)
`DEBUG=aries:* NODE_PATH=. babel-node --presets es2015,stage-3 test/test.js | faucet`

- Create a file for your code and a file for your tests.
`mkdir lib test && touch lib/index.js test/test.js`

- Import the aries base activity, and define your new activity.
```
// lib/index.js
import { activity } from 'astronomer-aries';

export default activity.props({
    config: {
        name: 'activity-name',        // Activity name used with SWF
        version: 'activity-version',  // Activity version used with SWF
    },
}).methods({
    async onTask(activityTask, config, lastExecuted) {
        // Your code here.
    },
});
```
The default export of your module should be your new activity, which extends the `activity` that is provided by aries.  There are two things required for every activity - the configuration (name/version), and the `onTask` function.  The name and version are used under the hood by SWF when we need to deprecate old activity versions and start using new versions.  The current best practice is to `require` the values provided in `package.json` to keep them consistent.

The `onTask` function is called with two parameters, `activityTask` and `config` by default.  In the astronomer cloud, a third parameter, `lastExecuted` is also provided.

`activityTask` is the raw data provided by SWF, when [polling for activity tasks](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SWF.html#pollForActivityTask-property)
`config` is an aribitrary configuration object for a particular execution of this task.  Activity tasks should be as generic as possible, but configuarable using this parameter.  In the astronomer cloud, this object will be created and updated by users in the UI.  In development, this should be a mocked object passed in by your test.
`lastExecuted` is the date this particular activity was executed as a part of the currently running workflow.

#### `onTask` implementation
Workflows should be broken out into small, managable pieces that don't try to do to much.  A typical workflow might have three steps.  (1) Extract, or query for some data that exists in a database, or API.  (2) Transform the output into a format that the destination can work with.  (3) Load the resulting file of the last steps into a destination database.  A workflow like this would have three activities, one for each step.

The steps before the final load of the data, typically produce output files and load them to s3, for the next task to pick up and work with.  The returned value of `onTask` is passed in as the input.  Activities in the middle of the workflow can access these intermediate output files using `activityTask.input` to get the string that was returned from the previous activities `onTask`.

Currently, `onTask` should only return strings, or `undefined` (no return value) and it is usually an s3 object key.

#### Testing
For consistency, all activites should use [tape](https://github.com/substack/tape) for testing.  You should split the functionality and logic of your integration into separate functions on your activity.  These functions should be pure and operate on nothing but its input values, then return some result that can be tested.  Ideally, your `onTask` function should just be the glue between the other testable functions of your activity.
- `npm run test`

#### Putting it all together
Typically, adding a new "integration" may only involve writing a single activity that will be chained to already existing activities to produce the desired workflow.  For example, if you need to get salesforece API data to redshift, you should only need to write the `aries-activity-salesforce-source` activity.  When running as a workflow, your new `aries-activity-salesforce-source` could read data from salesforce and write the json response objects to an s3 object.  The next activity, `aries-activity-json-to-csv` could transform the data from json objects to csv, and load the result to a new s3 object.  Finally, `aries-activity-redshift-sink` could use the csv output and efficiently load the data using the `COPY` command.

Workflows are not limited in the amount of activities required.  The typical workflow is three steps, but as the project evolves, workflows could contain many steps, with new features like transformations, and enrichment.  They could even branch and take multiple paths, working on things concurrently.

## Roadmap
- [ ] Better support for JSON serialization for `onTask` return values.  Some activities might need to output multiple files as its output, and other activities may need to recieve multiple file names.
- [ ] Abstractions around s3 file uploads.  This could be a `@s3Result` decorator that automatically takes the returned value, uploads/streams it to s3, and returns a JSON object containing s3 keys.  It could also just be a special type of `s3Result` object that wraps the return value(s).
- [ ] More flexible error handling.
- [ ] CLI tooling to create/test/work with activities.
- [ ] Support for more SWF primitives.
