/**
 * Characters: Flashing
 */

import Entity from '../modules/ag2d/modules/Entity'
import TraitFlashing from './traits/Flashing'

export default class Flashing extends Entity {
    constructor () {
		super()

		this.addTrait(new TraitFlashing())
	}
}
