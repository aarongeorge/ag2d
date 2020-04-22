/**
 * Scenes: SceneTile
 */

import experience from '../experience'
import {Scene, SpriteSheet} from '../modules/ag2d/index'
import ExampleSpriteSheet from '../spritesheets/example'

export default class SceneTile extends Scene {
	spriteSheet: SpriteSheet

    constructor () {
        super('SceneTile')

        this.spriteSheet = ExampleSpriteSheet
    }

    render () { this.spriteSheet.render(experience.context, '0', 0, 0) }
}
