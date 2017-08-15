/**
 * Experience
 */

// Dependencies
import AG2D, {animationManager, audioManager, sceneManager} from 'ag2d';

// Create instance of `AG2D`
const experience = new AG2D(document.querySelector('canvas'));

// Configure `experience`
experience.configure({
    'fps': 60,
    'backgroundColour': '#FF00FF',
    'size': {
        'height': 720,
        'width': 1280
    }
});

// Update
const update = (deltaTime) => {
    animationManager.update(deltaTime);
    sceneManager.update(deltaTime);
};

// Render
const render = () => {
    sceneManager.render();
};

// Stop
const stop = () => {
    audioManager.suspend();
    sceneManager.pause();
};

// Start
const start = () => {
    audioManager.resume();
    sceneManager.play();
};

// Bind the hooks
experience.hooks.bind('update', update);
experience.hooks.bind('render', render);
experience.hooks.bind('stop', stop);
experience.hooks.bind('start', start);

// Export `experience`
export default experience;
