import Trait from '../../modules/ag2d/modules/Trait';
import Entity from '../../modules/ag2d/modules/Entity';

export default class TraitJump extends Trait {
    duration: number;
    engageTime: number;
    velocity: number;

    constructor (options) {
        super('Jump');

        this.duration = 500;
        this.engageTime = 0;
        this.velocity = 0.01;

        options.keyManager.addMapping('Space', (keyState: 0 | 1) => {
            if (keyState) {
                this.start();
            }
            else {
                this.cancel();
            }
        });
    }

    start () {
        this.engageTime = this.duration;
    }

    cancel () {
        this.engageTime = 0;
    }

    update (entity: Entity, deltaTime: number) {
        entity.vel.y += entity.gravity.y;

        if (this.engageTime > 0) {
            entity.vel.y = -this.velocity * deltaTime;
            this.engageTime -= deltaTime;
        }

        entity.pos.x += entity.vel.x * deltaTime;
        entity.pos.y += entity.vel.y * deltaTime;
    }
}
