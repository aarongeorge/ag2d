/**
 * Utils
 */

var Utils = {

    // Cyclic Array
    'cyclicArray': function (arr, index) {
        'use strict';

        var item = ((index % arr.length) + arr.length) % arr.length;

        return {
            'index': item,
            'value': arr[item]
        };
    }
};

// Export `Utils`
module.exports = Utils;
