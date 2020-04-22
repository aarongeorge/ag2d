/**
 * Scenes: SceneJumping
 */

import { Scene, SpriteSheet } from '../modules/ag2d/index'
import Jumping from '../characters/jumping'
import experience, { keyManager } from '../experience'
import Flashing from '../characters/flashing'

export default class SceneJumping extends Scene {
	character: Flashing

    constructor () {
		super('SceneJumping')

        this.character = new Flashing()
    }

    render () { this.character.render(experience.context) }
    update (deltaTime: number) { this.character.update(deltaTime) }
}
