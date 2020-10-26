import AG2D, { AssetLoader, AudioManager, EventEmitter, EventHandler, KeyManager, PointerManager, SceneManager } from './modules/ag2d/index'

// Create instances
const game = new AG2D()
const assetLoader = new AssetLoader()
const audioManager = new AudioManager()
const eventEmitter = new EventEmitter()
const eventHandler = new EventHandler()
const keyManager = new KeyManager()
const pointerManager = new PointerManager()
const sceneManager = new SceneManager()

// Configure settings for game
game.autoClear = true
game.backgroundColor = '#000000'
game.canvas = document.querySelector('canvas')!
game.canvas.style.touchAction = 'none'
game.imageSmoothing = false
game.size = { height: 160, width: 160 }
game.updatesPerSecond = 60
game.render = () => { sceneManager.render() }
game.start = () => { sceneManager.play() }
game.stop = () => { sceneManager.pause() }
game.update = (deltaTime: number = 0) => { sceneManager.update(deltaTime) }
game.resizeCanvas(window.innerWidth, window.innerHeight)
keyManager.enable(game.canvas)
pointerManager.element = game.canvas
pointerManager.scale = window.devicePixelRatio * game.ratio
pointerManager.enable()
window.addEventListener('resize', () => {
	game.resizeCanvas(window.innerWidth, window.innerHeight)
	pointerManager.scale = window.devicePixelRatio * game.ratio
})

// Export instances and game
export { assetLoader, audioManager, eventEmitter, eventHandler, keyManager, pointerManager, sceneManager }
export default game
