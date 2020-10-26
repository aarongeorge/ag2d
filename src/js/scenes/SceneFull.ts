/**
 * Scenes: SceneFull
 */

import game from '../game'
import { Scene, SpriteSheet } from '../modules/ag2d/index'
import ExampleSpriteSheet from '../spritesheets/example'

export default class SceneFull extends Scene {
	spriteSheet: SpriteSheet

	constructor () {
		super()
		this.name = 'SceneFull'
		this.spriteSheet = ExampleSpriteSheet
	}

	enter () {
		super.enter()
	}

	exit () {
		super.exit()
	}

	render () {
		this.spriteSheet.render(game.context, 'full', 0, 0)
	}
}
