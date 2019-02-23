/**
 * AnimationManager
 *
 * @desc An animation manager
 */

// Class: AnimationManager
class AnimationManager {

    // Constructor
    constructor () {

        // Object to hold animations
        this.animations = {};

        // Array to hold animation names
        this.animationNames = [];
    }

    // Method: add
    add (animation) {

        // `animation` doesn't already exist in `animations`
        if (animation.name in this.animations === false) {

            // Add `name` to `animations`
            this.animations[animation.name] = animation;

            // Update `animationNames`
            this.animationNames = Object.keys(this.animations);
        }

        // `animation` does exist in `animation`
        else {

            // Throw error
            throw new Error(`An animation with the name \`${animation.name}\` already exists`);
        }
    }

    // Method: remove
    remove (name) {

        // `name` does exist in `animations`
        if (name in this.animations) {

            // Remove `name` from `animations`
            delete this.animations[name];

            // Update `animationNames`
            this.animationNames = Object.keys(this.animations);
        }

        // `name` does not exist in `animations`
        else {

            // Throw error
            throw new Error(`No animation with the name \`${name}\` exists`);
        }
    }

    // Method: update
    update (deltaTime) {

        // Iterate over `animationNames`
        this.animationNames.forEach(animation => {

            // Call `update` on `animation`
            this.animations[animation].update(deltaTime);
        });
    }
}

// Export `AnimationManager`
export default AnimationManager;
