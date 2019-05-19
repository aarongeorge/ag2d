/**
 * Characters: Colliding
 */

import Entity from '../modules/ag2d/modules/Entity';
import ExampleSpriteSheet from '../spritesheets/example';
import {Vec2} from '../modules/ag2d/index';
import TraitNumberTile from './traits/NumberTile';
import TraitJump from './traits/Jump';
import TraitWalk from './traits/Walk';
import experience from '../experience';

export default class Colliding extends Entity {

    constructor (options) {
        super();
        this.spriteSheet = ExampleSpriteSheet;
        this.pos = new Vec2(128, 128);
        this.width = 32;
        this.height = 32;
        this.vel = new Vec2(0, 0);
        this.gravity = new Vec2(0, 0.005);

        options.eventHandler.addEvent({
            'element': options.canvas,
            'callback': this.updatePos.bind(this),
            'name': 'Drag',
            'type': 'click'
        });

        options.eventHandler.addEvent({
            'element': options.canvas,
            'callback': this.updatePos.bind(this),
            'name': 'Click',
            'type': 'mousemove'
        });

        options.entity = this;

        this.addTrait(new TraitNumberTile(options));
        this.addTrait(new TraitJump(options));
        this.addTrait(new TraitWalk(options));
    }

    updatePos (event: MouseEvent | KeyboardEvent) {
        if (event.type === 'mousemove') {
            if (event.buttons === 0) {
                return;
            }
        }
        this.pos.x = event.x / experience.ratio;
        this.pos.y = event.y / experience.ratio;
    }
}
