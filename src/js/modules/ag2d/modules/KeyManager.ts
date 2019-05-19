/**
 * Key Manager
 *
 * @desc A key manager
 */

import EventHandler from './EventHandler';

export default class KeyManager {
    eventHandler: EventHandler;
    keyboardEventNames: Array<string>;
    keyMap: Map<string, {'callback': (keyState: 0 | 1, name: string) => void, 'target': HTMLElement | Window}>;
    keyStates: Map<string, 0 | 1>;

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

    addMapping (keyCode: string, callback: () => void, target = window) {
        this.keyMap.set(`${target}:${keyCode}`, {
            callback,
            target
        });
    }

    disable (target: any = window) {

        // Iterate over `keyboardEventNames`
        this.keyboardEventNames.forEach(eventName => {

            // Store reference to `element` and `name`
            const {element, name} = this.eventHandler.events[`${target}:${eventName}`];

            // `target` has a mapping for `${target}:${eventName}` in `this.eventHandler.events`
            if (element === target && name === `${target}:${eventName}`) {

                // Remove `${target}:${eventName}` handler
                this.eventHandler.removeEvent(`${target}:${eventName}`);
            }
        });
    }

    enable (target: any = window) {

        // Iterate over `keyboardEventNames`
        this.keyboardEventNames.forEach(eventName => {

            // Create event handler for `eventName`
            this.eventHandler.addEvent({
                'element': target,
                'callback': this.handleEvent.bind(this, target),
                'name': `${target}:${eventName}`,
                'type': eventName
            });
        });
    }

    handleEvent (target: HTMLElement | Window, event: KeyboardEvent) {

        // `keyMap` has a binding for ``${target}:${eventCode}`
        if (this.keyMap.has(`${target}:${event.code}`) === true) {

            // Store reference to current key map
            const currentKeyMapping = this.keyMap.get(`${target}:${event.code}`);

            // `currentKeyMapping.target` matches `target`
            if (currentKeyMapping && currentKeyMapping.target === target) {

                // Set `keyState` to `1` if key is pressed, or `0` if it is not
                const keyState = event.type === 'keydown' ? 1 : 0;

                // `keyState` has changed
                if (this.keyStates.get(`${target}:${event.code}`) !== keyState) {

                    // Update `keyState`
                    this.keyStates.set(`${target}:${event.code}`, keyState);

                    // Call `callback` for the current key and pass `keyState` and `${currentKeyMapping.target}:${event.code}`
                    currentKeyMapping.callback(keyState, `${currentKeyMapping.target}:${event.code}`);
                }
            }
        }
    }

    removeMapping (keyCode: string, target = window) {

        // Remove ``${target}:${keyCode}`` from the `keyStates` map
        this.keyMap.delete(`${target}:${keyCode}`);

        // `keyStates` map has ``${target}:${keyCode}`` in it
        if (this.keyStates.has(`${target}:${keyCode}`)) {

            // Remove ``${target}:${keyCode}`` from the `keyStates` map
            this.keyStates.delete(`${target}:${keyCode}`);
        }
    }
}
