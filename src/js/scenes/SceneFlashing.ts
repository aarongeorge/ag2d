/**
 * Scenes: SceneFlashing
 */

import game from '../game'
import { Scene } from '../modules/ag2d/index'
import Flashing from '../characters/flashing'

export default class SceneFlashing extends Scene {
	character: Flashing

	constructor () {
		super()
		this.name = 'SceneFlashing'
		this.character = new Flashing()
	}

	render () { this.character.render(game.context) }
	update (deltaTime: number) { this.character.update(deltaTime) }
}
