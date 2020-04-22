import Entity from './Entity'

export default class Trait {
    name: string

    constructor (name: string) { this.name = name}

    public render (context: CanvasRenderingContext2D, entity: Entity) {}
    public update (deltaTime: number, entity: Entity) {}
}
