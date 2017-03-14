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

    // Set options
    this.context = options.context;
    this.fps = options.fps;
    this.frames = options.frames;
    this.loop = options.loop;
    this.loopType = options.loopType;
    this.name = options.name;
    this.resetCb = options.resetCb;
    this.restartCb = options.restartCb;
    this.reverse = options.reverse;
    this.spriteSheet = options.spriteSheet;
    this.startCb = options.startCb;
    this.stopCb = options.stopCb;

    // Set defaults
    this.animate = false;
    this.currentFrame = 0;
    this.interval = 1000 / options.fps;
    this.lastDraw = currentTime;
    this.lastUpdate = currentTime;
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

    // `currentFrame` is `endFrame`
    if (this.frames.indexOf(this.currentFrame) === this.getEndFrame()) {

        // If `loop` is set
        if (this.loop) {

            // `loopType` is `wrap`
            if (this.loopType === 'wrap') {

                // Flip `reverse`
                this.reverse = !this.reverse;
            }

            // Call `reset`
            this.reset();
        }

        // `loop` isn't set
        else {

            // Call `stop`
            this.stop();
        }
    }

    // `currentFrame` is not `endFrame`
    else {

        // Increment/Decrement `currentFrame`
        this.currentFrame = this.reverse ? this.currentFrame - 1 : this.currentFrame + 1;
    }
};

// Method: start
Animation.prototype.start = function () {
    'use strict';

    // Set `animate` to `true`
    this.animate = true;

    // Call `startCb`
    this.startCb();
};

// Method: stop
Animation.prototype.stop = function () {
    'use strict';

    // Set `animate` to `false`
    this.animate = false;

    // Call `stopCb`
    this.stopCb();
};

// Method: restart
Animation.prototype.restart = function () {
    'use strict';

    // Set `currentFrame` to start frame
    this.currentFrame = this.getStartFrame();

    // Set `animate` to `true`
    this.animate = true;

    // Call `restartCb`
    this.restartCb();
};

// Method: reset
Animation.prototype.reset = function () {
    'use strict';

    // Set `currentFrame` to start frame
    this.currentFrame = this.getStartFrame();

    // Call `resetCb`
    this.resetCb();
};

// Method: getStartFrame
Animation.prototype.getStartFrame = function () {
    'use strict';

    // If `reverse` return the last item in `frames` else return the first item in `frames`
    return this.reverse ? this.frames[this.frames.length - 1] : this.frames[0];
};

// Method: getEndFrame
Animation.prototype.getEndFrame = function () {
    'use strict';

    // If `reverse` return the first item in `frames` else return the last item in `frames`
    return this.reverse ? this.frames[0] : this.frames[this.frames.length - 1];
};

// Method: draw
Animation.prototype.draw = function (x, y, width, height, cropWidth, cropHeight) {
    'use strict';

    cropWidth = typeof cropWidth === 'undefined' ? this.spriteSheet.frameWidth : cropWidth;
    cropHeight = typeof cropHeight === 'undefined' ? this.spriteSheet.frameHeight : cropHeight;

    // Get `row` and `col` for `currentFrame`
    var row = Math.floor(this.frames[this.currentFrame] / this.spriteSheet.columns);
    var col = Math.floor(this.frames[this.currentFrame] % this.spriteSheet.columns);

    // Draw `spriteSheet`
    this.context.drawImage(this.spriteSheet.image, col * this.spriteSheet.frameWidth, row * this.spriteSheet.frameHeight, cropWidth * (this.spriteSheet.isRetina ? window.devicePixelRatio : 1), cropHeight * (this.spriteSheet.isRetina ? window.devicePixelRatio : 1), x, y, cropWidth, cropHeight);
};

// Export `Animation`
module.exports = Animation;
