/**
 * SceneStart
 */

import experience, {
    eventHandler,
    sceneManager
} from '../experience';
import {Scene} from '../modules/ag2d/index';

export default class SceneStart extends Scene {

    constructor () {
        super('SceneStart');
    }

    render () {

        // Red background
        experience.context.fillStyle = '#FF0000';
        experience.context.fillRect(0, 0, experience.size.width, experience.size.height);

        // Scene name
        experience.context.textAlign = 'center';
        experience.context.textBaseline = 'middle';
        experience.context.strokeStyle = 'black';
        experience.context.lineWidth = 1;
        experience.context.lineJoin = 'round';
        experience.context.strokeText('Click to start', experience.size.width / 2, experience.size.height / 2);
        experience.context.fillStyle = 'white';
        experience.context.fillText('Click to start', experience.size.width / 2, experience.size.height / 2);
    }

    enter () {
        eventHandler.addEvent({
            'element': experience.canvas,
            'callback': () => {
                sceneManager.next();
            },
            'name': 'SceneStartInteraction',
            'type': 'click'
        });
    }

    exit () {
        eventHandler.removeEvent('SceneStartInteraction');
    }
}
