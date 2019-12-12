/**
 * Modules: Event Handler
 */

interface Event {
    name: string;
    type: string;
    element: HTMLElement | Window;
    callback: (...args: Array<any>) => void;
}

export default class EventHandler {
    events: {[name: string]: Event};

    constructor () {
        this.events = {};
    }

    addEvent (evt: Event) {
        const customEvent = Object.assign({}, evt);

        if (Object.prototype.hasOwnProperty.call(this.events, customEvent.name)) {
            throw new Error(`\`name\` of \`${customEvent.name}\` is already in use`);
        }

        customEvent.element.addEventListener(customEvent.type, customEvent.callback);
        this.events[customEvent.name] = customEvent;
    }

    removeEvent (eventName: string) {
        if (typeof this.events[eventName] === 'undefined') {
            throw new Error(`There is no event named \`${eventName}\``);
        }

        else {
            const customEvent = this.events[eventName];

            customEvent.element.removeEventListener(customEvent.type, customEvent.callback);
            delete this.events[customEvent.name];
        }
    }

    removeEvents () {
        const eventNames = Object.keys(this.events);

        eventNames.forEach(eventName => this.removeEvent(eventName));
    }
}
