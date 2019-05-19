/**
 * Animations: Example
 */

// Dependencies
import {Animation} from '../modules/ag2d/index';

// Class: Example Animation
class ExampleAnimation extends Animation {
    constructor (spriteSheet) {
        super({
            'fps': 5,
            'frames': 25,
            'loop': true,
            'loopType': 'yoyo',
            'name': 'example',
            'restartCb': () => {
                console.log('restart');
            },
            'reverse': true,
            spriteSheet
        });
    }
}

// Export `ExampleAnimation`
export default ExampleAnimation;
