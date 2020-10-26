/**
 * Animations: Example
 */

import { SpriteSheetAnimation } from '../modules/ag2d/index'
import ExampleSpriteSheet from '../spritesheets/example'

class ExampleAnimation extends SpriteSheetAnimation {
	constructor () {
		super({
			fps: 10,
			frames: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
			loop: true,
			loopType: 'yoyo',
			name: 'example',
			restartCb: () => console.log('restart'),
			reverse: true,
			spriteSheet: ExampleSpriteSheet
		})
	}
}

export default ExampleAnimation
