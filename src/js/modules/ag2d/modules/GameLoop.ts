/**
 * GameLoop
 *
 * @desc A Game Loop
 */

import {noOp} from './Utils'

interface Configuration {
    updatesPerSecond: number
    render: () => void
    update: (deltaTime: number) => void
}

const configurationDefaults = {
    updatesPerSecond: 60,
    render: noOp,
    update: noOp
} as Configuration

// Class: GameLoop
export default class GameLoop {
    private _accumulator: number = 0
    private _configuration: Configuration = Object.assign({}, configurationDefaults)
    private _lastUpdate: number = window.performance.now()
    private _requestId?: number
    private _tickRate: number = 1000 / configurationDefaults.updatesPerSecond

    constructor (configuration: Configuration = Object.assign({}, configurationDefaults)) {
        this._configuration = configuration
        this._tickRate = 1000 / this._configuration.updatesPerSecond
        this.update = this.update.bind(this)
    }

    private update (time: number = window.performance.now()) {
        this._accumulator += time - this._lastUpdate

        while (this._accumulator > this._tickRate) {
            this._configuration.update(this._tickRate)
            this._accumulator -= this._tickRate
        }

        this._lastUpdate = time
        this._configuration.render()
        this._requestId = this.enqueue()
    }
    private enqueue () { return window.requestAnimationFrame(this.update) }

    start () { this.enqueue() }
    stop () { if (this._requestId) window.cancelAnimationFrame(this._requestId) }
}
