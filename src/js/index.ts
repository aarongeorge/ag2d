import game, { assetLoader, sceneManager } from './game'
import SceneMobileInteraction from './scenes/SceneMobileInteraction'
import SceneLoading from './scenes/SceneLoading'

/**
 * Asset Loader setup
 */
assetLoader.addAssets([{
	name: 'sprite-sheet-example',
	path: '/src/img/sprite-sheet-example.png',
	type: 'image'
}])

/**
 * Scene Manager setup
 */
sceneManager.add(new SceneMobileInteraction())
sceneManager.add(new SceneLoading())
sceneManager.goTo('SceneMobileInteraction')
game.start()

// To make shit global
window.sceneManager = sceneManager
