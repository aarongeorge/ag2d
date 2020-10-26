export class Vec2 {
	x!: number
	y!: number

	constructor (x: number, y: number) {this.set(x, y)}
	set (x: number, y: number) {
		this.x = x
		this.y = y
	}
}

export class Point {
	x: number
	y: number

	constructor (x: number, y: number) {
		this.x = x
		this.y = y
	}
}

export class Rect {
	x: number
	y: number
	width: number
	height: number

	constructor (x: number, y: number, width: number, height: number) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
	}
	contains (point: Point): boolean {
		return (point.x >= this.x - this.width
			&& point.x <= this.x + this.width
			&& point.y >= this.y - this.height
			&& point.y <= this.y + this.height)
	}
}

export class Matrix {
	grid: [[any]?][]

	constructor () { this.grid = [] }
	forEach (callback: (value: any, x: number, y: number) => any) {this.grid.forEach((column, x) => column.forEach((value, y) => callback(value, x, y)))}
	set (x: number, y: number, value: any) {
		if (!this.grid[x]) this.grid[x] = []
		this.grid[x][y] = value
	}
	get (x: number, y: number) {return this.grid[x] ? this.grid[x][y] : undefined}
}
