'use strict';

const Redis = require('ioredis'),
    defineCommands = require('./defineCommand'),
    core = {
        errors: require('./core/errors.js'),
        debug: require('./core/debug.js'),
    },
    ttlRedis = 60,
    ttlLocal = 30;

class ZIRedis extends Redis {
    constructor(opts) {
        const debug = core.debug('constructor');
        debug('opts', require('util').inspect(opts, 0, 10, 1));
        if (!opts || typeof opts !== 'object' || Array.isArray(opts))
            throw core.errors.type('opts', 'object');
        super(opts);
        this._keys = {};
        this._limit = opts.limit || 500;
        this._cache = new Map();

        defineCommands(this);
    }

    nset(key, value, seconds = ttlRedis, local = ttlLocal) {
        const self = this,
            debug = core.debug('nset');
        debug('key', key);
        debug('value', value);
        debug('ttlRedis', seconds);
        debug('ttlLocal', local);
        if (typeof value !== 'string')
            throw core.errors.type('value', 'string');
        if (Object.keys(self._keys).length === self._limit) {
            self._keys = {};
            self._cache.clear();
        }
        /* istanbul ignore else */
        if (!self._keys[key]) self._keys[key] = key;
        self._cache.set(self._keys[key], Promise.resolve(value));
        setTimeout(() => {
            debug('delete local', key);
            self._cache.delete(self._keys[key]);
            delete self._keys[key];
        }, local * 1000);
        if (seconds) return self.set(key, value, 'EX', seconds);
        self.set(key, value);
    }

    ndel(key) {
        const self = this,
            debug = core.debug('ndel');
        debug('key', key);
        if (self._keys[key]) {
            self._cache.delete(self._keys[key]);
            delete self._keys[key];
        }
        return self.del(key);
    }

    nget(key, local) {
        const self = this,
            debug = core.debug('nget');
        debug('key', key);
        debug('local', local);
        if (!self._keys[key])
            return new Promise((res, rej) => {
                let result;
                self.get(key)
                    .then((value) => {
                        if (!value) return res(value);
                        result = value;
                        return super.ttl(key);
                    })
                    .then((ttl) => {
                        if (!ttl) return;
                        self._keys[key] = key;
                        if (ttl === -1) ttl = ttlLocal;
                        if (local) ttl = local;
                        self._cache.set(self._keys[key], Promise.resolve(result));
                        setTimeout(() => {
                            debug('delete local', key);
                            self._cache.delete(self._keys[key]);
                            delete self._keys[key];
                        }, ttl * 1000);
                        debug('result', result);
                        res(result);
                    })
                    .catch(rej);
            });

        return self._cache.get(self._keys[key])
            .then((value) => {
                debug('result', value);
                return value;
            });
    }

    deletePattern(pattern) {
        const self = this,
            debug = core.debug('deletePattern');
        debug('pattern', pattern);
        return new Promise((resolve, reject) => {
            if (typeof pattern !== 'string')
                return reject(core.errors.type('pattern', 'string'));
            if (pattern.length === 0)
                return reject(core.errors.empty('pattern'));

            self.keys(pattern)
                .then((keys) => {
                    if (keys.length === 0)
                        return 0;
                    return self.del(keys);
                })
                .then(resolve)
                .catch(reject);
        });
    }

    hmsetBulk(elements) {
        const self = this,
            debug = core.debug('hmsetBulk');
        debug('elements', elements);
        return new Promise((resolve, reject) => {
            if (!elements || typeof elements !== 'object' || Array.isArray(elements))
                return reject(core.errors.type('elements', 'object'));

            const pipe = self.pipeline();

            let hasElements = false;
            for (let key in elements) {
                hasElements = true;
                pipe.hmset(key, elements[key]);
            }

            if (hasElements === false)
                return reject(core.errors.empty('elements'));

            pipe.exec()
                .then(resolve)
                .catch(reject);
        });
    }

    hgetallBulk(keys) {
        const self = this,
            debug = core.debug('hgetallBulk');
        debug('keys', keys);
        return new Promise((resolve, reject) => {
            if (!Array.isArray(keys))
                return reject(core.errors.type('keys', 'array'));
            if (keys.length === 0)
                return reject(core.errors.empty('keys'));

            const pipe = self.pipeline();

            for (let i = 0; i < keys.length; i++)
                pipe.hgetall(keys[i]);

            pipe.exec()
                .then(resolve)
                .catch(reject);
        });
    }

    hfind(pattern) {
        const self = this,
            debug = core.debug('hfind');
        debug('pattern', pattern);
        return new Promise((resolve, reject) => {
            if (typeof pattern !== 'string')
                return reject(core.errors.type('pattern', 'string'));
            if (pattern.length === 0)
                return reject(core.errors.empty('pattern'));

            let keys;
            self.keys(pattern)
                .then((_keys) => {
                    keys = _keys;
                    if (keys.length === 0)
                        return keys;
                    return self.hgetallBulk(_keys);
                })
                .then((values) => {
                    if (values.length === 0)
                        return resolve(null);
                    const result = {};
                    for (let i = 0; i < keys.length; i++)
                        result[keys[i]] = values[i][1];

                    resolve(result);
                })
                .catch(reject);
        });
    }
}

module.exports = ZIRedis;
