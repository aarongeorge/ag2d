/**
 * Scenes: SceneAllTheSame
 */

import experience from '../experience';
import {Scene} from '../modules/ag2d/index';
import ExampleSpriteSheet from '../spritesheets/example';

export default class SceneAllTheSame extends Scene {

    constructor () {
        super('SceneAllTheSame');

        this.spriteSheet = ExampleSpriteSheet;
    }

    render () {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                this.spriteSheet.render('1', experience.context, i * 32, j * 32);        
            }
        }
    }
}
