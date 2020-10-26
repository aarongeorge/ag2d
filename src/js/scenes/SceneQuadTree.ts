/**
 * Scenes: QuadTree
 */

import game from '../game'
import { Scene, QuadTree, Rect, Point } from '../modules/ag2d/index'

export default class QuadTreeScene extends Scene {
	quadTree: QuadTree

	constructor () {
		super()
		this.name = 'SceneQuadTree'

		const boundary = new Rect(0, 0, game.size.width, game.size.height)
		this.quadTree = new QuadTree(boundary, 5)

		for (let i = 0; i < 100; i++) {
			let point = new Point(Math.random() * game.size.width | 0, Math.random() * game.size.height | 0)

			this.quadTree.insert(point)
		}
	}

	render () {
		this.quadTree.render(game.context)
	}
}
