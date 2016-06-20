// Constructor: KeyManager
var KeyManager = function () {
    'use strict';

    // Object to store keys
    this.keysDown = {};
};

// Method: keyUp
KeyManager.prototype.keyUp = function (e) {
    'use strict';

    // Set the key to false
    this.keysDown[e.keyCode] = false;
};

// Method: keyDown
KeyManager.prototype.keyDown = function (e) {
    'use strict';

    // Set the value to the current time
    this.keysDown[e.keyCode] = window.performance.now();
};

// Method: isDown
KeyManager.prototype.isDown = function (key) {
    'use strict';

    // Return if the key is down
    return !!this.keysDown[key];
};

// Export `KeyManager`
module.exports = KeyManager;
