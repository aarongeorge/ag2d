/**
 * Game
 */

// Dependencies
var AG2D = require('./AG2D');
var SceneManager = require('./SceneManager');
var Player = require('./Player');

// Scenes
var Cave = require('../scenes/Cave');
var Outside = require('../scenes/Outside');

// Create the game
var game = AG2D(document.querySelector('canvas'), {

    // Options
    'options': {
        'backgroundColour': '#000000',
        'fps': 60,
        'size': {
            'height': 540,
            'width': 960
        }
    },

    // Init
    'init': function () {
        'use strict';

        // Resize to fullscreen
        this.resizeCanvas(window.innerWidth, window.innerHeight);

        // Create SceneManager
        this.sceneManager = new SceneManager();

        // Add the Scenes
        this.sceneManager.add(new Cave(this));
        this.sceneManager.add(new Outside(this));

        // Go to Cave
        this.sceneManager.goTo('Cave');

        // Init player
        this.player = new Player(this);
    },

    // Update
    'update': function (deltaTime) {
        'use strict';

        // Update currentScene
        this.sceneManager.update(deltaTime);
    },

    // Draw
    'draw': function () {
        'use strict';

        // Draw currentScene
        this.sceneManager.draw();
    },

    // Key down
    'keyDown': function (key, evt) {
        'use strict';

        // Send `keyDown` event to `currentScene`
        this.sceneManager.keyDown(key, evt);
    },

    // Key up
    'keyUp': function (key, evt) {
        'use strict';

        // Enter changes to next scene
        if (key === 13) {
            this.sceneManager.next();
        }

        // Send `keyUp` event to `currentScene`
        this.sceneManager.keyUp(key, evt);
    },

    // Resize
    'resize': function () {
        'use strict';

        // Resize canvas to fullscreen
        this.resizeCanvas(window.innerWidth, window.innerHeight);
    }
});
