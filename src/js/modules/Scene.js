/**
 * Modules: Scene
 */

// Class: Scene
class Scene {

    // Constructor
    constructor (name = 'Default') {
        this.enterCount = 0;
        this.exitCount = 0;
        this.name = name;
    }

    // Method: enter
    enter () {}

    // Method: exit
    exit () {}

    // Method: pause
    pause () {}

    // Method: play
    play () {}

    // Method: render
    render () {}

    // Method: update
    update () {}
}

// Export `Scene`
export default Scene;
