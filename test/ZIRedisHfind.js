'use strict';

describe('ZIRedis.hfind', () => {
    let cache = new _ZIRedis({port: 6379, host: '127.0.0.1'});
    before(() => {
        cache.hmset('key1', {
            'key1': 'value1',
            'key2': 'value2',
            'key3': 'value3',
            'key4': 'value4',
        });
        cache.hmset('key2', {
            'key1': 'value1',
            'key2': 'value2',
        });
        cache.hmset('key3', {
            'key1': 'value1',
            'key2': 'value2',
            'key3': 'value3',
            'key4': 'value4',
            'key5': 'value5',
        });
    });
    it('With pattern: found', (done) => {
        cache.hfind('key*')
            .then((results) => {
                _expect(results).to.be.eql({
                    key1: {
                        key1: 'value1',
                        key2: 'value2',
                        key3: 'value3',
                        key4: 'value4',
                    },
                    key2: {
                        key1: 'value1',
                        key2: 'value2',
                    },
                    key3: {
                        key1: 'value1',
                        key2: 'value2',
                        key3: 'value3',
                        key4: 'value4',
                        key5: 'value5',
                    },
                });
                done();
            }).catch(done);
    });
    it('With pattern: not found', (done) => {
        cache.hfind('notFound*')
            .then((results) => {
                _expect(results).to.be.eql(null);
                done();
            }).catch(done);
    });
    it('Without pattern: found', (done) => {
        cache.hfind('key1')
            .then((results) => {
                _expect(results).to.be.eql({
                    key1: {
                        key1: 'value1',
                        key2: 'value2',
                        key3: 'value3',
                        key4: 'value4',
                    },
                });
                done();
            }).catch(done);
    });
    it('Without pattern: not found', (done) => {
        cache.hfind('key5')
            .then((results) => {
                _expect(results).to.be.eql(null);
                done();
            }).catch(done);
    });
    it('Rejected with type error: empty string', (done) => {
        _expect(cache.hfind(''))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(101);
                _expect(err.name).to.be.equal('empty');
                done();
            }).catch(done);
    });
    it('Rejected with type error: arrow function', (done) => {
        _expect(cache.hfind(() => {}))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            }).catch(done);
    });
    it('Rejected with type error: array', (done) => {
        _expect(cache.hfind([]))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            }).catch(done);
    });
    it('Rejected with type error: object', (done) => {
        _expect(cache.hfind({}))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            }).catch(done);
    });
    it('Rejected with type error: number', (done) => {
        _expect(cache.hfind(1000))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            }).catch(done);
    });
    it('Rejected with type error: boolean', (done) => {
        _expect(cache.hfind(false))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            }).catch(done);
    });
    it('Rejected with type error: undefined', (done) => {
        _expect(cache.hfind(undefined))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            }).catch(done);
    });
    it('Rejected with type error: null', (done) => {
        _expect(cache.hfind(null))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            }).catch(done);
    });
    after(() => {
        cache.del(['key1', 'key2', 'key3']);
    });
});
