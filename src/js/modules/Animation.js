/**
 * Animation
 *
 * @desc Animation for AnimatorManager
 */

// Class: Animation
const Animation = class {

    // Constructor
    constructor (options) {

        // Store reference to current time
        const currentTime = window.performance.now();

        // Set options
        this.fps = options.fps;
        this.frames = options.frames;
        this.loop = options.loop;
        this.loopType = options.loopType;
        this.name = options.name;
        this.pauseCb = options.pauseCb;
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
    }

    // Method: update
    update (deltaTime) {

        if (!this.animate) {
            return;
        }

        // Calculate delta time
        const drawDeltaTime = this.lastUpdate - this.lastDraw;

        // If `deltaTime` is higher than `interval`
        if (drawDeltaTime > this.interval) {

            // Call `nextFrame`
            this.nextFrame();

            // Update `lastDraw`
            this.lastDraw = this.lastUpdate - drawDeltaTime % this.interval;
        }

        // Update `lastUpdate`
        this.lastUpdate += deltaTime;
    }

    // Method: getFrame
    getFrame () {

        // Return `currentFrame`
        return this.currentFrame;
    }

    // Method: nextFrame
    nextFrame () {

        // `currentFrame` is `endFrame`
        if (this.frames.indexOf(this.currentFrame) === this.getEndFrame()) {

            // If `loop` is set
            if (this.loop) {

                // `loopType` is `wrap`
                if (this.loopType === 'wrap') {

                    // Flip `reverse`
                    this.reverse = !this.reverse;
                }

                // Call `restart`
                this.restart();
            }

            // `loop` isn't set
            else {

                // Call `stop`
                this.stop();
            }
        }

        // `currentFrame` is not `endFrame`
        else {

            // Set `currentFrame` based on `reverse`
            this.currentFrame = this.reverse ? this.currentFrame - 1 : this.currentFrame + 1;
        }
    }

    // Method: start
    start () {

        // Set `animate` to `true`
        this.animate = true;

        // Call `startCb`
        this.startCb();
    }

    // Method: pause
    pause () {

        // Set `animate` to `false`
        this.animate = false;

        // Call `pauseCb`
        this.pauseCb();
    }

    // Method: stop
    stop () {

        // Set `currentFrame` to start frame
        this.currentFrame = this.getStartFrame();

        // Set `animate` to `false`
        this.animate = false;

        // Call `stopCb`
        this.stopCb();
    }

    // Method: restart
    restart () {

        // Set `currentFrame` to start frame
        this.currentFrame = this.getStartFrame();

        // Set `animate` to `true`
        this.animate = true;

        // Call `restartCb`
        this.restartCb();
    }

    // Method: reset
    reset () {

        // Set `currentFrame` to start frame
        this.currentFrame = this.getStartFrame();

        // Set `animate` to `false`
        this.animate = false;

        // Call `resetCb`
        this.resetCb();
    }

    // Method: getStartFrame
    getStartFrame () {

        // If `reverse` return the last item in `frames` else return the first item in `frames`
        return this.reverse ? this.frames[this.frames.length - 1] : this.frames[0];
    }

    // Method: getEndFrame
    getEndFrame () {

        // If `reverse` return the first item in `frames` else return the last item in `frames`
        return this.reverse ? this.frames[0] : this.frames[this.frames.length - 1];
    }

    // Method: render
    render (context, x, y, width, height, cropWidth = this.spriteSheet.frameWidth, cropHeight = this.spriteSheet.frameHeight) {

        // Get `row` and `col` for `currentFrame`
        const row = Math.floor(this.frames[this.currentFrame] / this.spriteSheet.columns);
        const col = Math.floor(this.frames[this.currentFrame] % this.spriteSheet.columns);

        // Draw `spriteSheet`
        context.drawImage(this.spriteSheet.image, col * this.spriteSheet.frameWidth, row * this.spriteSheet.frameHeight, cropWidth, cropHeight, x, y, cropWidth, cropHeight);
    }
};

// Export `Animation`
export default Animation;
