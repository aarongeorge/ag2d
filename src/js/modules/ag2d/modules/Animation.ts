/**
 * Animation
 *
 * @desc Animation for AnimatorManager
 */

import {noOp} from './Utils';

export default class Animation {
    constructor (options) {

        // Store reference to current time
        const currentTime = window.performance.now();

        // Set options
        this.fps = options.fps;
        this.frames = Object.prototype.toString.call(options.frames) === '[object Array]' ? options.frames : typeof options.frames === 'number' ? Array.from(Array(options.frames).keys()) : 0;
        this.loop = typeof options.loop === 'boolean' ? options.loop : true;
        this.loopType = options.loopType || 'normal';
        this.name = options.name;
        this.pauseCb = options.pauseCb || noOp;
        this.resetCb = options.resetCb || noOp;
        this.restartCb = options.restartCb || noOp;
        this.reverse = typeof options.loop === 'boolean' ? options.reverse : false;
        this.spriteSheet = options.spriteSheet;
        this.startCb = options.startCb || noOp;
        this.stopCb = options.stopCb || noOp;

        // Set defaults
        this.animate = false;
        this.currentFrameIndex = this.getStartFrameIndex();
        this.interval = 1000 / options.fps;
        this.lastDraw = currentTime;
        this.lastUpdate = currentTime;
    }

    getCurrentFrameIndex () {
        return this.currentFrameIndex;
    }

    getEndFrameIndex () {
        return this.reverse ? 0 : this.frames.length - 1;
    }

    updateCurrentFrameIndex () {
        if (this.loop) {
            switch (this.loopType) {
                case 'yoyo': {
                    if (this.getCurrentFrameIndex() === this.getEndFrameIndex()) {
                        this.reverse = !this.reverse;
                        if (!this.reverse) {
                            this.restart();
                        }
                    }

                    this.currentFrameIndex = this.reverse ? this.currentFrameIndex - 1 : this.currentFrameIndex + 1;
                    break;
                }

                default: {
                    if (this.getCurrentFrameIndex() === this.getEndFrameIndex()) {
                        this.restart();
                    }

                    else {
                        this.currentFrameIndex = this.reverse ? this.currentFrameIndex - 1 : this.currentFrameIndex + 1;
                    }
                }
            }
        }

        else if (this.getCurrentFrameIndex() === this.getEndFrameIndex()) {
            this.stop();
        }

        else {
            this.currentFrameIndex = this.reverse ? this.currentFrameIndex - 1 : this.currentFrameIndex + 1;
        }
    }

    getStartFrameIndex () {
        return this.reverse ? this.frames.length - 1 : 0;
    }

    pause () {
        this.animate = false;
        this.pauseCb();
    }

    render (context, x, y, width = this.spriteSheet.frameWidth, height = this.spriteSheet.frameHeight, cropWidth = this.spriteSheet.frameWidth, cropHeight = this.spriteSheet.frameHeight) {
        const row = Math.floor(this.frames[this.currentFrameIndex] / this.spriteSheet.columns);
        const col = Math.floor(this.frames[this.currentFrameIndex] % this.spriteSheet.columns);

        context.drawImage(this.spriteSheet.image, col * this.spriteSheet.frameWidth, row * this.spriteSheet.frameHeight, cropWidth, cropHeight, x, y, width, height);
    }

    reset () {
        this.currentFrameIndex = this.getStartFrameIndex();
        this.animate = false;
        this.resetCb();
    }

    restart () {
        this.currentFrameIndex = this.getStartFrameIndex();
        this.animate = true;
        this.restartCb();
    }

    start () {
        this.animate = true;
        this.startCb();
    }

    stop () {
        this.animate = false;
        this.stopCb();
    }

    update (deltaTime) {
        if (!this.animate) {
            return;
        }

        const drawDeltaTime = this.lastUpdate - this.lastDraw;

        if (drawDeltaTime > this.interval) {
            this.updateCurrentFrameIndex();
            this.lastDraw = this.lastUpdate - drawDeltaTime % this.interval;
        }

        this.lastUpdate += deltaTime;
    }
}
