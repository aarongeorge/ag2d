import Trait from '../../modules/ag2d/modules/Trait';
import Entity from '../../modules/ag2d/modules/Entity';

export default class TraitFlashing extends Trait {
    currentSprite: string;

    constructor () {
        super('Flashing');
        this.currentSprite = ((Math.random() * 8) | 0).toString();
    }

    public render (entity: Entity, context: CanvasRenderingContext2D) {
        entity.spriteSheet.render(this.currentSprite, context, entity.pos.x, entity.pos.y);
    }

    public update (entity: Entity, deltaTime: number) {
        this.currentSprite = ((Math.random() * 8) | 0).toString();
    }
}
