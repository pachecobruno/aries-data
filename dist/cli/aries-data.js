#!/usr/bin/env node
'use strict';

// Babel up.  Compile all packages prefixed with aries-.
require('babel-core/register')({
    'ignore': /node_modules\/(?!aries-)/
});
require('babel-polyfill');

// Parse arguments.
var argv = require('minimist')(process.argv.slice(2), {
    string: ['repo']
});

// Get boot params and fire it up.
// Stringify the final output and log it to STDOUT for airflow, with no bunyan chrome.
// For some reason, sometimes the console.log above
// doesn't make it through STDOUT and consequently screws up xcoms, so we use a timeout.
// This should ensure we get a legit last line to output from docker containers for xcom.
require('./execute').default(argv).then(function (output) {
    console.log(JSON.stringify(output));
    setTimeout(process.exit.bind(process, 0), 1000);
}).catch(function (error) {
    console.log(JSON.stringify({}));
    setTimeout(process.exit.bind(process, 1), 1000);
});