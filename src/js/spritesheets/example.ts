/**
 * Sprite Sheets: Example
 */

import {SpriteSheet} from '../modules/ag2d/index';
import {assetLoader} from '../experience';

export default new SpriteSheet({
    'image': assetLoader.assets['sprite-sheet-example'].element,
    'sprites': {
        '0': {
            'height': 32,
            'width': 32,
            'x': 0,
            'y': 0
        },
        '1': {
            'height': 32,
            'width': 32,
            'x': 32,
            'y': 0
        },
        '2': {
            'height': 32,
            'width': 32,
            'x': 64,
            'y': 0
        },
        '3': {
            'height': 32,
            'width': 32,
            'x': 96,
            'y': 0
        },
        '4': {
            'height': 32,
            'width': 32,
            'x': 128,
            'y': 0
        },
        '5': {
            'height': 32,
            'width': 32,
            'x': 128,
            'y': 32
        },
        '6': {
            'height': 32,
            'width': 32,
            'x': 128,
            'y': 64
        },
        '7': {
            'height': 32,
            'width': 32,
            'x': 128,
            'y': 96
        },
        '8': {
            'height': 32,
            'width': 32,
            'x': 128,
            'y': 128
        },
        'full': {
            'height': 160,
            'width': 160,
            'x': 0,
            'y': 0
        }
    }
});
