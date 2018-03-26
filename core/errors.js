'use strict';

const NError = require('@zerointermittency/error');

class RedisError extends NError {
    constructor(opts) {
        opts.prefix = 'zi-redis';
        super(opts);
    }
}

module.exports = {
    type: (varName, type, extra) => new RedisError({
        code: 100,
        name: 'type',
        message: `"${varName}" must be "${type}"`,
        level: NError.level.fatal,
        extra: extra,
    }),
    empty: (varName, extra) => new RedisError({
        code: 101,
        name: 'empty',
        message: `Empty var ${varName}`,
        level: NError.level.fatal,
        extra: extra,
    }),
};
