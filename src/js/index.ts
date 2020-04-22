import experience, { assetLoader, sceneManager, keyManager } from './experience'
import SceneMobileInteraction from './scenes/SceneMobileInteraction'
import SceneLoading from './scenes/SceneLoading'

/**
 * Asset Loader setup
 */
assetLoader.addAssets([{
	name: 'sprite-sheet-example',
	path: '/sprite-sheet-example.png',
	type: 'image'
}])

/**
 * Scene Manager setup
 */
sceneManager.add(new SceneMobileInteraction())
sceneManager.add(new SceneLoading())
keyManager.enable(experience.canvas)
keyManager.enable()
sceneManager.goTo('SceneMobileInteraction')
experience.start()

window.sceneManager = sceneManager
window.experience = experience
