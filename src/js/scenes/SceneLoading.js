/**
 * SceneLoading
 */

// Dependencies
import experience, {assetLoader, audioManager, eventEmitter, sceneManager} from '../experience';
import {Scene} from 'ag2d';

// Scenes
import SceneStart from './SceneStart';
import SceneOne from './SceneOne';
import SceneTwo from './SceneTwo';
import SceneThree from './SceneThree';

// Class: SceneLoading
class SceneLoading extends Scene {

    // Constructor
    constructor () {

        // Set name of scene
        super('SceneLoading');
    }

    // Method: render
    render () {

        // Yellow background
        experience.context.fillStyle = '#FFFF00';
        experience.context.fillRect(0, 0, experience.size.width, experience.size.height);

        // Scene name
        experience.context.textAlign = 'center';
        experience.context.textBaseline = 'middle';
        experience.context.font = '40px sans-serif';
        experience.context.strokeStyle = 'black';
        experience.context.lineWidth = 4;
        experience.context.lineJoin = 'round';
        experience.context.strokeText('Please wait, we are loading...', experience.size.width / 2, experience.size.height / 2);
        experience.context.fillStyle = 'white';
        experience.context.fillText('Please wait, we are loading...', experience.size.width / 2, experience.size.height / 2);
    }

    // Method: enter
    enter () {

        // Scene hasn't been entered before
        if (this.enterCount === 0) {

            // Listener for `assetLoader` loaded
            eventEmitter.addListener('assetLoader:loaded', () => {

                /**
                 * Set videos to play inline
                 */

                // Iterate over `assetLoader.assets`
                Object.keys(assetLoader.assets).forEach((asset) => {

                    // Store reference to `currentAsset`
                    const currentAsset = assetLoader.assets[asset];

                    // `type` is `video`
                    if (currentAsset.type === 'video') {

                        // Add playsinline
                        currentAsset.element.setAttribute('playsinline', true);

                        // Add webkit-playsinline
                        currentAsset.element.setAttribute('webkit-playsinline', true);
                    }
                });

                /**
                 * Audio Manager setup
                 */

                // Add `TestAudio` to `audioManager`
                audioManager.add(assetLoader.assets.TestAudio);

                /**
                 * Scene Manager setup
                 */

                // Add `SceneStart` to `sceneManager`
                sceneManager.add(new SceneStart());

                // Add `SceneOne` to `sceneManager`
                sceneManager.add(new SceneOne());

                // Add `SceneTwo` to `sceneManager`
                sceneManager.add(new SceneTwo());

                // Add `SceneThree` to `sceneManager`
                sceneManager.add(new SceneThree());

                // Go to `SceneStart`
                sceneManager.goTo('SceneStart');
            }, 1);

            // Call `loadAssets`
            assetLoader.loadAssets(() => {

                // Emit loaded
                eventEmitter.emit('assetLoader:loaded');
            });
        }
    }
}

// Export `SceneLoading`
export default SceneLoading;
