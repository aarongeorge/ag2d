/**
 * Scenes: SceneFlashing
 */

import experience from '../experience'
import { Scene } from '../modules/ag2d/index'
import Flashing from '../characters/flashing'

export default class SceneFlashing extends Scene {
	character: Flashing

    constructor () {
        super('SceneFlashing')

        this.character = new Flashing()
    }

    render () { this.character.render(experience.context) }
    update (deltaTime: number) { this.character.update(deltaTime) }
}
