![Aries logo](https://avatars1.githubusercontent.com/u/17130436?v=3&s=200)

# Aries

Aries is a library and CLI that makes it easy to create and run multi-stage workflows written in javascript (es2015/2016), preferably in a distributed cloud environment.  Aries currently supports [Amazon SWF](https://aws.amazon.com/swf/details/) but can evolve to support other services, or some future custom implementation.

## Terminology
- Decider - The decider is a module that recieves workflow events from SWF, and makes decisions on what to do next.  This can include things like completing/failing the workflow, setting timers, rescheduling the workflow to run again, and scheduling activities to be executed.

- Activity - Activities are modules that implement a specific task, that will typically make up a larger workflow.  Activities should be small and not try to do too much, although they can be long running.

## Creating new activities
First browse through a couple of examples in the [aries-activities org](https://github.com/aries-activities).
In the future, the aries CLI will include commands to generate and boilerplate activities, but for now its a manual process.

#### Create a new aries-activity project
We've created a [boilerplate project](https://github.com/aries-data/aries-activity-boilerplate) with all the necessities. Check out the docs there for instructions on creating a new activity.

## Roadmap
- [ ] Better support for JSON serialization for `onTask` return values.  Some activities might need to output multiple files as its output, and other activities may need to recieve multiple file names.
- [ ] Abstractions around s3 file uploads.  This could be a `@s3Result` decorator that automatically takes the returned value, uploads/streams it to s3, and returns a JSON object containing s3 keys.  It could also just be a special type of `s3Result` object that wraps the return value(s).
- [ ] More flexible error handling.
- [ ] CLI tooling to create/test/work with activities.
- [ ] Support for more SWF primitives.
- [ ] Support for running multiple jobs concurrently, up to threshold.
