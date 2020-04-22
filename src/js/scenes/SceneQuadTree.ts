/**
 * Scenes: QuadTree
 */

import experience from '../experience'
import { Scene, QuadTree, Rect, Point } from '../modules/ag2d/index'

export default class QuadTreeScene extends Scene {
    quadTree: QuadTree

    constructor () {
		super('SceneQuadTree')

        const boundary = new Rect(0, 0, experience.size.width, experience.size.height)
        this.quadTree = new QuadTree(boundary, 5)

        for (let i = 0; i < 100; i++) {
			let point = new Point(Math.random() * experience.size.width | 0, Math.random() * experience.size.height | 0)

            this.quadTree.insert(point)
        }
    }

    render () {
        experience.context.save()
        // experience.context.translate(experience.size.width / 2, experience.size.height / 2)
        this.quadTree.render(experience.context)
        experience.context.restore()
        // experience.context.strokeStyle = '#FFFFFF'
        // experience.context.strokeRect(x, y, width, height)
        // this.spriteSheet.render('full', experience.context, 0, 0)
    }
}
