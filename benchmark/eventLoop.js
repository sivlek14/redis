'use strict';

const EventEmitter = require('events'),
    reader = new require('ioredis')({
        connectionName: 'opta-reader',
        host: 'localhost',
        port: 6379,
        db: 0,
        dropBufferSupport: true,
        enableReadyCheck: true,
        readOnly: true,
    });

class Client extends EventEmitter {

    eventTest(index, done) {
        this.emit('event', {index, done});
    }
}

const anotherCallbackFunction = (index, cb) => {
    console.log(`test ${index} -- 4`);
    (() => {
        console.log(`test ${index} -- 5`);
        cb();
    })();
};

const callbackFunction = (index, cb) => {
    console.log(`test ${index} -- 2`);
    (() => {
        setTimeout(() => {
            console.log(`test ${index} -- 3`);
            anotherCallbackFunction(index, cb);
        }, 10);
    })();
};

// const anotherCallbackFunction = (index, cb) => {
//     console.log(`test ${index} -- 4`);
//     reader.get(`${index}`, () => {
//         console.log(`test ${index} -- 5`);
//         cb();
//     });
// };

// const callbackFunction = (index, cb) => {
//     console.log(`test ${index} -- 2`);
//     reader.get(`${index}`, () => {
//         console.log(`test ${index} -- 3`);
//         anotherCallbackFunction(index, cb);
//     });
// };

const client = new Client();

// client.on('event', (index) => {
//     console.log(`test ${index} -- 1`);
//     callbackFunction(index, () => {
//         console.log(`test ${index} -- 6`);
//     });
// });


// for (let i = 0; i < 20; i++) {
//     client.eventTest(i);
// }

client.on('event', ({index, done}) => {
    console.log(`test ${index} -- 1`);
    callbackFunction(index, () => {
        console.log(`test ${index} -- 6`);
        done(null);
    });
});

const each = require('async/each'),
    listEvents = [];

for (let i = 0; i < 1000000; i++) {
    // if (listEvents.length == 0)
        listEvents.push(i);
    // else
    //     listEvents.push((previus, done) => client.eventTest(i, done));
}


each(listEvents, (i, done) => client.eventTest(i, done), (err, result) => {
    console.log(err);
    console.log(result);
    console.log('end all events');
    process.exit();
});