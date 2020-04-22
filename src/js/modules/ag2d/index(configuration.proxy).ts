/**
 * AG2D
 *
 * @desc A 2D game experience
 */

import {getContext, noOp} from './modules/Utils'
import GameLoop from './modules/GameLoop'

interface Constraints {
    height: number
    width: number
}

interface Configuration {
    autoClear: boolean
    backgroundColor: string
    canvas: HTMLCanvasElement
    imageSmoothing: boolean
    render: () => void
    size: Constraints
    start: () => void
    stop: () => void
    update: (deltaTime: number) => void
    updatesPerSecond: number
}

const configurationDefaults = {
    autoClear: true,
    backgroundColor: 'transparent',
    canvas: document.createElement('canvas'),
    imageSmoothing: false,
    render: noOp,
    size: { height: 150, width: 300 },
    start: noOp,
    stop: noOp,
    update: noOp,
    updatesPerSecond: 60
} as Configuration

export default class AG2D {
    private _bounds: Constraints = { height: 150, width: 300 }
    private _configuration: Configuration = Object.assign({}, configurationDefaults)
    private _gameLoop: GameLoop = new GameLoop({
        render: () => { this.render() },
        update: deltaTime => { this.update(deltaTime)},
        updatesPerSecond: 60
    })
    private _ratio: number = 1
    configuration: Configuration
    context: CanvasRenderingContext2D = getContext(this._configuration.canvas)

    constructor () {
        const _this = this

        this.configuration = new Proxy(this._configuration, {
            set (target: any, prop: string, val: any) {
                if (prop in target === false) return false

                switch (prop) {
                    case 'canvas': {
                        target[prop] = val
                        _this.context = getContext(target[prop])
                        _this.resizeCanvas(_this._configuration.size.width, _this._configuration.size.height)
                        break
                    }
                    case 'updatesPerSecond': {
                        target[prop] = val
                        _this._gameLoop.stop()
                        _this._gameLoop = new GameLoop({
                            updatesPerSecond: target[prop],
                            render: () => { _this.render() },
                            update: (deltaTime) => { _this.update(deltaTime) }
                        })
                        break
                    }
                    case 'size': {
                        target[prop] = val
                        _this._bounds = Object.assign({}, target[prop])
                        _this.resizeCanvas(_this._bounds.width, _this._bounds.height)
                        break
                    }
                    case 'imageSmoothing': {
                        target[prop] = val
                        _this.context.imageSmoothingEnabled = target[prop]
                        break
                    }
                    default: {
                        target[prop] = val
                    }
                }

                return true
            }
        })
    }

    private clearCanvas () {
        this.context.clearRect(0, 0, this._configuration.size.width, this._configuration.size.height)

        if (this._configuration.backgroundColor !== 'transparent') {
            this.context.fillStyle = this._configuration.backgroundColor
            this.context.fillRect(0, 0, this._configuration.size.width, this._configuration.size.height)
        }
    }

    private render () {
        this.context.save()
        this.context.scale(window.devicePixelRatio * this._ratio, window.devicePixelRatio * this._ratio)

        if (this._configuration.autoClear) this.clearCanvas()

        this._configuration.render()
        this.context.restore()
    }

    start () {
        this._configuration.start()
        this._gameLoop.start()
    }

    stop () {
        this._configuration.stop()
        this._gameLoop.stop()
    }

    private update (deltaTime: number) {
        this._configuration.update(deltaTime)
    }

    resizeCanvas (width: number, height: number) {
        const ratio = this._configuration.size.width / this._configuration.size.height
        const destRatio = width / height

        let destWidth = destRatio > ratio ? Math.floor(height * ratio) : width
        let destHeight = destRatio < ratio ? Math.floor(width / ratio) : height

        this._bounds = { height: destHeight, width: destWidth}
        this._ratio = destWidth / this._configuration.size.width
        this._configuration.canvas.setAttribute('height', Math.round(destHeight * window.devicePixelRatio).toString())
        this._configuration.canvas.setAttribute('width', Math.round(destWidth * window.devicePixelRatio).toString())
        this._configuration.canvas.style.height = `${destHeight}px`
        this._configuration.canvas.style.width = `${destWidth}px`
        this.context.imageSmoothingEnabled = this._configuration.imageSmoothing
    }
}

export {default as Animation} from './modules/SpriteSheetAnimation'
export {default as AnimationManager} from './modules/AnimationManager'
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
