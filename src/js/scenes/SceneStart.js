/**
 * SceneStart
 */

// Dependencies
import experience from '../experience';
import {eventHandler, Scene, sceneManager} from '../libs/ag2d';

// Create the start Scene
class SceneStart extends Scene {

    // Constructor
    constructor () {

        // Set name of scene
        super('SceneStart');
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

        // Bind `click` interaction
        eventHandler.addEvent({
            'name': 'SceneStartInteraction',
            'element': experience.canvas,
            'type': 'click',
            'function': () => {
                sceneManager.next();
            }
        });
    }

    // Method: sceneExit
    sceneExit () {

        // Unbind `click` interaction
        eventHandler.removeEvent('SceneStartInteraction');
    }
}

// Export `SceneStart`
export default SceneStart;
