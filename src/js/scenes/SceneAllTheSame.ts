/**
 * Scenes: SceneAllTheSame
 */

import game from '../game'
import { Scene, SpriteSheet } from '../modules/ag2d/index'
import ExampleSpriteSheet from '../spritesheets/example'

export default class SceneAllTheSame extends Scene {
	spriteSheet: SpriteSheet

	constructor () {
		super()
		this.name = 'SceneAllTheSame'
		this.spriteSheet = ExampleSpriteSheet
	}

	render () {
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) this.spriteSheet.render(game.context, '1', i * 32, j * 32)
		}
	}
}
