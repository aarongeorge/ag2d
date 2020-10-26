import { SpriteSheetAnimation, Trait } from '../../modules/ag2d/index'
import ExampleAnimation from '../../animations/example'

export default class Flashing extends Trait {
	animation: SpriteSheetAnimation

	constructor () {
		super('Flashing')

		this.animation = new ExampleAnimation()

		this.animation.start()
	}

	render (context: CanvasRenderingContext2D) { this.animation.render(context, 0, 0) }
	update (deltaTime: number) { this.animation.update(deltaTime) }
}
