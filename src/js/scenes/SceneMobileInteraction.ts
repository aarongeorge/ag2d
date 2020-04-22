/**
 * SceneMobileInteraction
 */

import experience, { audioManager, sceneManager } from '../experience'
import { Scene } from '../modules/ag2d/index'

export default class SceneMobileInteraction extends Scene {

    constructor () { super('SceneMobileInteraction') }

    render () {

        // Red background
		experience.context.fillStyle = '#FF0000'

        experience.context.fillRect(0, 0, experience.size.width, experience.size.height)

        // Scene name
        experience.context.textAlign = 'center'
        experience.context.textBaseline = 'middle'
        experience.context.strokeStyle = 'black'
        experience.context.lineWidth = 1
		experience.context.lineJoin = 'round'

		experience.context.strokeText('Tap to start', experience.size.width / 2, experience.size.height / 2)

		experience.context.fillStyle = 'white'

        experience.context.fillText('Tap to start', experience.size.width / 2, experience.size.height / 2)
    }
	enter () {
		super.enter()
		this.enterCount === 0 ? audioManager.init().then(() => { sceneManager.goTo('SceneLoading') }) : sceneManager.goTo('SceneStart')
	}
}
