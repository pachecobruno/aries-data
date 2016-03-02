# aries

Aries is a library and CLI that makes it easy to create and run multi-stage workflows written in javascript (es2015/2016), preferably in a distributed cloud environment.  Aries currently supports [Amazon SWF)[https://aws.amazon.com/swf/details/] but can evolve to support other services.

## Terminology
- Decider - The decider is a module that recieves workflow events from SWF, and makes decisions on what to do next.  This can include things like Completing/Failing the workflow, as well as scheduling activities to be executed.

- Activity - Activities are modules that implement a specific task, that will typically make up a larger workflow.  Activities should be small and not try to do too much, although they can be long running.

## Creating new activities
