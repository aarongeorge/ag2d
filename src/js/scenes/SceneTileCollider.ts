/**
 * Scenes: SceneJumping
 */

import { Scene, Matrix, TileCollider, SpriteSheet } from '../modules/ag2d/index'
import Colliding from '../characters/colliding'
import Flashing from '../characters/flashing'
import game, { keyManager, eventHandler } from '../game'
import ExampleSpriteSheet from '../spritesheets/example'

const levelTiles = [
	{
		tile: '1',
		x: 0,
		y: 0,
		collide: true
	},
	{
		tile: '1',
		x: 32,
		y: 0,
		collide: true
	},
	{
		tile: '1',
		x: 64,
		y: 0,
		collide: true
	},
	{
		tile: '1',
		x: 96,
		y: 0,
		collide: true
	},
	{
		tile: '1',
		x: 128,
		y: 0,
		collide: true
	},
	{
		tile: '1',
		x: 0,
		y: 32,
		collide: true
	},
	{
		tile: '2',
		x: 32,
		y: 32
	},
	{
		tile: '2',
		x: 64,
		y: 32
	},
	{
		tile: '2',
		x: 96,
		y: 32
	},
	{
		tile: '1',
		x: 128,
		y: 32,
		collide: true
	},
	{
		tile: '1',
		x: 0,
		y: 64,
		collide: true
	},
	{
		tile: '2',
		x: 32,
		y: 64
	},
	{
		tile: '2',
		x: 64,
		y: 64
	},
	{
		tile: '2',
		x: 96,
		y: 64
	},
	{
		tile: '1',
		x: 128,
		y: 64,
		collide: true
	},
	{
		tile: '1',
		x: 0,
		y: 96,
		collide: true
	},
	{
		tile: '2',
		x: 32,
		y: 96
	},
	{
		tile: '2',
		x: 64,
		y: 96
	},
	{
		tile: '2',
		x: 96,
		y: 96
	},
	{
		tile: '1',
		x: 128,
		y: 96,
		collide: true
	},
	{
		tile: '1',
		x: 0,
		y: 128,
		collide: true
	},
	{
		tile: '1',
		x: 32,
		y: 128,
		collide: true
	},
	{
		tile: '1',
		x: 64,
		y: 128,
		collide: true
	},
	{
		tile: '1',
		x: 96,
		y: 128,
		collide: true
	},
	{
		tile: '1',
		x: 128,
		y: 128,
		collide: true
	}
]

export default class SceneTileCollider extends Scene {
	spriteSheet: SpriteSheet
	tileSize: number
	collisions: any[]
	tilesMatrix: Matrix
	tileCollider: TileCollider
	entities: any

	constructor () {
		super()
		this.name = 'SceneTileCollider'
		this.spriteSheet = ExampleSpriteSheet
		this.tileSize = 32
		this.collisions = []
		this.tilesMatrix = new Matrix()

		levelTiles.forEach(tile => { this.tilesMatrix.set(tile.x / this.tileSize, tile.y / this.tileSize, tile) })

		this.tileCollider = new TileCollider(this.tilesMatrix, this.tileSize)
	}

	enter () {
		super.enter()
		this.entities = new Set()

		this.entities.add(new Colliding({keyManager, eventHandler, 'canvas': game.canvas}))
		// this.entities.add(new Flashing())
	}
	render () {
		levelTiles.forEach(tile => { this.spriteSheet.render(game.context, tile.tile, tile.x, tile.y) })

		this.collisions.forEach(collision => {
			game.context.save()

			game.context.strokeStyle = 'yellow'
			game.context.lineWidth = 1

			game.context.strokeRect(collision.x1 + 0.5, collision.y1 + 0.5, collision.x2 - collision.x1 - 1, collision.y2 - collision.y1 - 1)
			game.context.restore()
		})

		this.entities.forEach(entity => entity.render(game.context))
	}
	update (deltaTime: number) {
		this.collisions = []

		this.entities.forEach(entity => {
			entity.update(deltaTime)

			entity.pos.x += entity.vel.x * deltaTime

			this.tileCollider.checkX(entity)

			entity.pos.y += entity.vel.y * deltaTime

			this.tileCollider.checkY(entity)

			const collidedTiles = this.tileCollider.test(entity)

			collidedTiles && this.collisions.push(...collidedTiles)
		})
	}
}
