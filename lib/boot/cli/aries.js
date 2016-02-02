#!/usr/bin/env node

// Babel up
require('babel-core/register');
require('babel-polyfill');

// Parse arguments.
var argv = require('minimist')(process.argv.slice(2), {
    string: ['decider', 'activities', 'domain', 'tasklist'],
});

// Get boot params and fire it up.
var params = require('./getBootParams').default(argv);
require('../boot').default(params);
