/**
 * Characters: Jumping
 */

import {Entity, SpriteSheet} from '../modules/ag2d/index'
import ExampleSpriteSheet from '../spritesheets/example'
import {Vec2} from '../modules/ag2d/index'
import TraitJump from './traits/Jump'
import TraitFlashing from './traits/Flashing'
import TraitWalk from './traits/Walk'

export default class Jumping extends Entity {
	spriteSheet: SpriteSheet
	gravity: Vec2

	constructor (options) {
		super()

		this.spriteSheet = ExampleSpriteSheet
		this.pos = new Vec2(0, 128)
		this.vel = new Vec2(0, 0)
		this.gravity = new Vec2(0, 0.005)

		this.addTrait(new TraitJump(options))
		this.addTrait(new TraitFlashing())
		this.addTrait(new TraitWalk(options))
	}
}
