import Trait from '../../modules/ag2d/modules/Trait';
import Entity from '../../modules/ag2d/modules/Entity';

export default class TraitWalk extends Trait {
    dir: -1 | 0 | 1;
    speed: number;

    constructor (options) {
        super('Walk');

        this.dir = 0;
        this.speed = 0.005;

        options.keyManager.addMapping('ArrowLeft', (keyState: 0 | 1) => {
            if (keyState) {
                this.dir = -1;
                return;
            }
            this.dir = 0;
        });

        options.keyManager.addMapping('KeyA', (keyState: 0 | 1) => {
            if (keyState) {
                this.dir = -1;
                return;
            }
            this.dir = 0;
        });

        options.keyManager.addMapping('ArrowRight', (keyState: 0 | 1) => {
            if (keyState) {
                this.dir = 1;
                return;
            }
            this.dir = 0;
        });

        options.keyManager.addMapping('KeyD', (keyState: 0 | 1) => {
            if (keyState) {
                this.dir = 1;
                return;
            }
            this.dir = 0;
        });
    }

    update (entity: Entity, deltaTime: number) {
        entity.vel.x = this.speed * this.dir * deltaTime;
    }
}
