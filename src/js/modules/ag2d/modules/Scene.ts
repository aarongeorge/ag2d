/**
 * Modules: Scene
 */

export default class Scene {
    enterCount: number;
    exitCount: number;
    name: string;

    constructor (name: string = 'Default') {
        this.enterCount = 0;
        this.exitCount = 0;
        this.name = name;
    }

    enter () { this.enterCount++ }
	exit () { this.exitCount ++ }
    pause () {}
    play () {}
    render () {}
    update (deltaTime: number) {}
}
