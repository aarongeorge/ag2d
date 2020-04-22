/**
 * SpriteSheetAnimation
 *
 * @desc Animation for AnimatorManager
 */

import {noOp} from './Utils'
import SpriteSheet from './SpriteSheet'

interface Options {
	fps: number
	frames: string[]
	loop: boolean
	loopType: 'normal' | 'yoyo'
	name: string
	pauseCb?: () => void
	resetCb?: () => void
	restartCb?: () => void
	reverse: boolean
	spriteSheet: SpriteSheet
	startCb?: () => void
	stopCb?: () => void
}

export default class SpriteSheetAnimation {
	animate: boolean
	currentFrameIndex: number
	fps: number
	frames: string[]
	interval: number
	lastDraw: number
	lastUpdate: number
	loop: boolean
	loopType: 'normal' | 'yoyo'
	name: string
	pauseCb: () => void
	resetCb: () => void
	restartCb: () => void
	reverse: boolean
	spriteSheet: SpriteSheet
	startCb: () => void
	stopCb: () => void

    constructor (options: Options) {
        const currentTime = window.performance.now()

        this.fps = options.fps
        this.frames = options.frames
        this.loop = typeof options.loop === 'boolean' ? options.loop : true
        this.loopType = options.loopType || 'normal'
        this.name = options.name
        this.pauseCb = options.pauseCb || noOp
        this.resetCb = options.resetCb || noOp
        this.restartCb = options.restartCb || noOp
        this.reverse = typeof options.loop === 'boolean' ? options.reverse : false
        this.spriteSheet = options.spriteSheet
        this.startCb = options.startCb || noOp
        this.stopCb = options.stopCb || noOp
        this.animate = false
        this.currentFrameIndex = this.getStartFrameIndex()
        this.interval = 1000 / options.fps
        this.lastDraw = currentTime
        this.lastUpdate = currentTime
    }

    getCurrentFrameIndex () { return this.currentFrameIndex }
    getEndFrameIndex () { return this.reverse ? 0 : this.frames.length - 1 }
    updateCurrentFrameIndex () {
        if (this.loop) {
            switch (this.loopType) {
                case 'yoyo': {
                    if (this.getCurrentFrameIndex() === this.getEndFrameIndex()) {
                        this.reverse = !this.reverse
                        if (!this.reverse) this.restart()
                    }

                    this.currentFrameIndex = this.reverse ? this.currentFrameIndex - 1 : this.currentFrameIndex + 1
                    break
                }

                default: {
                    if (this.getCurrentFrameIndex() === this.getEndFrameIndex()) this.restart()
                    else this.currentFrameIndex = this.reverse ? this.currentFrameIndex - 1 : this.currentFrameIndex + 1
                }
            }
        }
        else if (this.getCurrentFrameIndex() === this.getEndFrameIndex()) this.stop()
        else this.currentFrameIndex = this.reverse ? this.currentFrameIndex - 1 : this.currentFrameIndex + 1
    }
    getStartFrameIndex () { return this.reverse ? this.frames.length - 1 : 0 }
    pause () {
        this.animate = false
        this.pauseCb()
    }
    render (context: CanvasRenderingContext2D, x: number, y: number) { this.spriteSheet.renderTile(context, this.frames[this.getCurrentFrameIndex()], x, y) }
    reset () {
        this.currentFrameIndex = this.getStartFrameIndex()
        this.animate = false
        this.resetCb()
    }
    restart () {
        this.currentFrameIndex = this.getStartFrameIndex()
        this.animate = true
        this.restartCb()
    }
    start () {
        this.animate = true
        this.startCb()
    }
    stop () {
        this.animate = false
        this.stopCb()
    }
    update (deltaTime: number) {
        if (!this.animate) return

        const drawDeltaTime = this.lastUpdate - this.lastDraw

        if (drawDeltaTime > this.interval) {
            this.updateCurrentFrameIndex()
            this.lastDraw = this.lastUpdate - drawDeltaTime % this.interval
        }

        this.lastUpdate += deltaTime
    }
}
