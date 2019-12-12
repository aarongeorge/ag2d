/**
 * Characters: Flashing
 */

import ExampleSpriteSheet from '../spritesheets/example';
import Entity from '../modules/ag2d/modules/Entity';
import TraitFlashing from './traits/Flashing';

export default class Flashing extends Entity {

    constructor () {
        super();

        this.spriteSheet = ExampleSpriteSheet;
        this.addTrait(new TraitFlashing());
    }
}
