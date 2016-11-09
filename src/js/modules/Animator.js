/**
 * Animator
 *
 * @desc An animation manager
 */

// Dependencies
var Animation = require('./Animation');

// Constructor: Animator
var Animator = function () {
    'use strict';

    // Call `init`
    this.init();
};

// Method: init
Animator.prototype.init = function () {
    'use strict';

    this.animations = {};
    this.animationNames = [];
    this.spriteSheets = {};
    this.spriteSheetNames = [];
};

// Method: addAnimation
Animator.prototype.addAnimation = function (options) {
    'use strict';

    // Create `animation`
    var animation = new Animation(options);

    // Add `name` to `animations`
    this.animations[animation.name] = animation;

    // Update `animationNames`
    this.animationNames = Object.keys(this.animations);
};

// Method: removeAnimation
Animator.prototype.removeAnimation = function (name) {
    'use strict';

    // Remove `name` from `animations`
    delete this.animations[name];

    // Update `animationNames`
    this.animationNames = Object.keys(this.animations);
};

// Method: addSpriteSheet
Animator.prototype.addSpriteSheet = function (spriteSheet) {
    'use strict';

    // Add `name` to `spriteSheets`
    this.spriteSheets[spriteSheet.name] = spriteSheet;

    // Update `spriteSheetNames`
    this.spriteSheetNames = Object.keys(this.spriteSheets);
};

// Method: removeAnimation
Animator.prototype.removeSpriteSheet = function (name) {
    'use strict';

    // Remove `name` from `spriteSheets`
    delete this.spriteSheets[name];

    // Update `spriteSheetNames`
    this.spriteSheetNames = Object.keys(this.spriteSheets);
};

// Method: update
Animator.prototype.update = function (deltaTime) {
    'use strict';

    // Iterate over all animationNames
    for (var i = 0; i < this.animationNames.length; i++) {

        // Call `update` on animation
        this.animations[this.animationNames[i]].update(deltaTime);
    }
};

// Method: startAnimation
Animator.prototype.startAnimation = function (name) {
    'use strict';

    // Call `start` on `name`
    this.animations[name].start();
};

// Method: stopAnimation
Animator.prototype.stopAnimation = function (name) {
    'use strict';

    // Call `stop` on `name`
    this.animations[name].stop();
};

// Method: restartAnimation
Animator.prototype.restartAnimation = function (name) {
    'use strict';

    // Call `restart` on `name`
    this.animations[name].restart();
};

// Method: resetAnimation
Animator.prototype.resetAnimation = function (name) {
    'use strict';

    // Call `reset` on `name`
    this.animations[name].reset();
};

// Method: drawAnimation
Animator.prototype.drawAnimation = function (name) {
    'use strict';

    // Call `draw` on `name`
    this.animations[name].draw();
};

// Export `Animator`
module.exports = Animator;
