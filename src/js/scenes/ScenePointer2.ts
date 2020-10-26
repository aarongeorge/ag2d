/**
 * Scenes: ScenePointer
 */

import game, {pointerManager} from '../game'
import {Scene} from '../modules/ag2d/index'
import {noOp} from '../modules/ag2d/modules/Utils'

export default class ScenePointer2 extends Scene {
	points: Set<any> = new Set()
	pointSize: number = 2

	constructor () {
		super()
		this.name = 'ScenePointer2'
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

		// Setting the event handlers to add the points to our set
		pointerManager.down = point => this.points.add(point)
		pointerManager.move = point => this.points.add(point)
		pointerManager.up = point => this.points.add(point)
	}

	exit () {
		super.exit()

		// Re-enable auto clear
		game.autoClear = true

		// Stops adding points to the array on other scenes
		pointerManager.down = noOp
		pointerManager.move = noOp
		pointerManager.up = noOp

		// Empty out the points array
		this.points.clear()
	}

	render () {

		// Go through all the points
		this.points.forEach(point => {
			let color = 'transparent'

			// Save the context because we're lazy
			game.context.save()
			if (point.isDown && !point.isStarted) color = 'green'
			if (point.isDown && point.isStarted) {
				color = `hsl(${point.x / game.size.width * 360 | 0}deg, ${point.y / game.size.height * 100 | 0}%, ${point.y / game.size.height * 100 | 0}%)`
				game.context.globalCompositeOperation = 'destination-over'
			}
			if (!point.isDown && point.isStarted) color = 'red'
			game.context.fillStyle = color
			game.context.fillRect(point.x - (this.pointSize / 2), point.y - (this.pointSize / 2), this.pointSize, this.pointSize)
			game.context.restore()

			// Delete the point from the array as we're only rendering it once
			this.points.delete(point)
		})
	}
}
