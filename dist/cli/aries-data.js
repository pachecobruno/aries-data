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
require('./execute').default(argv);