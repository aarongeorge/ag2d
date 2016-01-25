// Require game module
var AG2D = require('./AG2D');
var Player = require('./player.js');

// Create the game
var game = AG2D(document.querySelector('canvas'), {

    // Options
    'options': {
        'backgroundColour': '#000000',
        'fps': 60,
        'size': {
            'height': window.innerHeight,
            'width': window.innerWidth
        }
    },

    // Init
    'init': function () {
        'use strict';

        // Init player
        this.player = new Player(this);
    },

    // Update
    'update': function (deltaTime) {
        'use strict';

        // Update player
        this.player.update(deltaTime);
    },

    // Draw
    'draw': function () {
        'use strict';

        // Draw black background
        this.context.fillStyle = 'rgb(0, 0, 0)';
        this.context.fillRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);

        // Draw player
        this.player.draw();
    },

    // Key down
    'keydown': function (key, evt) {
        'use strict';

        // Call `characterController`
        this.player.movement(key, evt);
    },

    // Key up
    'keyup': function (key, evt) {
        'use strict';

        // Call `characterController`
        this.player.movement(key, evt);
    },

    // Resize
    'resize': function (e) {
        'use strict';

        // Resize canvas to fullscreen
        this.resizeCanvas(window.innerWidth, window.innerHeight);
    }
});
