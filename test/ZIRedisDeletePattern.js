'use strict';

describe('ZIRedis.deletePattern', () => {
    let cache = new _ZIRedis({port: 6379, host: '127.0.0.1'});
    before(() => {
        cache.set('qwerty', 'test');
        cache.set('test1', 'test');
        cache.set('test2', 'test');
        cache.set('test3', 'test');
        cache.set('test4', 'test');
    });
    it('With pattern: Found', (done) => {
        cache.deletePattern('test*').then((value) => {
            _expect(value).to.be.equal(4);
            done();
        }).catch(done);
    });
    it('With pattern: Not found', (done) => {
        cache.deletePattern('test*').then((value) => {
            _expect(value).to.be.equal(0);
            done();
        }).catch(done);
    });
    it('Without pattern: Found', (done) => {
        cache.deletePattern('qwerty').then((value) => {
            _expect(value).to.be.equal(1);
            done();
        }).catch(done);
    });
    it('Without pattern: Not found', (done) => {
        cache.deletePattern('qwerty').then((value) => {
            _expect(value).to.be.equal(0);
            done();
        }).catch(done);
    });
    it('Rejected with type error: empty string', (done) => {
        _expect(cache.deletePattern(''))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(101);
                _expect(err.name).to.be.equal('empty');
                done();
            });
    });
    it('Rejected with type error: arrow function', (done) => {
        _expect(cache.deletePattern(() => {}))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: array', (done) => {
        _expect(cache.deletePattern([]))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: object', (done) => {
        _expect(cache.deletePattern({}))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: number', (done) => {
        _expect(cache.deletePattern(1000))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: boolean', (done) => {
        _expect(cache.deletePattern(true))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: undefined', (done) => {
        _expect(cache.deletePattern(undefined))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: null', (done) => {
        _expect(cache.deletePattern(null))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
});
