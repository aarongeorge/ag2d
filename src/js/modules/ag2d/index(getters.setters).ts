/**
 * AG2D
 *
 * @desc A 2D game experience
 */

import {getContext, noOp} from './modules/Utils'
import GameLoop from './modules/GameLoop'

// Single underscore means it is the private value for a setter
// Double underscore means it is private to the class

export default class AG2D {
    _autoClear: boolean = true
    _backgroundColor: string = 'transparent'
    _canvas: HTMLCanvasElement = document.createElement('canvas')
    _context: CanvasRenderingContext2D = getContext(this._canvas)
    _imageSmoothing: boolean = false
    _render: () => void = noOp
    _size: { height: number, width: number } = { height: 150, width: 300 }
    _start: () => void = noOp
    _stop: () => void = noOp
    _update: (deltaTime: number) => void = noOp
    _updatesPerSecond: number = 60

    __bounds: { height: number, width: number } = { height: 150, width: 300 }
    __gameLoop: GameLoop = new GameLoop({
        render: () => { this.__render() },
        update: (deltaTime: number) => { this.__update(deltaTime) },
        updatesPerSecond: 60
    })
    __ratio: number = 1

    __clearCanvas () {
        this._context.clearRect(0, 0, this._size.width, this._size.height)

        if (this._backgroundColor !== 'transparent') {
            this._context.fillStyle = this._backgroundColor
            this._context.fillRect(0, 0, this._size.width, this._size.height)
        }
    }

    __render () {
        this._context.save()
        this._context.scale(window.devicePixelRatio * this.__ratio, window.devicePixelRatio * this.__ratio)

        if (this._autoClear) this.__clearCanvas()

        this._render()
        this._context.restore()
    }

    __update (deltaTime: number) {
        this._update(deltaTime)
    }

    __start () {
        this._start()
        this.__gameLoop.start()
    }

    __stop () {
        this._stop()
        this.__gameLoop.stop()
    }

    __resizeCanvas (width: number, height: number) {
        const ratio = this._size.width / this._size.height
        const destRatio = width / height

        let destWidth = destRatio > ratio ? Math.floor(height * ratio) : width
        let destHeight = destRatio < ratio ? Math.floor(width / ratio) : height

        this.__bounds = { height: destHeight, width: destWidth}
        this.__ratio = destWidth / this._size.width
        this._canvas.setAttribute('height', Math.round(destHeight * window.devicePixelRatio).toString())
        this._canvas.setAttribute('width', Math.round(destWidth * window.devicePixelRatio).toString())
        this._canvas.style.height = `${destHeight}px`
        this._canvas.style.width = `${destWidth}px`
        this._context.imageSmoothingEnabled = this._imageSmoothing
    }

    get autoClear () { return this._autoClear }
    set autoClear (val) { this._autoClear = val }
    get backgroundColor () { return this._backgroundColor }
    set backgroundColor (val) { this._backgroundColor = val }
    get canvas () { return this._canvas }
    set canvas (val) {
        this._canvas = val
        this._context = getContext(val)
        this.__resizeCanvas(this._size.width, this._size.height)
    }
    get context () { return this._context }
    set context (val) { this._context = val }
    get imageSmoothing () { return this._imageSmoothing }
    set imageSmoothing (val) {
        this._imageSmoothing = val
        this._context.imageSmoothingEnabled = this._imageSmoothing
    }
    get render () { return this._render }
    set render (val) { this._render = val }
    get size () { return this._size }
    set size (val) {
        this._size = val
        this.__bounds = val
        this.__resizeCanvas(val.width, val.height)
    }
    get start () { return this.__start }
    set start (val) { this._start = val }
    get stop () { return this.__stop }
    set stop (val) { this._stop = val }
    get resizeCanvas () { return this.__resizeCanvas }
    get update () { return this._update }
    set update (val) { this._update = val }
    get updatesPerSecond () { return this._updatesPerSecond }
    set updatesPerSecond (val) {
        this._updatesPerSecond = val
        this.__gameLoop.stop()
        this.__gameLoop = new GameLoop({
            updatesPerSecond: val,
            render: () => { this.__render() },
            update: (deltaTime: number) => { this.__update(deltaTime) }
        })
    }
}

export {default as Animation} from './modules/SpriteSheetAnimation'
export {default as AssetLoader} from './modules/AssetLoader'
export {default as AudioManager} from './modules/AudioManager'
export {default as Entity} from './modules/Entity'
export {default as EventEmitter} from './modules/EventEmitter'
export {default as EventHandler} from './modules/EventHandler'
export {default as GameLoop} from './modules/GameLoop'
export {default as KeyManager} from './modules/KeyManager'
export {default as QuadTree} from './modules/QuadTree'
export {default as Scene} from './modules/Scene'
export {default as SceneManager} from './modules/SceneManager'
export {default as SpriteSheet} from './modules/SpriteSheet'
export {default as TileCollider} from './modules/TileCollider'
export {default as Trait} from './modules/Trait'
export {Matrix, Vec2, Rect, Point} from './modules/Math'
