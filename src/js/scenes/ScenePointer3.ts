/**
 * Scenes: ScenePointer
 */

import game, {pointerManager} from '../game'
import {Scene} from '../modules/ag2d/index'

export default class ScenePointer3 extends Scene {
	pointSize: number = 2

	constructor () {
		super()
		this.name = 'ScenePointer3'
	}

	enter () {
		super.enter()

		// Disable auto clear
		game.autoClear = false

		// Manually scaling up and wiping the canvas
		game.context.save()
		game.context.scale(Math.ceil(window.devicePixelRatio * game.ratio), Math.ceil(window.devicePixelRatio * game.ratio))
		game.clearCanvas(true)
		game.context.restore()
	}

	exit () {
		super.exit()

		// Re-enable auto clear
		game.autoClear = true
	}

	render () {

		// Go through all the points
		pointerManager.points.forEach(point => {

			if (!point.isDown) return

			// Save the context because we're lazy
			game.context.save()
			game.context.fillStyle = `hsl(${point.x / game.size.width * 360 | 0}deg, ${point.y / game.size.height * 100 | 0}%, ${point.y / game.size.height * 100 | 0}%)`
			game.context.fillRect(point.x - (this.pointSize / 2), point.y - (this.pointSize / 2), this.pointSize, this.pointSize)
			game.context.restore()
		})
	}
}
