'use strict';

const debug = require('debug');

module.exports = name => debug(`zi-redis:${name}`);
