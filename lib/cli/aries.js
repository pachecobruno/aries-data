#!/usr/bin/env node

// Babel up
require('babel-core/register');
require('babel-polyfill');

// Parse arguments
var argv = require('minimist')(process.argv.slice(2), {
    string: ['decider', 'activities', 'tasklist'],
});

// Boot up
var cli = require('./cli').default;
cli(argv);
