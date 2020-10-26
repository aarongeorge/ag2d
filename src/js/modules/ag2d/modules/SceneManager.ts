/**
 * SceneManager
 *
 * @desc A scene manager
 */

import {cyclicArray} from './Utils'
import Scene from './Scene'

export default class SceneManager {
	scenes: Map<string, any> = new Map()
	currentScene: Scene | undefined = void 0

	add (scene: Scene) {this.scenes.set(scene.name, scene)}
	goTo (name: string) {
		if (!this.scenes.has(name)) throw new Error(`Scene ${name} does not exist`)
		if (this.currentScene) {
			this.currentScene.exit()
		}
		this.currentScene = this.scenes.get(name)
		this.currentScene!.enter()
	}
	next () {
		const keys = [...this.scenes.keys()]
		this.goTo(this.scenes.get(cyclicArray(keys, keys.indexOf(this.currentScene!.name) + 1).value).name)
	}
	pause () {if (this.currentScene) this.currentScene.pause()}
	play () {if (this.currentScene) this.currentScene.play()}
	previous () {
		const keys = [...this.scenes.keys()]
		this.goTo(this.scenes.get(cyclicArray(keys, keys.indexOf(this.currentScene!.name) - 1).value).name)
	}
	remove (name: string) {this.scenes.delete(name)}
	render () {if (this.currentScene) {this.currentScene.render()}}
	update (deltaTime: number) {if (this.currentScene) this.currentScene.update(deltaTime)}
}
