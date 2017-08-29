/**
 * Page: ag2dPage
 */

// Dependencies
import experience, {assetLoader, sceneManager} from './experience';

// Scenes
import SceneMobileInteraction from './scenes/SceneMobileInteraction';
import SceneLoading from './scenes/SceneLoading';

/**
 * Asset Loader setup
 */
assetLoader.addAssets([
    {
        'type': 'audio',
        'name': 'TestAudio',
        'sources': [
            {
                'type': 'audio/ogg',
                'path': '/audio/TestAudio.ogg'
            },
            {
                'type': 'audio/mpeg',
                'path': '/audio/TestAudio.mp3'
            }
        ]
    },
    {
        'type': 'video',
        'name': 'TestVideo',
        'sources': [
            {
                'type': 'video/ogg',
                'path': '/video/TestVideo.ogg'
            },
            {
                'type': 'video/webm',
                'path': '/video/TestVideo.webm'
            },
            {
                'type': 'video/mp4',
                'path': '/video/TestVideo.mp4'
            }
        ]
    }
]);

/**
 * Scene Manager setup
 */

// Add `SceneMobileInteraction` to `sceneManager`
sceneManager.add(new SceneMobileInteraction());

// Add `SceneLoading` to `sceneManager`
sceneManager.add(new SceneLoading());

/**
 * Configure experience
 */
experience.configure({
    'canvas': document.querySelector('canvas'),
    'fps': 60,
    'backgroundColour': '#FF00FF',
    'size': {
        'height': 720,
        'width': 1280
    }
});

/**
 * Start experience
 */

// Resize experience to window
experience.resizeCanvas(window.innerWidth, window.innerHeight);

// Add event listener to resize experience when window resizes
window.addEventListener('resize', () => {
    experience.resizeCanvas(window.innerWidth, window.innerHeight);
});

// Go to `SceneMobileInteraction`
sceneManager.goTo('SceneMobileInteraction');

// Call `start`
experience.start();
