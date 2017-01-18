![Aries logo](https://avatars1.githubusercontent.com/u/17130436?v=3&s=200)

# Aries

Aries is a library and CLI that makes it easy to create and run multi-stage workflows written in JavaScript (ES2015/2016), preferably in a distributed cloud environment.

## Terminology

- Activity - Activities are modules that implement a specific task, that will typically make up a larger workflow.  Activities should be small and precise, although they can be long-running.

## Creating an Activity
We've created a [yeoman generator](https://github.com/aries-data/generator-aries-activity) with all the necessities. To get started, look through a few examples at the [aries-activity Github organization](https://github.com/aries-data).

The default export of your module should be your new activity, which extends the `Activity` class that is provided by Aries.  The only thing required of the `Activity` subclass is an implementation of the `onTask` function.

The `onTask` function is called with two parameters: `activityTask` and `config` by default.  In the Astronomer cloud, a third parameter, `executionDate`, is also provided.

`activityTask` is the raw data provided by the execution environment. The Aries-CLI parses command line arguments and provides this to `onTask`.
`config` is an arbitrary configuration object for a particular execution of this task.  Activity tasks should be as generic as possible, but configurable using this parameter.  In the astronomer cloud, this object will be created and updated by users in the UI.  In development, this should be a mocked object passed in by your test.
`executionDate` is the date this particular activity was executed as a part of the currently running workflow.

##### `onTask` implementation
Workflows should be broken out into small, precise, managable pieces.  A typical workflow might have two steps:

1.  Extract, or query for some data that exists in a database, or API.
2.  Transform the output into a format that the destination can work with.

The return value of `onTask` can be of any type supported by Highland.js. Under the hood, Aries wraps the return value in a highland stream. Streams, promises, or iterables are possible return values;

##### Decorators
We provide the following decorators that can be used in any activity:

1. `singleS3FileInput` - Converts activityTask.input from an Amazon S3 Key to the contents of a file.
    * Arguments: `removeAfter`: if set to true, the file will be removed after
3. `singleS3StreamInput` - Converts input to a [stream](http://www.streamjs.org)
    * Arguments: `removeAfter`: if set to true, the file will be removed after
4. `singleS3StreamOutput` - Allows you to return a [stream](http://www.streamjs.org), which is converted into a file before uploading to S3.

Here's an example of these decorators in an activity that converts data from JSON to CSV format [(see aries-activity-json-to-csv)](https://github.com/aries-data/aries-activity-json-to-csv):
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

##### Logging
Aries uses bunyan to handle logging. All activities have access to a logger instance by default, which can be used like this: `this.log.debug('debug info here')`. When testing your activity, logs are written to `app.log`, which can be viewed in a pretty format with `tail -f app.log | bunyan -o short`. If you just want the raw logs, `tail -f app.log` will print the logs in their JSON format.

It is possible to override the output directory of `app.log` by setting `process.env.LOG_PATH` to a directory. The directory must already exist.

##### Testing
For consistency, all Aries activities implement [mocha](https://github.com/mochajs/mocha) for testing.  You should split the functionality and logic of your integration into separate functions on your activity.  These functions should be pure and operate on nothing but its input values, then return some result that can be tested.  Ideally, your `onTask` function should just be the glue between the other testable functions of your activity.
- `npm run test`

##### Putting it all together
Typically, adding a new "integration" may only involve writing a single activity that will be chained to already existing activities to produce the desired workflow.  For example, if you need to get Salesforece API data to Amazon Redshift, you should only need to write the `aries-activity-salesforce-source` activity.  When running as a workflow, your new `aries-activity-salesforce-source` could read data from Salesforce and write the JSON response objects to an S3 object.  The next activity, `aries-activity-json-to-csv` could transform the data from JSON objects to CSV, and load the result to a new S3 object.  Finally, `aries-activity-redshift-sink` could use the CSV output and efficiently load the data using the `COPY` command.

Workflows are not limited in the amount of activities required.  The typical workflow is three steps, but as the project evolves, workflows could contain many steps, with new features like transformations, and enrichment.  They could even branch and take multiple paths, working on things concurrently.

## Why Node.js?

* Performance: Node.js is wicked fast. Really. Look into it.
* Isomorphic code: A lot of developers are writing code in JavaScript, both client-side and server-side.
* Less code: Writing less code is better — it leads to increased productivity and fewer bugs. With Node.js, we can write very powerful programs with very few lines of code in a single file.
* NPM: The npm registry of open-source modules provides a rich library of code to pull into your application. Just about anything that could be written has been written, and you can add these published modules to your package.json as a dependency.
* Native JSON Support: JSON is the standard data interchange format used by JavaScript, and is easy and natural to work with.
* Better for microservice architecture: Node.js apps are light (easy to build, deploy, and run), modular (easy to break up and refactor) and I/O driven (asynchronous programming).
* Open-source community adoption: usage of Node.js continues to rise, many large companies are now running mission-critical applications.

## Roadmap
- [ ] Better support for JSON serialization for `onTask` return values.  Some activities might need to output multiple files as its output, and other activities may need to receive multiple file names.
- [ ] Abstractions around s3 file uploads.  This could be a `@s3Result` decorator that automatically takes the returned value, uploads/streams it to S3, and returns a JSON object containing S3 keys.  It could also just be a special type of `s3Result` object that wraps the return value(s).
- [ ] More flexible error handling.
- [ ] CLI tooling to create/test/work with activities.
- [ ] Support for more SWF primitives.
- [ ] Support for running multiple jobs concurrently, up to threshold.
