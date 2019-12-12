/**
 * Scenes: SceneTile
 */

import experience from '../experience';
import {Scene} from '../modules/ag2d/index';
import ExampleSpriteSheet from '../spritesheets/example';

export default class SceneTile extends Scene {

    constructor () {
        super('SceneTile');

        this.spriteSheet = ExampleSpriteSheet;
    }

    render () {
        this.spriteSheet.render('0', experience.context, 0, 0);
    }
}
