/**
 * Modules: Scene
 */

export default class Scene {
	enterCount: number = 0
	exitCount: number = 0
	name: string = 'Default'

	enter () {this.enterCount++}
	exit () {this.exitCount++}
	pause () {}
	play () {}
	render () {}
	update (deltaTime: number) {}
}
