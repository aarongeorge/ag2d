/**
 * Utils
 */

var Utils = {

    // Cyclic Array
    'cyclicArray': function (arr, index) {
        'use strict';

        var item = ((index % arr.length) + arr.length) % arr.length;

        return [arr[item], item];
    },

    // Random Float Inclusive
    'randomFloatInclusive': function (min, max) {
        'use strict';

        return Math.random() * (max - min) + min;
    },

    // Random Integer Inclusive
    'randomIntegerInclusive': function (min, max) {
        'use strict';

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

// Export `Utils`
module.exports = Utils;
