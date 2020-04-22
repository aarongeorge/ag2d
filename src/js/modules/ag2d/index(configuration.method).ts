/**
 * AG2D
 *
 * @desc A 2D game experience
 */

import {getContext, noOp} from './modules/Utils'
import GameLoop from './modules/GameLoop'

interface Options {
    autoClear?: boolean
    backgroundColor?: string
    canvas?: HTMLCanvasElement
    imageSmoothing?: boolean
    size?: { height: number, width: number }
    updatesPerSecond?: number
}

interface Hooks {
    render: () => void
    start: () => void
    stop: () => void
    update: (deltaTime: number) => void
}

export default class AG2D {
    autoClear: boolean = true
    backgroundColor: string = 'transparent'
    canvas: HTMLCanvasElement = document.createElement('canvas')
    context: CanvasRenderingContext2D = getContext(this.canvas)
    hooks: Hooks = {
        render: noOp,
        start: noOp,
        stop: noOp,
        update: noOp
    }
    imageSmoothing: boolean = false
    size: { height: number, width: number } = { height: 150, width: 300 }
    updatesPerSecond: number = 60

    private _bounds: { height: number, width: number } = { height: 150, width: 300 }
    private _gameLoop: GameLoop = new GameLoop({
        render: () => { this._render() },
        update: deltaTime => { this._update(deltaTime)},
        updatesPerSecond: 60
    })
    private _ratio: number = 1

    private _clearCanvas () {
        this.context.clearRect(0, 0, this.size.width, this.size.height)

        if (this.backgroundColor !== 'transparent') {
            this.context.fillStyle = this.backgroundColor
            this.context.fillRect(0, 0, this.size.width, this.size.height)
        }
    }

    configure (options: Options) {
        if (options.autoClear) { this.autoClear = options.autoClear }

        if (options.backgroundColor) { this.backgroundColor = options.backgroundColor }

        if (options.canvas) {
            this.canvas = options.canvas
            this.context = getContext(options.canvas)
            this.resizeCanvas(this.size.width, this.size.height)
        }

        if (options.imageSmoothing) {
            this.imageSmoothing = options.imageSmoothing
            this.context.imageSmoothingEnabled = options.imageSmoothing
        }

        if (options.size) {
            this.size = options.size
            this._bounds = options.size
            this.resizeCanvas(options.size.width, options.size.height)
        }

        if (options.updatesPerSecond) {
            this.updatesPerSecond = options.updatesPerSecond
            this._gameLoop.stop()
            this._gameLoop = new GameLoop({
                render: () => { this._render() },
                update: (deltaTime) => { this._update(deltaTime) },
                updatesPerSecond: options.updatesPerSecond
            })
        }
    }

    private _render () {
        this.context.save()
        this.context.scale(window.devicePixelRatio * this._ratio, window.devicePixelRatio * this._ratio)

        if (this.autoClear) this._clearCanvas()

        this.hooks.render()
        this.context.restore()
    }

    resizeCanvas (width: number, height: number) {
        const ratio = this.size.width / this.size.height
        const destRatio = width / height

        let destWidth = destRatio > ratio ? Math.floor(height * ratio) : width
        let destHeight = destRatio < ratio ? Math.floor(width / ratio) : height

        this._bounds = { height: destHeight, width: destWidth}
        this._ratio = destWidth / this.size.width
        this.canvas.setAttribute('height', Math.round(destHeight * window.devicePixelRatio).toString())
        this.canvas.setAttribute('width', Math.round(destWidth * window.devicePixelRatio).toString())
        this.canvas.style.height = `${destHeight}px`
        this.canvas.style.width = `${destWidth}px`
        this.context.imageSmoothingEnabled = this.imageSmoothing
    }

    start () {
        this.hooks.start()
        this._gameLoop.start()
    }

    stop () {
        this.hooks.stop()
        this._gameLoop.stop()
    }

    private _update (deltaTime: number) {
        this.hooks.update(deltaTime)
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
