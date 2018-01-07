'use strict';

const Mocha = require('mocha'),
    mocha = new Mocha({reporter: process.env.REPORTER || 'spec'}),
    Path = require('wrapper-path'),
    path = new Path(`${__dirname}/../`),
    chai = require('chai');

chai.use(require('chai-as-promised'));

global._path = path;
global._expect = require('chai').expect;
global._ZIRedis = require('../ZIRedis.js');

path.recursive
    .files('/test/', {exclude: /test\/index.js$/g})
    .forEach((file) => mocha.addFile(file));

// Run the tests.
mocha.run(() => process.exit());
