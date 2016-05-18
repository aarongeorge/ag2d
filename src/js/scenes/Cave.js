/**
 * Scene: Cave
 */

// Constructor: Cave
var Cave = function (root) {
    'use strict';

    this.context = root.context;
    this.name = 'Cave';
    this.root = root;
};

// Method: draw
Cave.prototype.draw = function () {
    'use strict';

    // Draw background
    this.context.fillStyle = '#6F4F0A';
    this.context.fillRect(0, 0, this.root.options.size.width, this.root.options.size.height);

    // Draw player
    this.root.player.draw();
};

// Method: update
Cave.prototype.update = function (deltaTime) {
    'use strict';

    // Update player
    this.root.player.update(deltaTime);
};

// Method: keyUp
Cave.prototype.keyUp = function (key, evt) {
    'use strict';

    // Update player position
    this.root.player.movement(key, evt);
};

// Method: keyDown
Cave.prototype.keyDown = function (key, evt) {
    'use strict';

    // Update player position
    this.root.player.movement(key, evt);
};

// Export `Cave`
module.exports = Cave;
