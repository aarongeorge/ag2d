/**
 * Key Manager
 *
 * @desc A key manager
 */

// Dependencies
import EventHandler from './EventHandler';

// Constructor: AnimationManager
class KeyManager {

    // Constructor
    constructor () {

        // Create `eventHandler`
        this.eventHandler = new EventHandler();

        // Map to store each key we are mapping to
        this.keyMap = new Map();

        // Map to store the state of each key in `keyMap`
        this.keyStates = new Map();

        // An array of keyboard event names to listen to
        this.keyboardEventNames = [
            'keydown',
            'keyup'
        ];
    }

    // Method: addMapping
    addMapping (keyCode, callback) {
        this.keyMap.set(keyCode, callback);
    }

    // Method: disable
    disable (target = window) {

        // Iterate over `keyboardEventNames`
        this.keyboardEventNames.forEach(() => {

            // Remove `eventName` handlers
            this.eventHandler.removeEvent('handleEvent');
        });
    }

    // Method: enable
    enable (target = window) {

        // Iterate over `keyboardEventNames`
        this.keyboardEventNames.forEach(eventName => {

            // Create event handler for `eventName`
            this.eventHandler.addEvent({
                'element': target,
                'function': this.handleEvent.bind(this),
                'name': `handleEvent:${eventName}`,
                'type': eventName
            });
        });
    }

    // Method: handleEvent
    handleEvent (event) {

        // `keyMap` has a binding
        if (this.keyMap.has(event.code) === true) {

            // Set `keyState` to `1` if key is pressed, or `0` if it is not
            const keyState = event.type === 'keydown' ? 1 : 0;

            // `keyState`has changed
            if (this.keyStates.get(event.code) !== keyState) {

                // Update `keyState`
                this.keyStates.set(event.code, keyState);

                // Call the callback for the current key
                this.keyMap.get(event.code)(keyState);
            }
        }
    }

    // Method: removeMapping
    removeMapping (keyCode) {

        // Remove `keyCode` from the `keyStates` map
        this.keyMap.delete(keyCode);

        // `keyStates` map has `keyCode` in it
        if (this.keyStates.has(keyCode)) {

            // Remove `keyCode` from the `keyStates` map
            this.keyStates.delete(keyCode);
        }
    }
}

// Export `KeyManager`
export default KeyManager;
