/**
 * Animations: Example
 */

import { SpriteSheetAnimation } from '../modules/ag2d/index'
import ExampleSpriteSheet from '../spritesheets/example'

class ExampleAnimation extends SpriteSheetAnimation {
    constructor () {
        super({
            fps: 5,
            frames: ['1', '3', '3', '7'],
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
