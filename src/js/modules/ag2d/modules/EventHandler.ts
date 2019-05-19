/**
 * Modules: Event Handler
 */

interface Event {
    name: string;
    type: string;
    element: HTMLElement | Window;
    callback: () => void;
}

export default class EventHandler {
    events: {[name: string]: Event};

    constructor () {

        // Object to store `events`
        this.events = {};
    }

    addEvent (evt: Event) {

        // Create new `customEvent`
        const customEvent = Object.assign({}, evt);

        // `name` already exists
        if (Object.prototype.hasOwnProperty.call(this.events, customEvent.name)) {

            // Throw error
            throw new Error(`\`name\` of \`${customEvent.name}\` is already in use`);
        }

        // Add the listener to the element
        customEvent.element.addEventListener(customEvent.type, customEvent.callback);

        // Add `customEvent` to `events`
        this.events[customEvent.name] = customEvent;
    }

    removeEvent (eventName: string) {

        // `eventName` is undefined
        if (typeof this.events[eventName] === 'undefined') {

            // Throw error
            throw new Error(`There is no event named \`${eventName}\``);
        }

        // `eventName` is defined
        else {

            // Store reference to `customEvent`
            const customEvent = this.events[eventName];

            // Remove the listener from the element
            customEvent.element.removeEventListener(customEvent.type, customEvent.callback);

            // Remove `customEvent` from `events`
            delete this.events[customEvent.name];
        }
    }

    removeEvents () {

        // Get all event names from `events`
        const eventNames = Object.keys(this.events);

        // Iterate over `eventNames`
        eventNames.forEach(eventName => {

            // Remove event from `events`
            this.removeEvent(eventName);
        });
    }
}
