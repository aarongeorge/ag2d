/**
 * Scenes: SceneFull
 */

import experience from '../experience';
import {Scene} from '../modules/ag2d/index';
import ExampleSpriteSheet from '../spritesheets/example';

export default class SceneFull extends Scene {

    constructor () {
        super('SceneFull');

        this.spriteSheet = ExampleSpriteSheet;
    }

    render () {
        this.spriteSheet.render('full', experience.context, 0, 0);
    }
}
