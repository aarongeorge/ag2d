/**
 * Models: SpriteSheet
 */

// Dependencies
var PropertyValidator = require('../modules/PropertyValidator');

// Constructor: SpriteSheet
var SpriteSheet = new PropertyValidator({

    // Columns
    'columns': {
        'type': 'number',
        'default': 1
    },

    // Frame height
    'frameHeight': {
        'type': 'number',
        'required': true
    },

    // Frames per row
    'framesPerRow': {
        'type': 'number',
        'default': true
    },

    // Frame width
    'frameWidth': {
        'type': 'number',
        'required': true
    },

    // Is retina
    'isRetina': {
        'type': 'boolean',
        'default': false
    },

    // Image
    'image': {
        'type': 'custom',
        'validateFn': function (val) {
            'use strict';

            return val.nodeName === 'IMG';
        }
    },

    // Name
    'name': {
        'type': 'string',
        'required': true
    },

    // Rows
    'rows': {
        'type': 'number',
        'default': 1
    }
});

// Export `SpriteSheet`
module.exports = SpriteSheet;
