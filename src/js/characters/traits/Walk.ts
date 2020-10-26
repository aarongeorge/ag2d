import Trait from '../../modules/ag2d/modules/Trait'
import Entity from '../../modules/ag2d/modules/Entity'
import KeyManager from '../../modules/ag2d/modules/KeyManager'

export default class TraitWalk extends Trait {
	dir: -1 | 0 | 1
	speed: number

	constructor (options: {
		keyManager: KeyManager
	}) {
		super('Walk')

		this.dir = 0
		this.speed = 0.005

		options.keyManager.addMapping('ArrowLeft', isDown => this.dir = isDown ? -1 : 0)
		options.keyManager.addMapping('KeyA', isDown => this.dir = isDown ? -1 : 0)
		options.keyManager.addMapping('ArrowRight', isDown => this.dir = isDown ? 1 : 0)
		options.keyManager.addMapping('KeyD', isDown => this.dir = isDown ? 1 : 0)
	}

	update (deltaTime: number, entity: Entity) { entity.vel.x = this.speed * this.dir * deltaTime }
}
