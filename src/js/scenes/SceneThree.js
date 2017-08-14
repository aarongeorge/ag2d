/**
 * Scenes: SceneThree
 */

// Dependencies
import experience from '../experience';
import {assetLoader, audioManager, Scene} from '../libs/ag2d';

// Class: SceneThree
class SceneThree extends Scene {

    // Constructor
    constructor () {

        // Set name of scene
        super('SceneThree');

        // Set `video`
        this.video = assetLoader.assets.TestVideo;
    }

    // Method: render
    render () {

        // Red background
        experience.context.fillStyle = '#FF0000';
        experience.context.fillRect(0, 0, experience.size.width, experience.size.height);

        // Render `video`
        experience.context.drawImage(this.video.element, 0, 0);

        // Scene name
        experience.context.textAlign = 'center';
        experience.context.textBaseline = 'middle';
        experience.context.fillStyle = '#000000';
        experience.context.fillText(this.name, experience.size.width / 2, experience.size.height / 2);
    }

    // Method: sceneEnter
    sceneEnter () {

        // Set `currentTime` to `0`
        this.video.element.currentTime = 0;

        // Play `video`
        this.video.element.play();

        // Play `TestAudio`
        audioManager.play('TestAudio');
    }

    // Method: sceneExit
    sceneExit () {

        // Pause `video`
        this.video.element.pause();

        // Set `currentTime` to `0`
        this.video.element.currentTime = 0;

        // Stop `TestAudio`
        audioManager.stop('TestAudio');
    }
}

// Export `SceneThree`
export default SceneThree;
