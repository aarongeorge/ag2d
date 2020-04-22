/**
 * EventEmitter
 *
 * @desc An event emitter
 */

interface Reference {
	callback: (...args: any[]) => void
	count: number
	name: string
}

export default class EventEmitter {
	listeners: { [x: string]: Reference[] }

    constructor () { this.listeners = {} }

    addListener (name: Reference['name'], callback: Reference['callback'], count: Reference['count'] = Infinity) {
		const reference = { callback, count, name } as Reference

        this.listeners[name] ? this.listeners[name] = [...this.listeners[name], reference] : this.listeners[name] = [reference]

        return reference
    }
    removeListener (reference: Reference) {
        if (typeof this.listeners[reference.name] !== 'undefined') {
			this.listeners[reference.name] = this.listeners[reference.name].filter(eventListener => reference !== eventListener)

            if (this.listeners[reference.name].length === 0) delete this.listeners[reference.name]
        }
    }
    emit (name: Reference['name'], ...args: any[]) {
        if (Object.keys(this.listeners).includes(name)) {
            this.listeners[name].forEach(listener => {
				listener.callback(...args)

                listener.count -= 1

                if (listener.count <= 0) this.listeners[name] = this.listeners[name].filter(eventListener => listener !== eventListener)
            })
        }
    }
}
