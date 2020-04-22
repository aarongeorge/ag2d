/**
 * SceneLoading
 */

import experience, { assetLoader, eventEmitter, sceneManager } from '../experience'
import { Scene } from '../modules/ag2d/index'

export default class SceneLoading extends Scene {

    constructor () { super('SceneLoading') }

    render () {

        // Yellow background
		experience.context.fillStyle = '#FFFF00'

        experience.context.fillRect(0, 0, experience.size.width, experience.size.height)

        // Scene name
        experience.context.textAlign = 'center'
        experience.context.textBaseline = 'middle'
        experience.context.strokeStyle = 'black'
        experience.context.lineWidth = 1
		experience.context.lineJoin = 'round'

		experience.context.strokeText('Loading...', experience.size.width / 2, experience.size.height / 2)

		experience.context.fillStyle = 'white'

        experience.context.fillText('Loading...', experience.size.width / 2, experience.size.height / 2)
    }
    enter () {
		super.enter()

        if (this.enterCount === 1) {
            eventEmitter.addListener('assetLoader:loaded', async () => {
                const [
                    SceneStart,
                    SceneFull,
                    SceneTile,
                    SceneFlashing,
                    SceneJumping,
                    SceneAllTheSame,
                    SceneTileCollider,
                    SceneQuadTree
                ] = await Promise.all([
                    import('./SceneStart'),
                    import('./SceneFull'),
                    import('./SceneTile'),
                    import('./SceneFlashing'),
                    import('./SceneJumping'),
                    import('./SceneAllTheSame'),
                    import('./SceneTileCollider'),
                    import('./SceneQuadTree')
                ])

                /**
                 * Scene Manager setup
                 */
                sceneManager.add(new SceneStart.default())
                sceneManager.add(new SceneFull.default())
                sceneManager.add(new SceneTile.default())
                sceneManager.add(new SceneFlashing.default())
                sceneManager.add(new SceneQuadTree.default())
                sceneManager.add(new SceneTileCollider.default())
                sceneManager.add(new SceneJumping.default())
                sceneManager.add(new SceneAllTheSame.default())
                sceneManager.goTo('SceneStart')
			}, 1)

            assetLoader.loadAssets(() => { eventEmitter.emit('assetLoader:loaded') })
        }
    }
}
