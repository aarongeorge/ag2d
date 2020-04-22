/**
 * EventEmitter
 *
 * @desc An event emitter
 */

export default class EventEmitter {

    constructor () { this.listeners = [] }

    addListener (name, callback, count = Infinity) {
        if (typeof this.listeners[name] === 'undefined') this.listeners[name] = []

        const reference = {
            callback,
            count,
            name
        }

        this.listeners[name].push(reference)

        return reference
    }
    removeListener (reference) {
        if (typeof this.listeners[reference.name] !== 'undefined') {
            this.listeners[reference.name] = this.listeners[reference.name].filter(eventListener => reference !== eventListener)

            if (this.listeners[reference.name].length === 0) delete this.listeners[reference.name]
        }
    }
    emit (name, ...args) {
        if (Object.keys(this.listeners).includes(name)) {
            this.listeners[name].forEach(listener => {
                listener.callback(...args)
                listener.count -= 1

                if (listener.count <= 0) this.listeners[name] = this.listeners[name].filter(eventListener => listener !== eventListener)
            })
        }
    }
}
