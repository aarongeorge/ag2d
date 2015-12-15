// Require game module
var AG2D = require('./ag2d');
var Player = require('./player.js');
var characterController = require('./characterController.js');

// Create the game
var game = AG2D(document.querySelector('canvas'), {

    // Init
    'init': function () {
        'use strict';

        this.player = new Player(this);
    },

    // Update
    'update': function () {
        'use strict';

        // Update player
        this.player.update();
    },

    // Draw
    'draw': function () {
        'use strict';

        this.context.fillStyle = 'rgb(0, 0, 0)';
        this.context.fillRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);

        // Draw player
        this.player.draw();
    },

    // Key down
    'keydown': function (key, evt) {
        'use strict';

        characterController(this.player, key, evt);
    },

    // Key up
    'keyup': function (key, evt) {
        'use strict';

        characterController(this.player, key, evt);
    }
});
