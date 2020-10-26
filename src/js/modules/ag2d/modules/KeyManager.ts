/**
 * Key Manager
 *
 * @desc A key manager
 */

import EventHandler from './EventHandler'

export default class KeyManager {
	eventHandler: EventHandler = new EventHandler()
	keyboardEventNames: string[] = ['keydown', 'keyup']
	keyMap: Map<string, {
		callback: (isDown: 0 | 1) => void
		target: HTMLElement | Window
	}> = new Map()
	keyStates: Map<string, 0 | 1> = new Map()

	addMapping (keyCode: string, callback: (isDown: 0 | 1) => void, target = window) {this.keyMap.set(`${target}:${keyCode}`, {callback, target})}
	disable (target: any = window) {
		this.keyboardEventNames.forEach(eventName => {
			if (!this.eventHandler.events.has(`${target}:${eventName}`)) return
			const {element, name} = this.eventHandler.events.get(`${target}:${eventName}`)!
			if (element === target && name === `${target}:${eventName}`) this.eventHandler.removeEvent(`${target}:${eventName}`)
		})
	}
	enable (target: any = window) {
		this.keyboardEventNames.forEach(eventName => {
			this.eventHandler.addEvent({
				element: target,
				callback: this.handleEvent.bind(this, target),
				name: `${target}:${eventName}`,
				type: eventName
			})
		})
	}
	handleEvent (target: HTMLElement | Window, event: KeyboardEvent) {
		if (this.keyMap.has(`${target}:${event.code}`)) {
			const currentKeyMapping = this.keyMap.get(`${target}:${event.code}`)
			if (currentKeyMapping && currentKeyMapping.target === target) {
				const isDown = event.type === 'keydown' ? 1 : 0
				if (this.keyStates.get(`${target}:${event.code}`) !== isDown) {
					this.keyStates.set(`${target}:${event.code}`, isDown)
					currentKeyMapping.callback(isDown)
				}
			}
		}
	}
	removeMapping (keyCode: string, target = window) {
		this.keyMap.delete(`${target}:${keyCode}`)
		if (this.keyStates.has(`${target}:${keyCode}`)) this.keyStates.delete(`${target}:${keyCode}`)
	}
}
