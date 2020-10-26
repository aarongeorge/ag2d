/**
 * Scenes: SceneJumping
 */

import { Scene } from '../modules/ag2d/index'
import Jumping from '../characters/jumping'
import game, { keyManager } from '../game'

export default class SceneJumping extends Scene {
	character: Jumping

	constructor () {
		super()
		this.name = 'SceneJumping'
		this.character = new Jumping({keyManager})
	}

	enter () {
		super.enter()
		console.log('Jumping')
	}

	render () { this.character.render(game.context) }
	update (deltaTime: number) { this.character.update(deltaTime) }
}
