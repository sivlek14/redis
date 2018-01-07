'use strict';

const newCommands = [
];

module.exports = (redis) => {
    for (let i = newCommands.length - 1; i >= 0; i--) {
        const newCommand = newCommands[i];
        redis.defineCommand(newCommand.name, newCommand.definition);
    }
};
