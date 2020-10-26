/**
 * Scenes: SceneTile
 */

import game from '../game'
import {Scene, SpriteSheet} from '../modules/ag2d/index'
import ExampleSpriteSheet from '../spritesheets/example'

export default class SceneTile extends Scene {
	spriteSheet: SpriteSheet

	constructor () {
		super()
		this.name = 'SceneTile'
		this.spriteSheet = ExampleSpriteSheet
	}

	render () { this.spriteSheet.render(game.context, '0', 0, 0) }
}
