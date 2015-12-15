// Canvas animation boilerplate
var Game = function () {
    'use strict';

    // Call `init`
    this.init();
};

// Method: init
Game.prototype.init = function () {
    'use strict';

    this.counter = 0;

    // Call `draw`
    this.draw();
};

// Method: update
Game.prototype.update = function () {
    'use strict';

    this.counter++;

    // Call `draw`
    this.draw();
};

// Method: draw
Game.prototype.draw = function () {
    'use strict';

    console.log(this.counter);

    // Call `update`
    window.requestAnimationFrame(this.update);
};

window.game = new Game();