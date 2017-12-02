/**
 * AG2D
 *
 * @desc A 2D game engine
 */

// Dependencies
import {noOp} from './modules/Utils';

// Class: AG2D
class AG2D {

    // Constructor
    constructor () {

        // Set `hasInitialised`
        this.hasInitialised = false;

        // Call `setUpHooks`
        this.setUpHooks();
    }

    // Method: init
    init (canvas = document.createElement('CANVAS')) {

        // `canvas` param was not a canvas
        if (canvas.tagName.toLowerCase() !== 'canvas') {
            throw new Error(`${canvas} is not a canvas element`);
        }

        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.isRunning = false;
        this.context.imageSmoothingEnabled = true;
        this.interval = 1000 / 60;
        this.size = {
            'height': this.canvas.getBoundingClientRect().height,
            'width': this.canvas.getBoundingClientRect().width
        };
        this.bounds = {
            'height': this.canvas.getBoundingClientRect().height,
            'width': this.canvas.getBoundingClientRect().width
        };

        // Call `resizeCanvas`
        this.resizeCanvas(this.bounds.width, this.bounds.height);

        // Set `hasInitialised`
        this.hasInitialised = true;
    }

    // Method: clearCanvas
    clearCanvas () {

        // Clear canvas
        this.context.clearRect(0, 0, this.size.width, this.size.height);

        // If `this.backgroundColour` is not `transparent`
        if (this.backgroundColour !== 'transparent') {

            // Set backgroundColour
            this.context.fillStyle = this.backgroundColour;
            this.context.fillRect(0, 0, this.size.width, this.size.height);
        }
    }

    // Method: configure
    configure (options) {

        if (!this.hasInitialised) {
            this.init(options.canvas);
        }

        this.fps = options.fps;
        this.interval = 1000 / this.fps;
        this.backgroundColour = options.backgroundColour || 'transparent';
        this.imageSmoothing = typeof options.imageSmoothing === 'boolean' ? options.imageSmoothing : true;

        // Check if `size` was passed
        if (options.size) {
            this.size = {
                'height': options.size.height,
                'width': options.size.width
            };
            this.bounds = {
                'height': options.size.height,
                'width': options.size.width
            };

            // Call `resizeCanvas`
            this.resizeCanvas(this.bounds.width, this.bounds.height);
        }
    }

    // Method: render
    render () {

        // Save `context`
        this.context.save();

        // Set imageSmoothing each render (see: https://bugs.chromium.org/p/chromium/issues/detail?id=791270)
        this.context.imageSmoothingEnabled = this.imageSmoothing;

        // Scale `context` by `devicePixelRatio`
        this.context.scale(window.devicePixelRatio * this.ratio, window.devicePixelRatio * this.ratio);

        // Call `clearCanvas`
        this.clearCanvas();

        // Call `render` on `hooks`
        this.hooks.render();

        // Restore `context`
        this.context.restore();

        // Update `lastRender`
        this.lastRender = window.performance.now();
    }

    // Method: renderLoop
    renderLoop () {

        // Render only if `isRunning`
        if (this.isRunning) {

            // Call `renderLoop` on next tick
            window.requestAnimationFrame(this.renderLoop.bind(this));
        }

        // Store reference to current time
        const timeNow = window.performance.now();

        // Calculate delta times
        const updateDeltaTime = timeNow - this.lastUpdate;
        const renderDeltaTime = timeNow - this.lastRender;

        // Call `update` and pass `updateDeltaTime`
        this.update(updateDeltaTime);

        // If `deltaTime` is higher than `interval`
        if (renderDeltaTime > this.interval) {

            // Call `render`
            this.render();
        }
    }

    // Method: setUpHooks
    setUpHooks () {
        this.hooks = {
            'render': noOp,
            'start': noOp,
            'stop': noOp,
            'update': noOp,
            'bind': (name, func) => {
                this.hooks[name] = func;
            },
            'unbind': (name) => {
                delete this.hooks[name];
            }
        };
    }

    // Method: start
    start () {

        // Set `isRunning` to `true`
        this.isRunning = true;

        // Set `lastUpdate` and `lastRender`
        const now = window.performance.now();

        this.lastUpdate = now;
        this.lastRender = now;

        // Call `start` on `hooks`
        this.hooks.start();

        // Call `renderLoop`
        this.renderLoop();
    }

    // Method: stop
    stop () {

        // Set `isRunning` to `false`
        this.isRunning = false;

        // Call `stop` on `hooks`
        this.hooks.stop();
    }

    // Method: update
    update (deltaTime) {

        // Call `update` on `hooks`
        this.hooks.update(deltaTime);

        // Update `lastUpdate`
        this.lastUpdate = window.performance.now();
    }

    // Method: resizeCanvas
    resizeCanvas (width, height) {

        // Calculate the ratios
        const ratio = this.size.width / this.size.height;
        const destRatio = width / height;

        let destWidth = width;
        let destHeight = height;

        // `destRatio` is larger than `ratio`
        if (destRatio > ratio) {

            // Crop width
            destWidth = Math.floor(height * ratio);
        }

        // `destRatio` is smaller than `ratio`
        else {

            // Crop height
            destHeight = Math.floor(width / ratio);
        }

        // Update `bounds`
        this.bounds = {
            'height': destHeight,
            'width': destWidth
        };

        // Update `ratio`
        this.ratio = destWidth / this.size.width;

        // Set attributes `height` and `width`
        this.canvas.setAttribute('height', Math.round(destHeight * window.devicePixelRatio));
        this.canvas.setAttribute('width', Math.round(destWidth * window.devicePixelRatio));

        // Set styles `height` and `width`
        this.canvas.style.height = `${destHeight}px`;
        this.canvas.style.width = `${destWidth}px`;
    }
}

// Export `AG2D`
export default AG2D;

// Export modules
export {default as AnimationManager} from './modules/AnimationManager';
export {default as Animation} from './modules/Animation';
export {default as AssetLoader} from './modules/AssetLoader';
export {default as AudioManager} from './modules/AudioManager';
export {default as EventEmitter} from './modules/EventEmitter';
export {default as EventHandler} from './modules/EventHandler';
export {default as KeyManager} from './modules/KeyManager';
export {default as SceneManager} from './modules/SceneManager';
export {default as Scene} from './modules/Scene';
export {default as SpriteSheet} from './modules/SpriteSheet';
