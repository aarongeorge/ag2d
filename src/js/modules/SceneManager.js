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

    // Set `currentScene` to `scenes[name]`
    this.currentScene = this.scenes[name];
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

    // Check `currentScene` exists
    if (this.currentScene) {

        // Proxy `draw` event to `currentScene`
        this.currentScene.draw();
    }
};

// Method: update
SceneManager.prototype.update = function (deltaTime) {
    'use strict';

    // Check `currentScene` exists
    if (this.currentScene) {

        // Proxy `update` event to `currentScene`
        this.currentScene.update(deltaTime);
    }
};

// Method: keyUp
SceneManager.prototype.keyUp = function (key, evt) {
    'use strict';

    // Check `currentScene` exists
    if (this.currentScene) {

        // Proxy `keyUp` event to `currentScene`
        this.currentScene.keyUp(key, evt);
    }
};

// Method: keyDown
SceneManager.prototype.keyDown = function (key, evt) {
    'use strict';

    // Check `currentScene` exists
    if (this.currentScene) {

        // Proxy `keyDown` event to `currentScene`
        this.currentScene.keyDown(key, evt);
    }
};

// Export `SceneManager`
module.exports = SceneManager;
