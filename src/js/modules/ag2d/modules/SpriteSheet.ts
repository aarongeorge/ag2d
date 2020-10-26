interface Sprite {
	height: number,
	width: number,
	x: number,
	y: number
}

interface Options {
	image: HTMLImageElement,
	sprites?: { [name: string]: Sprite }
}

export default class SpriteSheet {
	private _image: HTMLImageElement
	private _sprites: Map<string, HTMLCanvasElement>

	constructor (options: Options) {
		this._image = options.image
		this._sprites = new Map()
		if (options.sprites) {
			Object.entries(options.sprites).forEach(sprite => {
				const [name, values] = sprite
				const {x, y, width, height} = values
				this.define(name, x, y, width, height)
			})
		}
	}
	get sprites () {return this._sprites}
	render (context: CanvasRenderingContext2D, name: string, x: number, y: number) {
		const buffer = this._sprites.get(name)
		if (!buffer) throw new Error(`No sprite called ${name}`)
		context.drawImage(buffer, x, y)
	}
	renderTile (context: CanvasRenderingContext2D, name: string, x: number, y: number) {
		const buffer = this._sprites.get(name)
		if (!buffer) throw new Error(`No sprite called ${name}`)
		this.render(context, name, x * buffer.width, y * buffer.height)
	}
	define (name: string, x: number, y: number, width: number, height: number) {
		const buffer = document.createElement('canvas')
		const context = buffer.getContext('2d')
		if (!context) throw new Error(`Could not create sprite for ${name}`)
		buffer.width = width
		buffer.height = height
		context.drawImage(this._image, x, y, width, height, 0, 0, width, height)
		this._sprites.set(name, buffer)
	}
}
