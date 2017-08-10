/**
 * AG2D
 *
 * @desc A 2D game engine
 */

// Dependencies
import AnimationManager from './modules/AnimationManager';
import AssetLoader from './modules/AssetLoader';
import AudioManager from './modules/AudioManager';
import EventEmitter from './modules/EventEmitter';
import SceneManager from './modules/SceneManager';
import {noOp} from './modules/Utils';

// Class: AG2D
class AG2D {

    // Constructor
    constructor (canvas = document.createElement('CANVAS')) {

        // `canvas` param was not a canvas
        if (canvas.tagName.toLowerCase() !== 'canvas') {
            throw new Error(`${canvas} is not a canvas element`);
        }

        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.isRunning = false;
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

        // Call `setUpHooks`
        this.setUpHooks();
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
        this.fps = options.fps;
        this.interval = 1000 / this.fps;
        this.backgroundColour = options.backgroundColour || 'transparent';

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
            'update': noOp,
            'render': noOp,
            'stop': noOp,
            'start': noOp,
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

// Export `animationManager`
export const animationManager = new AnimationManager();

// Export `sssetLoader`
export const assetLoader = new AssetLoader();

// Export `audioManager`
export const audioManager = new AudioManager();

// Export `eventEmitter`
export const eventEmitter = new EventEmitter();

// Export `Scene`
export {default as Scene} from './modules/Scene';

// Export `SceneManager`
export const sceneManager = new SceneManager();
