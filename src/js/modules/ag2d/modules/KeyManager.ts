/**
 * Key Manager
 *
 * @desc A key manager
 */

import EventHandler from './EventHandler';

export default class KeyManager {
    eventHandler: EventHandler;
    keyboardEventNames: Array<string>;
    keyMap: Map<string, {
        'callback': (keyState: 0 | 1, name: string) => void,
        'target': HTMLElement | Window
    }>;
    keyStates: Map<string, 0 | 1>;

    constructor () {
        this.eventHandler = new EventHandler();
        this.keyMap = new Map();
        this.keyStates = new Map();
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
        this.keyboardEventNames.forEach(eventName => {
            const {element, name} = this.eventHandler.events[`${target}:${eventName}`];

            if (element === target && name === `${target}:${eventName}`) {
                this.eventHandler.removeEvent(`${target}:${eventName}`);
            }
        });
    }

    enable (target: any = window) {
        this.keyboardEventNames.forEach(eventName => {
            this.eventHandler.addEvent({
                'element': target,
                'callback': this.handleEvent.bind(this, target),
                'name': `${target}:${eventName}`,
                'type': eventName
            });
        });
    }

    handleEvent (target: HTMLElement | Window, event: KeyboardEvent) {
        if (this.keyMap.has(`${target}:${event.code}`) === true) {
            const currentKeyMapping = this.keyMap.get(`${target}:${event.code}`);

            if (currentKeyMapping && currentKeyMapping.target === target) {
                const keyState = event.type === 'keydown' ? 1 : 0;

                if (this.keyStates.get(`${target}:${event.code}`) !== keyState) {
                    this.keyStates.set(`${target}:${event.code}`, keyState);
                    currentKeyMapping.callback(keyState, `${currentKeyMapping.target}:${event.code}`);
                }
            }
        }
    }

    removeMapping (keyCode: string, target = window) {
        this.keyMap.delete(`${target}:${keyCode}`);

        if (this.keyStates.has(`${target}:${keyCode}`)) {
            this.keyStates.delete(`${target}:${keyCode}`);
        }
    }
}
