/**
 * EventEmitter
 *
 * @desc An event emitter
 */

// Class: EventEmitter
class EventEmitter {

    // Constructor
    constructor () {

        // Set `listenersMap`
        this.listeners = [];
    }

    // Method: addListener
    addListener (name, callback, count = Infinity) {

        // `name` doesn't exist in `listeners`
        if (typeof this.listeners[name] === 'undefined') {

            // Create array
            this.listeners[name] = [];
        }

        // Create `reference`
        const reference = {
            name,
            callback,
            count
        };

        // Push `reference` to `listeners[name]`
        this.listeners[name].push(reference);

        // Return `reference` so we can remove it later
        return reference;
    }

    // Method: removeListener
    removeListener (reference) {

        // `name` exists in `listeners`
        if (typeof this.listeners[reference.name] !== 'undefined') {

            // Remove `reference` from `listeners[reference.name]`
            this.listeners[reference.name] = this.listeners[reference.name].filter((eventListener) => {
                return reference !== eventListener;
            });

            // Remove `reference.name` if `length` is `0`
            if (this.listeners[reference.name].length === 0) {
                delete this.listeners[reference.name];
            }
        }
    }

    // Method: emit
    emit (name, ...args) {

        // `name` exists in `listeners`
        if (Object.keys(this.listeners).includes(name)) {

            // Iterate over each `listener`
            this.listeners[name].forEach((listener) => {

                // Call `callback`
                listener.callback(...args);

                // Decrement `count`
                listener.count -= 1;

                // `count` is less than or equal to `0`
                if (listener.count <= 0) {

                    // Remove `listener` from `listeners[name]`
                    this.listeners[name] = this.listeners[name].filter((eventListener) => {
                        return listener !== eventListener;
                    });
                }
            });
        }
    }
}

// Export `EventEmitter`
export default EventEmitter;
