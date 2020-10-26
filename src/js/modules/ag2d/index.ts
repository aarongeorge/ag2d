import {getContext, noOp} from './modules/Utils'
import GameLoop from './modules/GameLoop'

export default class AG2D {
	autoClear: boolean = true
	backgroundColor: string = 'transparent'
	canvas: HTMLCanvasElement = document.createElement('canvas')
	context: CanvasRenderingContext2D = getContext(this.canvas)
	imageSmoothing: boolean = false
	size: {height: number, width: number} = {height: 150, width: 300}
	updatesPerSecond: number = 60
	private _bounds: {height: number, width: number} = {height: 150, width: 300}
	private _gameLoop: GameLoop = new GameLoop({
		render: () => this.render(),
		update: deltaTime => this.update(deltaTime),
		updatesPerSecond: 60
	})
	private _ratio: number = 1
	private _render: () => void = noOp
	private _start: () => void = noOp
	private _stop: () => void = noOp
	private _update: (deltaTime: number) => void = noOp

	constructor () {
		return new Proxy(this, {
			set (target, prop: keyof AG2D, val) {
				if (!(prop in target)) return false
				switch (prop) {
					case 'canvas': {
						Reflect.set(target, prop, val)
						target.context = getContext(val)
						target.resizeCanvas(target.size.width, target.size.height)
						return true
					}
					case 'updatesPerSecond': {
						Reflect.set(target, prop, val)
						target._gameLoop.stop()
						target._gameLoop = new GameLoop({
							updatesPerSecond: target[prop],
							render: () => target.render(),
							update: (deltaTime) => target.update(deltaTime)
						})
						return true
					}
					case 'size': {
						Reflect.set(target, prop, val)
						target._bounds = val
						target.resizeCanvas(target._bounds.width, target._bounds.height)
						return true
					}
					case 'imageSmoothing': {
						Reflect.set(target, prop, val)
						target.context.imageSmoothingEnabled = val
						return true
					}
					case 'render':
					case 'start':
					case 'stop':
					case 'update': return Reflect.set(target, `_${prop}`, val)
					default: return Reflect.set(target, prop, val)
				}
			},
			get (target, prop: keyof AG2D) {if (prop in target) return target[prop] as keyof AG2D}
		})
	}
	clearCanvas (force = false) {
		this.context.clearRect(0, 0, this.size.width, this.size.height)
		if (this.backgroundColor !== 'transparent' && force === false) {
			this.context.fillStyle = this.backgroundColor
			this.context.fillRect(0, 0, this.size.width, this.size.height)
		}
	}
	render () {
		this.context.save()
		this.context.scale(window.devicePixelRatio * this._ratio, window.devicePixelRatio * this._ratio)
		if (this.autoClear) this.clearCanvas()
		this._render()
		this.context.restore()
	}
	start () {
		this._start()
		this._gameLoop.start()
	}
	stop () {
		this._stop()
		this._gameLoop.stop()
	}
	update (deltaTime: number) {this._update(deltaTime)}
	resizeCanvas (width: number, height: number) {
		const currentRatio = this.size.width / this.size.height
		const desiredRatio = width / height
		let destWidth = desiredRatio > currentRatio ? Math.floor(height * currentRatio) : width
		let destHeight = desiredRatio < currentRatio ? Math.floor(width / currentRatio) : height
		this._bounds = {height: destHeight, width: destWidth}
		this._ratio = destWidth / this.size.width
		this.canvas.setAttribute('height', `${Math.round(destHeight * window.devicePixelRatio)}`)
		this.canvas.setAttribute('width', `${Math.round(destWidth * window.devicePixelRatio)}`)
		this.canvas.style.height = `${destHeight}px`
		this.canvas.style.width = `${destWidth}px`
		this.context.imageSmoothingEnabled = this.imageSmoothing
	}
	get ratio () {return this._ratio}
}

export {default as AssetLoader} from './modules/AssetLoader'
export {default as AudioManager} from './modules/AudioManager'
export {default as Entity} from './modules/Entity'
export {default as EventEmitter} from './modules/EventEmitter'
export {default as EventHandler} from './modules/EventHandler'
export {default as GameLoop} from './modules/GameLoop'
export {default as KeyManager} from './modules/KeyManager'
export {default as PointerManager} from './modules/PointerManager'
export {default as QuadTree} from './modules/QuadTree'
export {default as Scene} from './modules/Scene'
export {default as SceneManager} from './modules/SceneManager'
export {default as SpriteSheet} from './modules/SpriteSheet'
export {default as SpriteSheetAnimation} from './modules/SpriteSheetAnimation'
export {default as TileCollider} from './modules/TileCollider'
export {default as Trait} from './modules/Trait'
export {Matrix, Point, Rect, Vec2} from './modules/Math'
