import EventHandler from './EventHandler'
import {noOp} from './Utils'

interface Point {
	start: {
		x: number
		y: number
	},
	x: number
	y: number
	buttons: number
	pressure: number
	isDown: boolean
	isStarted: boolean
}

export default class PointerManager {
	element: HTMLElement = document.body
	eventHandler: EventHandler = new EventHandler()
	pointerEventNames: Array<'pointerdown' | 'pointermove' | 'pointerup'> = ['pointerdown', 'pointermove', 'pointerup']
	points: Map<number, any> = new Map()
	scale: number = 1
	private _move: (point: Point) => void = noOp
	private _down: (point: Point) => void = noOp
	private _up: (point: Point) => void = noOp

	constructor () {
		return new Proxy(this, {
			set (target, prop: keyof PointerManager, val) {
				if (!(prop in target)) return false
				switch (prop) {
					case 'element': {
						Reflect.set(target, prop, val)
						target.disable()
						return true
					}
					case 'down':
					case 'move':
					case 'up': return Reflect.set(target, `_${prop}`, val || noOp)
					default: return Reflect.set(target, prop, val)
				}
			},
			get (target, prop: keyof PointerManager) {if (prop in target) return target[prop]}
		})
	}
	getMousePos (event: PointerEvent, element: HTMLElement = document.body, scale: number = 1) {
		const bounds = (element as HTMLElement).getBoundingClientRect()
		return {
			x: (event.clientX - bounds.left) * (element as any).width / bounds.width / scale,
			y: (event.clientY - bounds.top) * (element as any).height / bounds.height / scale
		}
	}
	disable () { this.eventHandler.removeEvents() }
	enable () {
		this.pointerEventNames.forEach(eventName => {
			this.eventHandler.addEvent({
				element: this.element,
				callback: this[`${eventName.replace('pointer', '')}` as 'down' | 'move' | 'up'].bind(this),
				name: `${this.element}:${eventName}`,
				type: eventName
			})
		})
	}
	down (e: PointerEvent) {
		const {x, y} = this.getMousePos(e, this.element, this.scale)
		this.points.set(e.pointerId, {start: {x, y}, x, y, buttons: e.buttons, pressure: e.pressure || 0.5, isDown: true, isStarted: false})
		this._down(this.points.get(e.pointerId)!)
		this.points.set(e.pointerId, {...this.points.get(e.pointerId)!, isStarted: true})
	}
	move (e: PointerEvent) {
		const {x, y} = this.getMousePos(e, this.element, this.scale)
		this.points.set(e.pointerId, { ...this.points.get(e.pointerId)!, x, y, buttons: e.buttons, pressure: e.pressure || 0.5 })
		this._move(this.points.get(e.pointerId)!)
	}
	up (e: PointerEvent) {
		const {x, y} = this.getMousePos(e, this.element, this.scale)
		this.points.set(e.pointerId, {...this.points.get(e.pointerId)!, x, y, buttons: e.buttons, pressure: e.pressure || 0.5, isDown: false})
		this._up(this.points.get(e.pointerId)!)
		this.points.delete(e.pointerId)
	}
}
