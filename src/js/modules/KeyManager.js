/**
 * Key Manager
 *
 * @desc A key manager
 */

// Constructor: AnimationManager
class KeyManager {

    // Constructor
    constructor () {
        this.keysDown = {};
    }

    // Method: keyUp
    keyUp (e) {

        // Set the key to false
        this.keysDown[e.keyCode] = false;
    }

    // Method: keyDown
    keyDown (e) {

        // Set the value to the current time
        this.keysDown[e.keyCode] = window.performance.now();
    }

    // Method: isDown
    isDown (key) {

        // Return if the key is down
        return Boolean(this.keysDown[key]);
    }
}

// Export `KeyManager`
export default KeyManager;
