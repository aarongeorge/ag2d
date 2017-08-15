/**
 * SceneMobileInteraction
 */

// Dependencies
import experience from '../experience';
import {audioManager, eventEmitter, Scene, sceneManager} from 'ag2d';

// Create the Mobile Interaction Scene
class SceneMobileInteraction extends Scene {

    // Constructor
    constructor () {

        // Set name of scene
        super('SceneMobileInteraction');
    }

    // Method: render
    render () {

        // Red background
        experience.context.fillStyle = '#FF0000';
        experience.context.fillRect(0, 0, experience.size.width, experience.size.height);

        // Scene name
        experience.context.textAlign = 'center';
        experience.context.textBaseline = 'middle';
        experience.context.fillStyle = '#000000';
        experience.context.fillText(this.name, experience.size.width / 2, experience.size.height / 2);
    }

    // Method: sceneEnter
    sceneEnter () {

        // Scene hasn't been entered before
        if (this.enterCount === 0) {

            // Listener for `audioManager` context ready
            eventEmitter.addListener('audioManager:context ready', () => {

                document.querySelector('#start').addEventListener('click', () => {
                    experience.start();
                });

                document.querySelector('#stop').addEventListener('click', () => {
                    experience.stop();
                });

                // Go to `SceneLoading`
                sceneManager.goTo('SceneLoading');
            }, 1);

            // Call `init` on `audioManager`
            audioManager.init(() => {

                // Emit when context is ready
                eventEmitter.emit('audioManager:context ready');
            });
        }
    }
}

// Export `SceneMobileInteraction`
export default SceneMobileInteraction;
