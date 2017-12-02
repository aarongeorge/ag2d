/**
 * Sprite sheet
 *
 * @desc Sprite sheet
 */

// Class: SpriteSheet
class SpriteSheet {

    // Constructor
    constructor (options) {
        this.columns = options.columns || 1;
        this.frameHeight = options.frameHeight;
        this.frameWidth = options.frameWidth;
        this.image = options.image;
        this.name = options.name;
        this.rows = options.rows || 1;
    }
}

// Export `SpriteSheet`
export default SpriteSheet;
