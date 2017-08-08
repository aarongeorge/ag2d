/**
 * SceneManager
 *
 * @desc A scene manager
 */

// Dependencies
import {cyclicArray} from './Utils';

// Class: SceneManager
class SceneManager {

    // Constructor
    constructor () {

        // Object to hold scenes
        this.scenes = {};

        // Array to hold the scene names
        this.sceneNames = [];
    }

    // Method: add
    add (scene) {

        // Add `name` to `scenes`
        this.scenes[scene.name] = scene;

        // Update `sceneNames`
        this.sceneNames = Object.keys(this.scenes);
    }

    // Method: goTo
    goTo (name) {

        // Check `scenes[name]` exists
        if (this.scenes[name]) {

            // Check `currentScene` exists and it has `sceneExit`
            if (this.currentScene && this.currentScene.sceneExit) {

                // Call `sceneExit`
                this.currentScene.sceneExit();
            }

            // Set `currentScene`
            this.currentScene = this.scenes[name];

            // Check `sceneEnter` exists
            if (this.currentScene.sceneEnter) {

                // Update `currentScene.sceneEntered`
                this.currentScene.sceneEntered = window.performance.now();

                // Call `sceneEnter`
                this.currentScene.sceneEnter();
            }
        }

        // `scenes[name]` does not exist
        else {

            // Log error
            throw new Error(`Scene ${name} does not exist`);
        }
    }

    // Method: next
    next () {

        // Go to next scene
        this.goTo(this.scenes[cyclicArray(this.sceneNames, this.sceneNames.indexOf(this.currentScene.name) + 1).value].name);
    }

    // Method: previous
    previous () {

        // Go to previous scene
        this.goTo(this.scenes[cyclicArray(this.sceneNames, this.sceneNames.indexOf(this.currentScene.name) - 1).value].name);
    }

    // Method: remove
    remove (name) {

        // Remove `name` from `scenes`
        delete this.scenes[name];

        // Update `sceneNames`
        this.sceneNames = Object.keys(this.scenes);
    }

    // Method: render
    render () {

        // Check there is a current scene and it has `render`
        if (this.currentScene && this.currentScene.render) {

            // Call `render`
            this.currentScene.render();
        }
    }

    // Method: update
    update (deltaTime) {

        // Check there is a current scene and it has `update`
        if (this.currentScene && this.currentScene.update) {

            // Call `update`
            this.currentScene.update(deltaTime);
        }
    }
}

// Export `SceneManager`
export default SceneManager;
