/**
 * Sprite sheet
 *
 * @desc Sprite sheet
 */

// Constructor: SpriteSheet
var SpriteSheet = function (options) {
    'use strict';

    this.columns = options.columns;
    this.frameHeight = options.frameHeight;
    this.framesPerRow = options.framesPerRow;
    this.frameWidth = options.frameWidth;
    this.image = options.image;
    this.isRetina = options.isRetina;
    this.name = options.name;
    this.rows = options.rows;
};

// Export `SpriteSheet`
module.exports = SpriteSheet;
