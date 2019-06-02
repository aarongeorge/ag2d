/**
 * Scenes: SceneJumping
 */

import {Scene} from '../modules/ag2d/index';
import Jumping from '../characters/jumping';
import experience, {keyManager} from '../experience';
import ExampleSpriteSheet from '../spritesheets/example';

export default class SceneJumping extends Scene {

    constructor () {
        super('SceneJumping');
        this.spriteSheet = ExampleSpriteSheet;
    }

    enter () {
        this.entities = new Set();
        this.entities.add(new Jumping({keyManager}));
    }

    render () {
        this.entities.forEach(entity => {
            entity.render(experience.context);
        });
    }

    update (deltaTime) {
        this.entities.forEach(entity => {
            entity.update(deltaTime);
        })
    }
}
