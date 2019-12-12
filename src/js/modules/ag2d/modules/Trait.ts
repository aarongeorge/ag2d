import Entity from './Entity';

export default class Trait {
    name: string;

    // Constructor
    constructor (name: string) {
        this.name = name;
    }

    // Method: render
    public render (entity: Entity, context: CanvasRenderingContext2D) {
    }

    // Method: update
    public update (entity: Entity, deltaTime: number) {
    }
}
