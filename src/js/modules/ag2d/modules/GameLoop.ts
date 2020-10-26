/**
 * GameLoop
 *
 * @desc A Game Loop
 */
import {noOp} from './Utils'

interface Configuration {
	updatesPerSecond: number
	render: (alpha: number) => void
	update: (deltaTime: number) => void
}

const configurationDefaults = {
	updatesPerSecond: 60,
	render: noOp,
	update: noOp
} as Configuration

export default class GameLoop {
	private _accumulator: number = 0
	private _configuration: Configuration = Object.assign({}, configurationDefaults)
	private _lastUpdate: number = 0
	private _requestId?: number
	private _tickRate: number = 1000 / configurationDefaults.updatesPerSecond

	constructor (configuration: Configuration = configurationDefaults) {
		this._configuration = Object.assign(configurationDefaults, configuration)
		this._tickRate = 1000 / this._configuration.updatesPerSecond
		this.update = this.update.bind(this)
	}
	private update (time: number = window.performance.now()) {
		this._requestId = window.requestAnimationFrame(this.update)
		this._accumulator += Math.min(time - this._lastUpdate, this._tickRate)

		while (this._accumulator > this._tickRate) {
			this._configuration.update(this._tickRate)
			this._accumulator -= this._tickRate
		}

		this._configuration.render(this._accumulator / this._tickRate)
		this._lastUpdate = time
	}
	start () {
		this._lastUpdate = window.performance.now()
		this._requestId = window.requestAnimationFrame(this.update)
	}
	stop () { if (this._requestId) window.cancelAnimationFrame(this._requestId) }
}
