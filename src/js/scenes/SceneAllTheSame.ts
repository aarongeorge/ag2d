/**
 * Scenes: SceneAllTheSame
 */

import experience from '../experience'
import { Scene, SpriteSheet } from '../modules/ag2d/index'
import ExampleSpriteSheet from '../spritesheets/example'

export default class SceneAllTheSame extends Scene {
	spriteSheet: SpriteSheet

    constructor () {
        super('SceneAllTheSame')

        this.spriteSheet = ExampleSpriteSheet
    }

    render () {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) this.spriteSheet.render(experience.context, '1', i * 32, j * 32)
        }
    }
}
