export class Vec2 {
    x: number;
    y: number;

    constructor (x: number, y: number) {
        this.set(x, y);
    }

    set (x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Matrix {

    constructor () {
        this.grid = [];
    }

    forEach (callback) {
        this.grid.forEach((column, x) => {
            column.forEach((value, y) => {
                callback(value, x, y);
            })
        })
    }

    set (x, y, value) {
        if (!this.grid[x]) {
            this.grid[x] = [];
        }

        this.grid[x][y] = value;
    }

    get (x, y) {
        return this.grid[x] ? this.grid[x][y] : undefined;
    }
}