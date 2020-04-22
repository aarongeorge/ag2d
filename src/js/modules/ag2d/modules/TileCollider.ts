/**
 * TileCollider
 *
 * @desc A tile collider
 */

import TileResolver from './TileResolver'
import Entity from './Entity'
import {Matrix} from './Math'

export default class TileCollider {
    tiles: TileResolver

    constructor (tileMatrix: Matrix, tileSize: number) { this.tiles = new TileResolver(tileMatrix, tileSize) }

    checkX (entity: Entity) {
        let x

        if (entity.vel.x > 0) x = entity.pos.x + entity.width
		else if (entity.vel.x < 0) x = entity.pos.x
        else return

        const resolvedTiles = this.tiles.getByRange(x, x, entity.pos.y, entity.pos.y + entity.height)

        resolvedTiles.forEach(resolvedTile => {
            if (resolvedTile.tile.collide !== true) {
                return
            }

            if (entity.vel.x > 0) {
                if (entity.pos.x + entity.height > resolvedTile.x1) {
                    entity.pos.x = resolvedTile.x1 - entity.width
                    entity.vel.x = 0
                }
            }

            else if (entity.vel.x < 0) {
                if (entity.pos.x < resolvedTile.x2) {
                    entity.pos.x = resolvedTile.x2
                    entity.vel.x = 0
                }
            }
        })
    }
    checkY (entity: Entity) {
        let y

        if (entity.vel.y > 0) y = entity.pos.y + entity.width
        else if (entity.vel.y < 0) y = entity.pos.y
        else return

        const resolvedTiles = this.tiles.getByRange(entity.pos.x, entity.pos.x + entity.width, y, y)

        resolvedTiles.forEach(resolvedTile => {
            if (resolvedTile.tile.collide !== true) return

            if (entity.vel.y > 0) {
                if (entity.pos.y + entity.height > resolvedTile.y1) {
                    entity.pos.y = resolvedTile.y1 - entity.height
                    entity.vel.y = 0
                }
            }

            else if (entity.vel.y < 0) {
                if (entity.pos.y < resolvedTile.y2) {
                    entity.pos.y = resolvedTile.y2
                    entity.vel.y = 0
                }
            }
        })
    }
    test (entity: Entity) {
        const resolvedTiles = this.tiles.getByRange(
            entity.pos.x,
            entity.pos.x + entity.width,
            entity.pos.y,
            entity.pos.y + entity.height
		)

        if (resolvedTiles.length) return resolvedTiles
    }
}
