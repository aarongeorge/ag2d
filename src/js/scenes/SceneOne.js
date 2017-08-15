/**
 * Scenes: SceneOne
 */

// Dependencies
import experience from '../experience';
import {assetLoader, audioManager, Scene, sceneManager} from 'ag2d';

// Class: SceneOne
class SceneOne extends Scene {

    // Constructor
    constructor () {

        // Set name of scene
        super('SceneOne');

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
        experience.context.font = '40px sans-serif';
        experience.context.strokeStyle = 'black';
        experience.context.lineWidth = 4;
        experience.context.lineJoin = 'round';
        experience.context.strokeText(this.name, experience.size.width / 2, experience.size.height / 2);
        experience.context.fillStyle = 'white';
        experience.context.fillText(this.name, experience.size.width / 2, experience.size.height / 2);
    }

    // Method: sceneEnter
    sceneEnter () {

        // Set `currentTime` to `0`
        this.video.element.currentTime = 0;

        // Play `video`
        this.video.element.play();

        // Store reference to `this`
        const _this = this;

        // Once the video is completed
        this.video.element.addEventListener('ended', function nextScene () {
            _this.video.element.removeEventListener('ended', nextScene, false);
            sceneManager.next();
        });

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

// Export `SceneOne`
export default SceneOne;
