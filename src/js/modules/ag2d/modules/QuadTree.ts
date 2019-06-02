/**
 * Modules: QuadTree
 */

import {Rect, Point} from './Math';

export default class QuadTree {
    boundary: Rect;
    capacity: number;
    points: Array<Point>;
    divided: boolean;
    northEast?: QuadTree;
    northWest?: QuadTree;
    southWest?: QuadTree;
    southEast?: QuadTree;

    constructor (boundary: Rect, capacity: number) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    subdivide () {
        const {x, y, width, height} = this.boundary;

        let ne = new Rect(x + width / 2, y, width / 2, height / 2);
        let nw = new Rect(x, y, width / 2, height / 2);
        let sw = new Rect(x, y + height / 2, width / 2, height / 2);
        let se = new Rect(x + width / 2, y + height / 2, width / 2, height / 2);

        this.northEast = new QuadTree(ne, this.capacity);
        this.northWest = new QuadTree(nw, this.capacity);
        this.southWest = new QuadTree(sw, this.capacity);
        this.southEast = new QuadTree(se, this.capacity);

        this.divided = true;
    }

    insert (point: Point) {
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }

        else {
            if (!this.divided) {
                this.subdivide();
            }

            if (this.northEast!.insert(point)) {
                return true;
            }
            else if (this.northWest!.insert(point)) {
                return true;
            }
            else if (this.southEast!.insert(point)) {
                return true;
            }
            else if (this.southWest!.insert(point)) {
                return true;
            }
        }
    }

    render (context: CanvasRenderingContext2D) {
        const {x, y, width, height} = this.boundary;

        context.strokeStyle = '#FF0000';
        context.strokeRect(x, y, width, height);

        if (this.divided) {
            this.northEast!.render(context);
            this.northWest!.render(context);
            this.southEast!.render(context);
            this.southWest!.render(context);
        }

        if (this.points) {
            context.strokeStyle = '#00FFFF';
            this.points.forEach(point => {
                context.strokeRect(point.x, point.y, 1, 1);
           });
        }
    }
}
