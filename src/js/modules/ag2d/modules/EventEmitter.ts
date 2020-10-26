/**
 * EventEmitter
 *
 * @desc An event emitter
 */

interface Listener {
	callback: (...args: any[]) => void
	count: number
	name: string
}

export default class EventEmitter {
	listeners: {[x: string]: Listener[]}

	constructor () {this.listeners = {}}
	addListener (listener: Listener) {
		this.listeners[listener.name] = this.listeners[listener.name] || []
		this.listeners[listener.name].push(listener)
		return listener
	}
	removeListener (listener: Listener) {
		if (typeof this.listeners[listener.name] !== 'undefined') {
			this.listeners[listener.name] = this.listeners[listener.name].filter(eventListener => listener !== eventListener)
			if (this.listeners[listener.name].length === 0) delete this.listeners[listener.name]
		}
	}
	emit (name: string, ...args: any[]) {
		if (Object.keys(this.listeners).includes(name)) {
			this.listeners[name].forEach(listener => {
				listener.callback(...args)
				listener.count -= 1
				if (listener.count <= 0) this.listeners[name] = this.listeners[name].filter(eventListener => listener !== eventListener)
			})
		}
	}
}
