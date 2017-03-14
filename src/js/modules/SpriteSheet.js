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
    this.frameWidth = options.frameWidth;
    this.image = options.image;
    this.retinaSize = options.retinaSize;
    this.name = options.name;
    this.rows = options.rows;
};

// Export `SpriteSheet`
module.exports = SpriteSheet;
