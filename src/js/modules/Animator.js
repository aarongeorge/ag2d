/**
 * Animator
 *
 * @desc An animation manager
 */

// Dependencies
var AnimationModel = require('../models/Animation');
var SpriteSheetModel = require('../models/SpriteSheet');
var Animation = require('./Animation');
var SpriteSheet = require('./SpriteSheet');

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
    this.spriteSheets = {};
};

// Method: createAnimation
Animator.prototype.createAnimation = function (options) {
    'use strict';

    // Return new animation
    return new Animation(new AnimationModel(options));
};

// Method: addAnimation
Animator.prototype.addAnimation = function (animation) {
    'use strict';

    // Add `name` to `animations`
    this.animations[animation.name] = animation;
};

// Method: removeAnimation
Animator.prototype.removeAnimation = function (name) {
    'use strict';

    // Remove `name` from `animations`
    delete this.animations[name];
};

// Method: removeAnimations
Animator.prototype.removeAnimations = function () {
    'use strict';

    // Store reference to `animations` keys
    var animationKeys = Object.keys(this.animations);

    // Iterate over `animations`
    for (var i = animationKeys.length - 1; i >= 0; i--) {

        // Remove `animation`
        this.removeAnimation(this.animations[animationKeys[i]].name);
    }
};

// Method: cloneAnimation
Animator.prototype.cloneAnimation = function (animation, name) {
    'use strict';

    // Clone `animation` and give it a name of `name`
    this.animations[name] = Object.assign(Object.create(animation), animation);
};

// Method: createSpriteSheet
Animator.prototype.createSpriteSheet = function (options) {
    'use strict';

    // Return new sprite sheet
    return new SpriteSheet(new SpriteSheetModel(options));
};

// Method: addSpriteSheet
Animator.prototype.addSpriteSheet = function (spriteSheet) {
    'use strict';

    // Add `name` to `spriteSheets`
    this.spriteSheets[spriteSheet.name] = spriteSheet;
};

// Method: removeAnimation
Animator.prototype.removeSpriteSheet = function (name) {
    'use strict';

    // Remove `name` from `spriteSheets`
    delete this.spriteSheets[name];
};

// Method: update
Animator.prototype.update = function (deltaTime) {
    'use strict';

    // Store reference to `animations` keys
    var animationKeys = Object.keys(this.animations);

    // Iterate over `animations`
    for (var i = 0; i < animationKeys.length; i++) {

        // Call `update` on `animations`
        this.animations[animationKeys[i]].update(deltaTime);
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
Animator.prototype.drawAnimation = function (name, x, y, width, height, cropWidth, cropHeight) {
    'use strict';

    // Call `draw` on `name`
    this.animations[name].draw(x, y, width, height, cropWidth, cropHeight);
};

// Export `Animator`
module.exports = Animator;
