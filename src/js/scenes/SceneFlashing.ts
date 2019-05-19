/**
 * Scenes: SceneFlashing
 */

import experience from '../experience';
import {Scene} from '../modules/ag2d/index';
import CharacterFlashing from '../characters/flashing';

export default class SceneFlashing extends Scene {

    constructor () {
        super('SceneFlashing');

        this.flashingCharacter = new CharacterFlashing();
    }

    render () {
        this.flashingCharacter.render(experience.context);
    }

    update (deltaTime) {
        this.flashingCharacter.update(deltaTime);
    }
}
