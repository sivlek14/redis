'use strict';

const ZIRedis = require('../ZIRedis.js'),
    cache = new ZIRedis({
        host: 'localhost',
        port: 6379,
        db: 0,
        readOnly: true,
    }),
    Benchmark = require('benchmark');

cache.set('foo', 'bar');

/* eslint-disable no-console */
(new Benchmark.Suite)
    .add('cache.get', {
        defer: true,
        fn: deferred => cache.get('foo').then(() => deferred.resolve()),
    })
    .add('cache.nget', {
        defer: true,
        fn: deferred => cache.nget('foo').then(() => deferred.resolve()),
    })
    .add('cache.ttl', {
        defer: true,
        fn: deferred => cache.ttl('foo').then(() => deferred.resolve()),
    })
    .add('cache.exists', {
        defer: true,
        fn: deferred => cache.exists('foo').then(() => deferred.resolve()),
    })
    .on('cycle', event => console.log(String(event.target)))
    .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
        process.exit();
    })
    .run({'async': false});
