/**
 * GameLoop
 *
 * @desc A Game Loop
 */

interface Options {
    updatesPerSecond: number
    render: () => void
    update: (deltaTime: number) => void
}

// Class: GameLoop
export default class GameLoop {
    private _update: (time: number) => void
    private _lastUpdate: number = 0
    private _accumulator: number = 0

    constructor (options: Options = {
        updatesPerSecond: 60,
        render: () => {},
        update: () => {}
    }) {
        options.updatesPerSecond = 1000 / options.updatesPerSecond

        this._update = (time: number = window.performance.now()) => {
            this._accumulator += time - this._lastUpdate

            while (this._accumulator > options.updatesPerSecond) {
                options.update(options.updatesPerSecond)
                this._accumulator -= options.updatesPerSecond
            }

            this._lastUpdate = time
            options.render()
            this.enqueue()
        }
    }

    private enqueue () { window.requestAnimationFrame(this._update) }

    start () { this.enqueue() }
}
