/**
 * Experience
 */

import AG2D, {
    AssetLoader,
    AudioManager,
    EventEmitter,
    EventHandler,
    KeyManager,
    SceneManager
} from './modules/ag2d/index';

// Create instance of `AG2D`
const experience = new AG2D();

// Instantiate Modules
const assetLoader = new AssetLoader();
const audioManager = new AudioManager();
const eventEmitter = new EventEmitter();
const eventHandler = new EventHandler();
const keyManager = new KeyManager();
const sceneManager = new SceneManager();

// Update
const update = (deltaTime: number = 0) => {
    sceneManager.update(deltaTime);
};

// Render
const render = () => {
    sceneManager.render();
};

// Stop
const stop = () => {
    // audioManager.suspend();
    sceneManager.pause();
};

// Start
const start = () => {
    // audioManager.resume();
    sceneManager.play();
};

/**
 * Configure experience
 */
experience.configure({
    'backgroundColor': '#000000',
    'canvas': document.querySelector('canvas')!,
    'updatesPerSecond': 60,
    'imageSmoothing': false,
    'size': {
        'height': 160,
        'width': 160
    },
    // 'size': {
    //     'height': window.innerHeight,
    //     'width': window.innerWidth
    // },
    'render': render,
    'update': update
});

// Bind the hooks
experience.hooks.bind('update', update);
experience.hooks.bind('render', render);
experience.hooks.bind('stop', stop);
experience.hooks.bind('start', start);

// Resize canvas
experience.resizeCanvas(window.innerWidth, window.innerHeight);

/**
 * Bind event listeners
 */

// Resize Listener
// window.addEventListener('resize', () => {
//     experience.resizeCanvas(window.innerWidth, window.innerHeight);
// });

// Export `experience`
export default experience;

// Export modules
export {assetLoader, audioManager, eventEmitter, eventHandler, keyManager, sceneManager};

window.sceneManager = sceneManager;
window.keyManager = keyManager;
window.experience = experience;