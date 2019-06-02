/**
 * AG2D
 *
 * @desc A 2D game engine
 */

// Dependencies
import {noOp} from './modules/Utils';
import GameLoop from './modules/GameLoop';

interface Hooks {
    bind: (name: 'update' | 'render' | 'start' | 'stop', func: () => any) => void,
    render: () => any,
    start: () => any,
    stop: () => any,
    unbind: (name: 'update' | 'render' | 'start' | 'stop') => void,
    update: (deltaTime: number) => any
}

interface Constraints {
    height: number;
    width: number;
}

interface Options {
    autoClear?: boolean,
    backgroundColor?: string,
    canvas?: HTMLCanvasElement,
    imageSmoothing?: boolean,
    size?: {
        height: number,
        width: number
    },
    updatesPerSecond: number,
    render: () => void,
    update: (deltaTime: number) => void
}

// Class: AG2D
export default class AG2D {
    autoClear: boolean = true;
    backgroundColor: string = 'transparent';
    bounds: Constraints = {
        height: 150,
        width: 300
    };
    canvas: HTMLCanvasElement = document.createElement('canvas');
    context: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
    gameLoop: GameLoop;
    hasInitialised: boolean;
    hooks: Hooks = {
        'bind': (name, func) => {
            if (typeof this.hooks[name] === 'undefined' || this.hooks[name] === noOp) {
                this.hooks[name] = func;
            }
            else {
                throw new Error(`Hook with a name of \`${name}\` already exists`);
            }
        },
        'render': noOp,
        'start': noOp,
        'stop': noOp,
        'unbind': name => {
            delete this.hooks[name];
        },
        'update': noOp
    };
    imageSmoothing: boolean = false;
    isRunning: boolean = false;
    ratio: number = 1;
    size: Constraints = {
        height: 150,
        width: 300
    };

    // Constructor
    constructor () {

        // Set `hasInitialised`
        this.hasInitialised = false;

        // Set default for autoClear
        this.autoClear = true;

        // Call `setUpHooks`
        this.setUpHooks();
    }

    // Method: init
    init (canvas: HTMLCanvasElement = document.createElement('canvas')) {
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error(`Couldn't create a context for ${canvas}`);
        }

        this.canvas = canvas;
        this.isRunning = false;
        this.context = context;
        this.context.imageSmoothingEnabled = true;
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

        // If `backgroundColor` is not `transparent`
        if (this.backgroundColor !== 'transparent') {

            // Set `backgroundColor`
            this.context.fillStyle = this.backgroundColor;
            this.context.fillRect(0, 0, this.size.width, this.size.height);
        }
    }

    // Method: configure
    configure (options: Options) {

        if (!this.hasInitialised) {
            this.init(options.canvas);
        }

        // Create `GameLoop`
        this.gameLoop = new GameLoop({
            'updatesPerSecond': options.updatesPerSecond,
            'render': () => {
                this.render();
            },
            'update': (deltaTime) => {
                this.update(deltaTime);
            }
        });

        this.backgroundColor = options.backgroundColor || 'transparent';
        this.imageSmoothing = typeof options.imageSmoothing === 'boolean' ? options.imageSmoothing : true;
        this.autoClear = options.autoClear === undefined ? this.autoClear : options.autoClear;

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
        if (this.autoClear) {
            this.clearCanvas();
        }

        // Call `hooks.render`
        this.hooks.render();

        // Restore `context`
        this.context.restore();
    }

    // Method: setUpHooks
    setUpHooks () {
        this.hooks = {
            'bind': (name, func) => {
                if (typeof this.hooks[name] === 'undefined' || this.hooks[name] === noOp) {
                    this.hooks[name] = func;
                }
                else {
                    throw new Error(`Hook with a name of \`${name}\` already exists`);
                }
            },
            'render': noOp,
            'start': noOp,
            'stop': noOp,
            'unbind': name => {
                delete this.hooks[name];
            },
            'update': noOp
        };
    }

    // Method: start
    start () {

        // Set `isRunning` to `true`
        this.isRunning = true;

        // Call `hooks.start`
        this.hooks.start();

        // Call `gameLoop`
        this.gameLoop.start();
    }

    // Method: stop
    stop () {

        // Set `isRunning` to `false`
        this.isRunning = false;

        // Call `hooks.stop`
        this.hooks.stop();
    }

    // Method: update
    update (deltaTime: number) {

        // Call `hooks.update`
        this.hooks.update(deltaTime);
    }

    // Method: resizeCanvas
    resizeCanvas (width: number, height: number) {

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
        this.canvas.setAttribute('height', Math.round(destHeight * window.devicePixelRatio).toString());
        this.canvas.setAttribute('width', Math.round(destWidth * window.devicePixelRatio).toString());

        // Set styles `height` and `width`
        this.canvas.style.height = `${destHeight}px`;
        this.canvas.style.width = `${destWidth}px`;

        // Set imageSmoothing (see: https://bugs.chromium.org/p/chromium/issues/detail?id=791270)
        this.context.imageSmoothingEnabled = this.imageSmoothing;
    }
}

// Export modules
export {default as Animation} from './modules/Animation';
export {default as AnimationManager} from './modules/AnimationManager';
export {default as AssetLoader} from './modules/AssetLoader';
export {default as AudioManager} from './modules/AudioManager';
export {default as Entity} from './modules/Entity';
export {default as EventEmitter} from './modules/EventEmitter';
export {default as EventHandler} from './modules/EventHandler';
export {default as GameLoop} from './modules/GameLoop';
export {default as KeyManager} from './modules/KeyManager';
export {default as QuadTree} from './modules/QuadTree';
export {default as Scene} from './modules/Scene';
export {default as SceneManager} from './modules/SceneManager';
export {default as SpriteSheet} from './modules/SpriteSheet';
export {default as TileCollider} from './modules/TileCollider';
export {default as Trait} from './modules/Trait';
export {Matrix, Vec2, Rect, Point} from './modules/Math';
