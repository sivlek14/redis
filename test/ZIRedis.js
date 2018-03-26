'use strict';

describe('ZIRedis', () => {
    let cache = new _ZIRedis({port: 6379, host: '127.0.0.1', limit: 1}),
        cache1 = new _ZIRedis({port: 6379, host: '127.0.0.1'}),
        cache2 = new _ZIRedis({port: 6379, host: '127.0.0.1'}),
        cache3 = new _ZIRedis({port: 6379, host: '127.0.0.1'});
    before(() => {
        cache.nset('asdf', 'qwerty');
    });
    it('success: instance ZIRedis', (done) => {
        let nc = new _ZIRedis({port: 6379, host: '127.0.0.1'});
        _expect(nc instanceof _ZIRedis).to.be.true;
        cache.set('foo', 'bar');
        cache.get('foo').then((bar) => {
            _expect(bar).to.be.equal('bar');
            done();
        }).catch(done);
    });
    it('catch: instance ZIRedis', () => {
        let nc1 = () => new _ZIRedis(6379, '127.0.0.1'),
            nc2 = () => new _ZIRedis('127.0.0.1:6379');
        _expect(nc1).to.throw('zi-redis: "opts" must be "object"');
        _expect(nc2).to.throw('zi-redis: "opts" must be "object"');
    });
    it('nget', (done) => {
        cache.nget('asdf').then((bar) => {
            _expect(bar).to.be.equal('qwerty');
            done();
        }).catch(done);
    });
    it('nset string', (done) => {
        cache.nset('qwerty', 'asdf');
        cache.nget('qwerty').then((value) => {
            _expect(value).to.be.equal('asdf');
            done();
        });
    });
    it('nset overwrite string', (done) => {
        cache.nset('qwerty', 'foo:bar');
        cache.nget('qwerty').then((value) => {
            _expect(value).to.be.equal('foo:bar');
            done();
        });
    });
    it('nset string with expire redis and local', function(done) {
        this.timeout(4000);
        cache.nset('qwerty', 'asdf', 1, 1);
        setTimeout(() => {
            cache.nget('qwerty').then((value) => {
                _expect(value).to.be.null;
                done();
            }).catch(done);
        }, 2000);
    });
    it('nset string with expire local', function(done) {
        this.timeout(4000);
        cache.nset('qwerty', 'asdf', 10, 1);
        setTimeout(() => {
            cache.nget('qwerty').then((value) => {
                _expect(value).to.be.equal('asdf');
                done();
            }).catch(done);
        }, 2000);
    });
    it('nset JSON.stringify and parse value', (done) => {
        cache.nset('a', JSON.stringify(['b', 'c', 'd']));
        cache.nget('a').then((value) => {
            _expect(JSON.parse(value)).to.be.an('array');
            done();
        }).catch(done);
    });
    it('catch nset: value must be a "string"', (done) => {
        const nset = () => cache.nset('a', ['b', 'c', 'd']);
        _expect(nset).to.throw('zi-redis: "value" must be "string"');
        done();
    });
    it('ndel', (done) => {
        cache.nset('qwerty', 'asdf');
        cache.ndel('qwerty');
        cache.nget('qwerty').then((value) => {
            _expect(value).to.be.null;
            done();
        }).catch(done);
    });
    it('multpiples instances of cache', function(done) {
        this.timeout(50000);
        cache1.ndel('foo1');
        cache2.nget('foo1', 1)
            .then((value) => {
                _expect(value).to.be.null;
                return Promise.resolve();
            })
            .then(() => cache3.nget('foo1', 1))
            .then((value) => {
                cache1.nset('foo1', 'bar1', 20, 20);
                cache1.nset('foo2', 'bar2', false);
                _expect(value).to.be.null;
                setTimeout(() => Promise.resolve(), 3000);
            })
            .then(() => cache2.nget('foo1'))
            .then((value) => {
                _expect(value).to.be.equal('bar1');
                return Promise.resolve();
            })
            .then(() => cache2.nget('foo2'))
            .then((value) => {
                _expect(value).to.be.equal('bar2');
                return Promise.resolve();
            })
            .then(() => cache3.nget('foo1', 1))
            .then((value) => {
                _expect(value).to.be.equal('bar1');
                return Promise.resolve();
            })
            .then(() => cache1.nget('foo1', 1))
            .then((value) => {
                _expect(value).to.be.equal('bar1');
                return Promise.resolve();
            })
            .then(() => cache3.nget('foo1', 1))
            .then(value => new Promise((res) => {
                _expect(value).to.be.equal('bar1');
                setTimeout(() => res(), 3000);
            }))
            .then(() => done())
            .catch(done);
    });
});
