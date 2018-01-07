'use strict';

const ZIRedis = require('../ZIRedis.js'),
    cache = new ZIRedis({
        host: 'localhost',
        port: 6379,
        db: 0,
        readOnly: true,
    }),
    cache1 = new ZIRedis({
        host: 'localhost',
        port: 6379,
        db: 0,
        readOnly: true,
    }),
    cache2 = new ZIRedis({
        host: 'localhost',
        port: 6379,
        db: 0,
        readOnly: true,
    }),
    Benchmark = require('benchmark');

cache.set('foo', 'bar');

async function ngetAsync(key, local = 10) {
    const self = cache2;
    if (!self._keys[key]) {
        const value = await self.get(key);
        if (!value) return value;
        let ttl = await self.ttl(key);
        self._keys[key] = key;
        if (ttl === -1) ttl = local;
        self._cache.set(self._keys[key], Promise.resolve(value));
        setTimeout(() => {
            self._cache.delete(self._keys[key]);
            delete self._keys[key];
        }, ttl * 1000);
        return value;
    }
    return self._cache.get(self._keys[key]);
}

// cache.nget('foo').then((value) => {
//     console.log('#value', require('util').inspect(value, 0, 10, 1));
// });

// ngetAsync('foo').then((value) => {
//     console.log('#value', require('util').inspect(value, 0, 10, 1));
// });

/*eslint-disable no-console */
(new Benchmark.Suite)
    .add('cache.nget', {
        defer: true,
        fn: (deferred) => cache1.nget('foo').then(() => deferred.resolve()),
    })
    .add('ngetAsync', {
        defer: true,
        fn: (deferred) => ngetAsync('foo').then(() => deferred.resolve()),
    })
    .on('cycle', (event) => console.log(String(event.target)))
    .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
        process.exit();
    })
    .run({'async': false});