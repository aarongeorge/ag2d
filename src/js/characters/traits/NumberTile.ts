import Trait from '../../modules/ag2d/modules/Trait';
import Entity from '../../modules/ag2d/modules/Entity';

export default class TraitNumberTile extends Trait {
    constructor () {
        super('NumberTile');
    }

    render (entity: Entity, context: CanvasRenderingContext2D) {
        entity.spriteSheet.render('3', context, entity.pos.x, entity.pos.y);
    }
}
