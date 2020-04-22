/**
 * Scenes: SceneFull
 */

import experience from '../experience'
import { Scene, SpriteSheet } from '../modules/ag2d/index'
import ExampleSpriteSheet from '../spritesheets/example'

export default class SceneFull extends Scene {
	spriteSheet: SpriteSheet

    constructor () {
		super('SceneFull')

		this.spriteSheet = ExampleSpriteSheet
    }

    render () { this.spriteSheet.render(experience.context, 'full', 0, 0) }
}
