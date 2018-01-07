'use strict';

describe('ZIRedis.hmsetBulk', () => {
    let cache = new _ZIRedis({port: 6379, host: '127.0.0.1'});
    it('Set elements', (done) => {
        cache.hmsetBulk({
            'key1': {
                'key1': 'value1',
                'key2': 'value2',
                'key3': 'value3',
                'key4': 'value4',
            },
            'key2': {
                'key1': 'value1',
                'key2': 'value2',
            },
            'key3': {
                'key1': 'value1',
                'key2': 'value2',
                'key3': 'value3',
                'key4': 'value4',
                'key5': 'value5',
            },
        })
            .then((results) => {
                _expect(results).to.be.an('array');
                _expect(results).to.have.lengthOf(3);
                _expect(results).eql([
                    [null, 'OK'],
                    [null, 'OK'],
                    [null, 'OK'],
                ]);
                done();
            })
            .catch(done);
    });
    it('Set elements: one element with an array(error) and another with a object', (done) => {
        cache.hmsetBulk({
            'key1': [],
            'key2': {
                'key1': 'value1',
                'key2': 'value2',
            },
        })
            .then((results) => {
                _expect(results[0][0].name)
                    .to.be.equal('ReplyError');
                _expect(results[0][0].message)
                    .to.be.equal('ERR wrong number of arguments for \'hmset\' command');
                _expect(results[0][0].command.name)
                    .to.be.equal('hmset');
                _expect(results[0][0].command.args[0])
                    .to.be.equal('key1');
                _expect(results[1])
                    .eql([null, 'OK']);
                done();
            })
            .catch(done);
    });
    it('Rejected with type error: arrow function', (done) => {
        _expect(cache.hmsetBulk(() => {}))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: array', (done) => {
        _expect(cache.hmsetBulk(['key1', 'key2']))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: string', (done) => {
        _expect(cache.hmsetBulk('values'))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: number', (done) => {
        _expect(cache.hmsetBulk(1000))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: boolean', (done) => {
        _expect(cache.hmsetBulk(true))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: undefined', (done) => {
        _expect(cache.hmsetBulk(undefined))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with type error: null', (done) => {
        _expect(cache.hmsetBulk(null))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(100);
                _expect(err.name).to.be.equal('type');
                done();
            });
    });
    it('Rejected with error empty', (done) => {
        _expect(cache.hmsetBulk({}))
            .to.be.rejected
            .then((err) => {
                _expect(err.code).to.be.equal(101);
                _expect(err.name).to.be.equal('empty');
                done();
            });
    });
    after(() => {
        cache.del(['key1', 'key2', 'key3']);
    });
});
