/**
 * SceneManager
 *
 * @desc A scene manager
 */

import {cyclicArray} from './Utils';

export default class SceneManager {

    constructor () {

        // Object to hold scenes
        this.scenes = {};

        // Array to hold the scene names
        this.sceneNames = [];
    }

    add (scene) {

        // Add `name` to `scenes`
        this.scenes[scene.name] = scene;

        // Update `sceneNames`
        this.sceneNames = Object.keys(this.scenes);
    }

    goTo (name) {

        // Check `scenes[name]` exists
        if (this.scenes[name]) {

            // Check `currentScene` exists
            if (this.currentScene) {

                // Call `exit`
                this.currentScene.exit();

                // Increment `exitCount`
                this.currentScene.exitCount += 1;
            }

            // Set `currentScene`
            this.currentScene = this.scenes[name];

            // Update `currentScene.sceneEntered`
            this.currentScene.sceneEntered = window.performance.now();

            // Call `enter`
            this.currentScene.enter();

            // Increment `enterCount`
            this.currentScene.enterCount += 1;
        }

        // `scenes[name]` does not exist
        else {

            // Log error
            throw new Error(`Scene ${name} does not exist`);
        }
    }

    next () {

        // Go to next scene
        this.goTo(this.scenes[cyclicArray(this.sceneNames, this.sceneNames.indexOf(this.currentScene.name) + 1).value].name);
    }

    pause () {

        if (this.currentScene) {

            // Call `pause`
            this.currentScene.pause();
        }
    }

    play () {

        if (this.currentScene) {

            // Call `play`
            this.currentScene.play();
        }
    }

    previous () {

        // Go to previous scene
        this.goTo(this.scenes[cyclicArray(this.sceneNames, this.sceneNames.indexOf(this.currentScene.name) - 1).value].name);
    }

    remove (name) {

        // Remove `name` from `scenes`
        delete this.scenes[name];

        // Update `sceneNames`
        this.sceneNames = Object.keys(this.scenes);
    }

    render () {

        // Check `currentScene` exists
        if (this.currentScene) {

            // Call `render`
            this.currentScene.render();
        }
    }

    update (deltaTime) {

        // Check `currentScene` exists
        if (this.currentScene) {

            // Call `update`
            this.currentScene.update(deltaTime);
        }
    }
}
