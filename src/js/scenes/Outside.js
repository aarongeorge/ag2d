/**
 * Scene: Outside
 */

// Constructor: Outside
var Outside = function (root) {
    'use strict';

    this.context = root.context;
    this.name = 'Outside';
    this.root = root;
};

// Method: draw
Outside.prototype.draw = function () {
    'use strict';

    // Draw background
    this.context.fillStyle = '#00E9EC';
    this.context.fillRect(0, 0, this.root.options.size.width, this.root.options.size.height);

    // Draw player
    this.root.player.draw();
};

// Method: update
Outside.prototype.update = function (deltaTime) {
    'use strict';

    // Update player
    this.root.player.update(deltaTime);
};

// Method: keyUp
Outside.prototype.keyUp = function (key, evt) {
    'use strict';

    // Update player position
    this.root.player.movement(key, evt);
};

// Method: keyDown
Outside.prototype.keyDown = function (key, evt) {
    'use strict';

    // Update player position
    this.root.player.movement(key, evt);
};

// Export `Outside`
module.exports = Outside;
