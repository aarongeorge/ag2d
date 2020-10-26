interface Event {
	name: string
	type: string
	element: HTMLElement | Window
	callback: (...args: any[]) => void
}

export default class EventHandler {
	events: Map<string, Event> = new Map()
	addEvent (evt: Event) {
		const customEvent = Object.assign({}, evt)
		if (this.events.has(customEvent.name)) throw new Error(`\`name\` of \`${customEvent.name}\` is already in use`)
		customEvent.element.addEventListener(customEvent.type, customEvent.callback)
		this.events.set(customEvent.name, customEvent)
	}
	removeEvent (eventName: string) {
		if (!this.events.has(eventName)) throw new Error(`There is no event named \`${eventName}\``)
		else {
			const customEvent = this.events.get(eventName)!
			customEvent.element.removeEventListener(customEvent.type, customEvent.callback)
			this.events.delete(customEvent.name)
		}
	}
	removeEvents () {this.events = new Map()}
}
