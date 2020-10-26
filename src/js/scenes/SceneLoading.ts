/**
 * SceneLoading
 */

import game, { assetLoader, eventEmitter, sceneManager } from '../game'
import { Scene } from '../modules/ag2d/index'

export default class SceneLoading extends Scene {

	constructor () {
		super()
		this.name = 'SceneLoading'
	}

	render () {

		// Yellow background
		game.context.fillStyle = '#FFFF00'

		game.context.fillRect(0, 0, game.size.width, game.size.height)

		// Scene name
		game.context.textAlign = 'center'
		game.context.textBaseline = 'middle'
		game.context.strokeStyle = 'black'
		game.context.lineWidth = 1
		game.context.lineJoin = 'round'

		game.context.strokeText('Loading...', game.size.width / 2, game.size.height / 2)

		game.context.fillStyle = 'white'

		game.context.fillText('Loading...', game.size.width / 2, game.size.height / 2)
	}
	enter () {
		super.enter()

		if (this.enterCount === 1) {
			eventEmitter.addListener({
				name: 'assetLoader:loaded',
				callback: async () => {
					const [
						SceneStart,
						SceneFull,
						SceneTile,
						SceneFlashing,
						SceneJumping,
						SceneAllTheSame,
						SceneTileCollider,
						SceneQuadTree,
						ScenePointer,
						ScenePointer2,
						ScenePointer3
					] = await Promise.all([
						import('./SceneStart'),
						import('./SceneFull'),
						import('./SceneTile'),
						import('./SceneFlashing'),
						import('./SceneJumping'),
						import('./SceneAllTheSame'),
						import('./SceneTileCollider'),
						import('./SceneQuadTree'),
						import('./ScenePointer'),
						import('./ScenePointer2'),
						import('./ScenePointer3')
					])

					/**
					 * Scene Manager setup
					 */
					sceneManager.add(new SceneStart.default())
					sceneManager.add(new ScenePointer3.default())
					sceneManager.add(new ScenePointer2.default())
					sceneManager.add(new ScenePointer.default())
					sceneManager.add(new SceneFull.default())
					sceneManager.add(new SceneTile.default())
					sceneManager.add(new SceneFlashing.default())
					sceneManager.add(new SceneJumping.default())
					sceneManager.add(new SceneAllTheSame.default())
					sceneManager.add(new SceneTileCollider.default())
					sceneManager.add(new SceneQuadTree.default())
					sceneManager.goTo('SceneStart')
				},
				count: 1
			})

			assetLoader.loadAssets(() => { eventEmitter.emit('assetLoader:loaded') })
		}
	}
}
