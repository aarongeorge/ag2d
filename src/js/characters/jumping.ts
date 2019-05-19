/**
 * Characters: Jumping
 */

import Entity from '../modules/ag2d/modules/Entity';
import ExampleSpriteSheet from '../spritesheets/example';
import {Vec2} from '../modules/ag2d/index';
import TraitJump from './traits/Jump';
import TraitNumberTile from './traits/NumberTile';

export default class Jumping extends Entity {

    constructor (options) {
        super();
        this.spriteSheet = ExampleSpriteSheet;
        this.pos = new Vec2(0, 128);
        this.vel = new Vec2(0, 0);
        this.gravity = new Vec2(0, 0.005);

        this.addTrait(new TraitNumberTile(options));
        this.addTrait(new TraitJump(options);
    }
}
