/**
 * Scenes: ScenePointer
 */

import game, {pointerManager} from '../game'
import {Scene} from '../modules/ag2d/index'
import {noOp} from '../modules/ag2d/modules/Utils'

export default class ScenePointer extends Scene {
	points: Set<any> = new Set()
	pointSize: number = 2

	constructor () {
		super()
		this.name = 'ScenePointer'
	}

	enter () {
		super.enter()
		game.backgroundColor = 'transparent'

		pointerManager.down = point => this.points.add(point)
		pointerManager.move = point => this.points.add(point)
		pointerManager.up = point => this.points.add(point)
	}

	exit () {
		super.exit()
		game.backgroundColor = '#000000'

		// Stops adding points to the array on other scenes
		pointerManager.down = noOp
		pointerManager.move = noOp
		pointerManager.up = noOp

		this.points.clear()
	}

	render () {
		// Go through all the points
		this.points.forEach(point => {
			let color = 'transparent'

			// Save the context because we're lazy
			game.context.save()
			if (point.isDown && point.isStarted) {
				color = `hsl(${point.x / game.size.width * 360 | 0}deg, ${point.y / game.size.height * 100 | 0}%, ${point.y / game.size.height * 100 | 0}%)`
			}
			game.context.fillStyle = color
			game.context.fillRect(Math.random() + point.x - (this.pointSize / 2), Math.random() + point.y - (this.pointSize / 2), this.pointSize, this.pointSize)
			game.context.restore()
		})
	}
}
