/**
 * Modules: Scene
 */

// Class: Scene
class Scene {

    // Constructor
    constructor (name = 'Default') {

        // Set `name`
        this.name = name;

        // Set `enteredCount` and `exitedCount`
        this.enterCount = 0;
        this.exitCount = 0;

        console.log(`Init: ${this.name}`);
    }

    // Method: render
    render () {
        console.log(`Render: ${this.name}`);
    }

    // Method: enter
    enter () {
        console.log(`Enter: ${this.name}`);
    }

    // Method: exit
    exit () {
        console.log(`Exit: ${this.name}`);
    }

    // Method: pause
    pause () {
        console.log(`Pause: ${this.name}`);
    }

    // Method: play
    play () {
        console.log(`Play: ${this.name}`);
    }

    // Method: update
    update () {
        console.log(`Update: ${this.name}`);
    }
}

// Export `Scene`
export default Scene;
