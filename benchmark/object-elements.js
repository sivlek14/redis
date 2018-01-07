'use strict';

const Benchmark = require('benchmark'),
    object = {
        'test1': 'test1',
        'test2': 'test2',
        'test3': 'test3',
        'test4': 'test4',
        'test5': 'test5',
        'test6': 'test6',
        'test7': 'test7',
        'test8': 'test8',
        'test9': 'test9',
        'test10': 'test10',
    };

/*eslint-disable no-console */
(new Benchmark.Suite)
    .add('object.entries', () => {
        const values = Object.entries(object);
        for (let i = values.length - 1; i >= 0; i--) {
            values[i][0];
            values[i][1];
        }
    })
    .add('object.keys', () => {
        const keys = Object.keys(object);
        for (let i = keys.length - 1; i >= 0; i--) {
            const key = keys[i];
            object[key];
        }
    })
    .add('object for...in', () => {
        for (let key in object) {
            object[key];
        }
    })
    .on('cycle', (event) => console.log(String(event.target)))
    .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
        process.exit();
    })
    .run({'async': false});