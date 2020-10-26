/**
* Sprite Sheets: Example
*/
import { SpriteSheet } from '../modules/ag2d/index';
import { assetLoader } from '../game';

export default new SpriteSheet({
	image: assetLoader.assets['sprite-sheet-example'].element,
	sprites: {
		'0': {height: 32, width: 32, x: 0, y: 0},
		'1': {height: 32, width: 32, x: 32, y: 0},
		'2': {height: 32, width: 32, x: 64, y: 0},
		'3': {height: 32, width: 32, x: 96, y: 0},
		'4': {height: 32, width: 32, x: 128, y: 0},
		'5': {height: 32, width: 32, x: 0, y: 32},
		'6': {height: 32, width: 32, x: 32, y: 32},
		'7': {height: 32, width: 32, x: 64, y: 32},
		'8': {height: 32, width: 32, x: 96, y: 32},
		'9': {height: 32, width: 32, x: 128, y: 32},
		'10': {height: 32, width: 32, x: 0, y: 64},
		'11': {height: 32, width: 32, x: 32, y: 64},
		'12': {height: 32, width: 32, x: 64, y: 64},
		'13': {height: 32, width: 32, x: 96, y: 64},
		'14': {height: 32, width: 32, x: 128, y: 64},
		'15': {height: 32, width: 32, x: 0, y: 96},
		'16': {height: 32, width: 32, x: 32, y: 96},
		'17': {height: 32, width: 32, x: 64, y: 96},
		'18': {height: 32, width: 32, x: 96, y: 96},
		'19': {height: 32, width: 32, x: 128, y: 96},
		'20': {height: 32, width: 32, x: 0, y: 128},
		'21': {height: 32, width: 32, x: 32, y: 128},
		'22': {height: 32, width: 32, x: 64, y: 128},
		'23': {height: 32, width: 32, x: 96, y: 128},
		'24': {height: 32, width: 32, x: 128, y: 128},
		full: {height: 160, width: 160, x: 0, y: 0}
	}
})
