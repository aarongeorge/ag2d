import Trait from './Trait'

export default class Entity {
    traits: Array<Trait>
    pos: {
        x: number
        y: number
    }
    vel: {
        x: number
        y: number
    }
    height: number
    width: number

    constructor () {
        this.traits = []
        this.pos = { x: 0, y: 0 }
        this.vel = { x: 0, y: 0 }
        this.width = 0
        this.height = 0
    }

    addTrait (trait: Trait) { this.traits.push(trait) }
    removeTrait (traitName: string) { this.traits = this.traits.filter(trait => trait.name !== traitName) }
    render (context: CanvasRenderingContext2D) { this.traits.forEach(trait => { trait.render(context, this) }) }
    update (deltaTime: number) { this.traits.forEach(trait => { trait.update(deltaTime, this) }) }
}
