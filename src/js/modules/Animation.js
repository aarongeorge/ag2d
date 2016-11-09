/**
 * Animation
 *
 * @desc Animation for Animator
 */

// Constructor: Animation
var Animation = function (options) {
    'use strict';

    // Store reference to current time
    var currentTime = window.performance.now();

    this.spriteSheet = options.spriteSheet;
    this.name = options.name;
    this.fps = options.fps;
    this.interval = 1000 / options.fps;
    this.frames = options.frames;
    this.rows = options.rows;
    this.columns = options.columns;
    this.animate = false;
    this.currentFrame = 0;
    this.loop = options.loop;
    this.lastDraw = currentTime;
    this.lastUpdate = currentTime;
    this.x = options.x;
    this.y = options.y;
    this.frameWidth = options.frameWidth;
    this.frameHeight = options.frameHeight;
    this.framesPerRow = options.framesPerRow;
    this.context = options.context;
};

// Method: update
Animation.prototype.update = function (deltaTime) {
    'use strict';

    if (!this.animate) {
        return;
    }

    // Calculate delta time
    var drawDeltaTime = this.lastUpdate - this.lastDraw;

    // If `deltaTime` is higher than `interval`
    if (drawDeltaTime > this.interval) {

        // Call `nextFrame`
        this.nextFrame();

        // Update `lastDraw`
        this.lastDraw = this.lastUpdate - (drawDeltaTime % this.interval);
    }

    // Update `lastUpdate`
    this.lastUpdate += deltaTime;
};

// Method: getFrame
Animation.prototype.getFrame = function () {
    'use strict';

    // Return `currentFrame`
    return this.currentFrame;
};

// Method: nextFrame
Animation.prototype.nextFrame = function () {
    'use strict';

    // If `currentFrame` is the last frame of `frames`
    if (this.frames.indexOf(this.currentFrame) === this.frames.length - 1) {

        // If `loop` is set
        if (this.loop) {

            // Go to first frame
            this.currentFrame = 0;
        }

        // `loop` isn't set
        else {

            // Call `stop`
            this.stop();
        }
    }

    // `currentFrame` is not the last frame
    else {

        // Increment `currentFrame`
        this.currentFrame++;
    }
};

// Method: start
Animation.prototype.start = function () {
    'use strict';

    // Set `animate` to `true`
    this.animate = true;
};

// Method: stop
Animation.prototype.stop = function () {
    'use strict';

    // Set `animate` to `false`
    this.animate = false;
};

// Method: restart
Animation.prototype.restart = function () {
    'use strict';

    // Set `currentFrame` to first frame
    this.currentFrame = this.frames[0];

    // Set `animate` to `true`
    this.animate = true;
};

// Method: reset
Animation.prototype.reset = function () {
    'use strict';

    // Set `currentFrame` to first frame
    this.currentFrame = this.frames[0];
};

// Method: draw
Animation.prototype.draw = function () {
    'use strict';

    // Get `row` and `col` for `currentFrame`
    var row = Math.floor(this.frames[this.currentFrame] / this.framesPerRow);
    var col = Math.floor(this.frames[this.currentFrame] % this.framesPerRow);

    // Draw `spriteSheet`
    this.context.drawImage(this.spriteSheet, col * this.frameWidth, row * this.frameHeight, this.frameWidth, this.frameHeight, this.x, this.y, this.frameWidth, this.frameHeight);
};

// Export `Animation`
module.exports = Animation;
