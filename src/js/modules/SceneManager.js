/**
 * SceneManager
 */

// Dependencies
var Utils = require('./Utils');

// Constructor: SceneManager
var SceneManager = function () {
    'use strict';

    // Object to hold scenes
    this.scenes = {};
};

// Method: add
SceneManager.prototype.add = function (scene) {
    'use strict';

    // Add `name` to `this.scenes`
    this.scenes[scene.name] = scene;

    // Update sceneNames
    this.sceneNames = Object.keys(this.scenes);
};

// Method: remove
SceneManager.prototype.remove = function (name) {
    'use strict';

    // Remove `name` from `this.scenes`
    delete this.scenes[name];

    // Update sceneNames
    this.sceneNames = Object.keys(this.scenes);
};

// Method: goTo
SceneManager.prototype.goTo = function (name) {
    'use strict';

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
        console.log('Scene ' + name + ' does not exist');
    }
};

// Method: next
SceneManager.prototype.next = function () {
    'use strict';

    // Set `currentScene` to next scene in `scenes`
    this.currentScene = this.scenes[Utils.cyclicArray(this.sceneNames, this.sceneNames.indexOf(this.currentScene.name) + 1)[0]];
};

// Method: previous
SceneManager.prototype.previous = function () {
    'use strict';

    // Set `currentScene` to previous scene in `scenes`
    this.currentScene = this.scenes[Utils.cyclicArray(this.sceneNames, this.sceneNames.indexOf(this.currentScene.name) - 1)[0]];
};

// Method: draw
SceneManager.prototype.draw = function () {
    'use strict';

    // Check there is a current scene and it has `draw`
    if (this.currentScene && this.currentScene.draw) {

        // Call `draw`
        this.currentScene.draw();
    }
};

// Method: update
SceneManager.prototype.update = function (deltaTime) {
    'use strict';

    // Check there is a current scene and it has `update`
    if (this.currentScene && this.currentScene.update) {

        // Call `update`
        this.currentScene.update(deltaTime);
    }
};

// Export `SceneManager`
module.exports = SceneManager;
