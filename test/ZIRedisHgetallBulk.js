'use strict';

describe('ZIRedis.hgetallBulk', () => {
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
        cache.hmset('key5', {
            'key1': {
                'key1.1': 'value1',
                'key1.2': 'value2',
                'key1.3': 'value3',
                'key1.4': 'value4',
                'key1.5': 'value5',
            },
        });
    });
    it('Get elements with one level', (done) => {
        cache.hgetallBulk(['key1', 'key2', 'key3', 'key4'])
            .then((values) => {
                _expect(values).to.be.eql([
                    [
                        null, {
                            key1: 'value1',
                            key2: 'value2',
                            key3: 'value3',
                            key4: 'value4',
                        },
                    ],
                    [
                        null, {
                            key1: 'value1',
                            key2: 'value2',
                        },
                    ],
                    [
                        null, {
                            key1: 'value1',
                            key2: 'value2',
                            key3: 'value3',
                            key4: 'value4',
                            key5: 'value5',
                        },
                    ],
                    [null, {}],
                ]);
                done();
            }).catch(done);
    });
    it('Get elements with two levels of objects', (done) => {
        cache.hgetallBulk(['key5'])
            .then((values) => {
                _expect(values).to.be.eql([
                    [
                        null, {
                            key1: '[object Object]',
                        },
                    ],
                ]);
                done();
            }).catch(done);
    });
    it('Rejected with type error: arrow function', (done) => {
        _expect(cache.hgetallBulk(() => {}))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: object', (done) => {
        _expect(cache.hgetallBulk({'key1': 'key1'}))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: string', (done) => {
        _expect(cache.hgetallBulk('values'))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: number', (done) => {
        _expect(cache.hgetallBulk(1000))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: boolean', (done) => {
        _expect(cache.hgetallBulk(true))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: undefined', (done) => {
        _expect(cache.hgetallBulk(undefined))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: null', (done) => {
        _expect(cache.hgetallBulk(null))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with error empty', (done) => {
        _expect(cache.hgetallBulk([]))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(101);
                _expect(err.name).to.be.equal('empty');
                done();
            });
    });
    after(() => {
        cache.del(['key1', 'key2', 'key3', 'key5']);
    });
});
