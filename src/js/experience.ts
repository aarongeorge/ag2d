import AG2D, { AssetLoader, AudioManager, EventEmitter, EventHandler, KeyManager, SceneManager } from './modules/ag2d/index'

const experience = new AG2D()
const assetLoader = new AssetLoader()
const audioManager = new AudioManager()
const eventEmitter = new EventEmitter()
const eventHandler = new EventHandler()
const keyManager = new KeyManager()
const sceneManager = new SceneManager()

experience.autoClear = true
experience.backgroundColor = '#000000'
experience.canvas = document.querySelector('canvas')!
experience.imageSmoothing = false
experience.size = { height: 160, width: 160}
experience.updatesPerSecond = 60
experience.render = () => { sceneManager.render() }
experience.start = () => { sceneManager.play() }
experience.stop = () => { sceneManager.pause() }
experience.update = (deltaTime: number = 0) => { sceneManager.update(deltaTime) }
experience.resizeCanvas(window.innerWidth, window.innerHeight)
window.addEventListener('resize', () => { experience.resizeCanvas(window.innerWidth, window.innerHeight) })

export { assetLoader, audioManager, eventEmitter, eventHandler, keyManager, sceneManager }
export default experience
