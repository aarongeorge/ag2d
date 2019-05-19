import experience, {
    assetLoader,
    sceneManager,
    keyManager
} from './experience';
import SceneMobileInteraction from './scenes/SceneMobileInteraction';
import SceneLoading from './scenes/SceneLoading';

/**
 * Asset Loader setup
 */
assetLoader.addAssets([{
    'name': 'sprite-sheet-example',
    'path': '/sprite-sheet-example.png',
    'type': 'image'
}]);

/**
 * Scene Manager setup
 */

// Add `SceneMobileInteraction` to `sceneManager`
sceneManager.add(new SceneMobileInteraction());

// Add `SceneLoading` to `sceneManager`
sceneManager.add(new SceneLoading());

// Enable `keyManager` on `experience.canvas`
keyManager.enable(experience.canvas);
keyManager.enable();

// Go to `SceneMobileInteraction`
sceneManager.goTo('SceneMobileInteraction');

// Call `start`
experience.start();
