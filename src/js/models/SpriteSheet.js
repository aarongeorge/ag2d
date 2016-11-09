/**
 * Models: Sprite Sheet
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

    // Context
    'context': {
        'type': 'any',
        'required': true
    },

    // Fps
    'fps': {
        'type': 'number',
        'default': 60
    },

    // Frame height
    'frameHeight': {
        'type': 'number',
        'required': true
    },

    // Frames
    'frames': {
        'type': 'array',
        'required': true
    },

    // Frame width
    'frameWidth': {
        'type': 'number',
        'required': true
    },

    // Frames per row
    'framesPerRow': {
        'type': 'number',
        'required': true
    },

    // Loop
    'loop': {
        'type': 'boolean',
        'default': true
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
    },

    // Sprite sheet
    'spriteSheet': {
        'type': 'custom',
        'validateFn': function (val) {
            'use strict';

            return val.nodeName === 'IMG';
        }
    },

    // X
    'x': {
        'type': 'number',
        'default': 0
    },

    // Y
    'y': {
        'type': 'number',
        'default': 0
    }
});

// Export `SpriteSheet`
module.exports = SpriteSheet;
