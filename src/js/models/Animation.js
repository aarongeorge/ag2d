/**
 * Models: Animation
 */

// Dependencies
var PropertyValidator = require('../modules/PropertyValidator');

// Constructor: Animation
var Animation = new PropertyValidator({

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

    // Frames
    'frames': {
        'type': 'array',
        'required': true
    },

    // Loop
    'loop': {
        'type': 'boolean',
        'default': true
    },

    // Loop Type
    'loopType': {
        'type': 'string',
        'default': 'normal',
        'validateFn': function (val) {
            'use strict';

            if (val === 'normal' || val === 'wrap') {
                return true;
            }

            else {
                return false;
            }
        }
    },

    // Name
    'name': {
        'type': 'string',
        'required': true
    },

    // Reset Callback
    'resetCb': {
        'type': 'function',
        'default': function () {}
    },

    // Restart Callback
    'restartCb': {
        'type': 'function',
        'default': function () {}
    },

    // Reverse
    'reverse': {
        'type': 'boolean',
        'default': false
    },

    // Sprite sheet
    'spriteSheet': {
        'type': 'object',
        'required': true
    },

    // Start Callback
    'startCb': {
        'type': 'function',
        'default': function () {}
    },

    // Stop Callback
    'stopCb': {
        'type': 'function',
        'default': function () {}
    }
});

// Export `Animation`
module.exports = Animation;
