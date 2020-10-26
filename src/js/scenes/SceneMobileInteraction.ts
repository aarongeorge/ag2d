/**
 * SceneMobileInteraction
 */

import game, {audioManager, sceneManager} from '../game'
import {Scene} from '../modules/ag2d/index'

export default class SceneMobileInteraction extends Scene {

	constructor () {
		super()
		this.name = 'SceneMobileInteraction'
	}

	render () {

		// Red background
		game.context.fillStyle = '#FF0000'

		game.context.fillRect(0, 0, game.size.width, game.size.height)

		// Scene name
		game.context.textAlign = 'center'
		game.context.textBaseline = 'middle'
		game.context.strokeStyle = 'black'
		game.context.lineWidth = 1
		game.context.lineJoin = 'round'

		game.context.strokeText('Tap to start', game.size.width / 2, game.size.height / 2)

		game.context.fillStyle = 'white'

		game.context.fillText('Tap to start', game.size.width / 2, game.size.height / 2)
	}
	enter () {
		super.enter()
		this.enterCount === 1 ? audioManager.init().then(() => {sceneManager.goTo('SceneLoading')}) : sceneManager.goTo('SceneStart')
	}
}
