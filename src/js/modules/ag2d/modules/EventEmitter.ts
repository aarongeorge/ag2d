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
	listeners: Map<string, Listener[]> = new Map()

	addListener (listener: Listener) {

		// If `listener.name` is already registered, add the new listener to its list
		if (this.listeners.has(listener.name)) this.listeners.set(listener.name, [...this.listeners.get(listener.name)!, listener])

		// Otherwise register `listener.name` and then add the new listener to its list
		else this.listeners.set(listener.name, [listener])
	}

	removeListener (listener: Listener) {

		// Exit if `listener.name` isn't registered
		if (!this.listeners.has(listener.name)) return

		// Store reference to listeners registered to `listener.name`
		let listenerRef = this.listeners.get(listener.name)!

		// Create a copy of `listener.name`'s registered listeners, with `listener` removed
		let filteredListeners = listenerRef.filter(eventListener => listener !== eventListener)

		// If there is atleast one listener still registered, update the list with filtered copy from above
		if (filteredListeners.length) this.listeners.set(listener.name, filteredListeners)

		// Otherwise de-register `listener.name`
		else this.listeners.delete(listener.name)
	}

	emit (name: string, ...args: any[]) {

		// Exit if `name` isn't registered
		if (!this.listeners.has(name)) return

		// Loop over all listeners registered to `name`
		this.listeners.get(name)!.forEach(listener => {

			// Call `callback` and pass through all arguments
			listener.callback(...args)

			// Decrement the `count`
			listener.count -= 1

			// If the count is `0`, then call `removeListener`
			if (listener.count === 0) this.removeListener(listener)
		})
	}
}
