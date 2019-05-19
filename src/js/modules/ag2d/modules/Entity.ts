/**
 * Modules: Entity
 */

import Trait from './Trait';

export default class Entity {
    [key:string]: any;
    traits: Array<Trait>;

    constructor () {
        this.traits = [];
    }

    addTrait (trait: Trait) {
        this.traits.push(trait);
        this[trait.name] = trait;
    }

    removeTrait (traitName: string) {
        this.traits = this.traits.filter(trait => trait.name !== traitName);
        delete this[traitName];
    }

    render (context: CanvasRenderingContext2D) {
        this.traits.forEach(trait => {
            trait.render(this, context);
        });
    }

    update (deltaTime: number) {
        this.traits.forEach(trait => {
            trait.update(this, deltaTime);
        });
    }
}
