/**
 * Vector
 */

// Constructor: Vector
var Vector = function (x, y, z) {
    'use strict';

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

    return this;
};

// Method: add
Vector.prototype.add = function (v) {
    'use strict';

    if (v instanceof Vector) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    else {
        return new Vector(this.x + v, this.y + v, this.z + v);
    }
};

// Method: angleTo
Vector.prototype.angleTo = function (a) {
    'use strict';

    return Math.acos(this.dot(a) / (this.length() * a.length()));
};

// Method: clone
Vector.prototype.clone = function () {
    'use strict';

    return new Vector(this.x, this.y, this.z);
};

// Method: cross
Vector.prototype.cross = function (v) {
    'use strict';

    return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
};

// Method: divide
Vector.prototype.divide = function (v) {
    'use strict';

    if (v instanceof Vector) {
        return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    else {
        return new Vector(this.x / v, this.y / v, this.z / v);
    }
};

// Method: dot
Vector.prototype.dot = function (v) {
    'use strict';

    return this.x * v.x + this.y * v.y + this.z * v.z;
};

// Method: equals
Vector.prototype.equals = function (v) {
    'use strict';

    return this.x === v.x && this.y === v.y && this.z === v.z;
};

// Method: length
Vector.prototype.length = function () {
    'use strict';

    return Math.sqrt(this.dot(this));
};

// Method: max
Vector.prototype.max = function () {
    'use strict';

    return Math.max(Math.max(this.x, this.y), this.z);
};

// Method: min
Vector.prototype.min = function () {
    'use strict';

    return Math.min(Math.min(this.x, this.y), this.z);
};

// Method: multiply
Vector.prototype.multiply = function (v) {
    'use strict';

    if (v instanceof Vector) {
        return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
    }

    else {
        return new Vector(this.x * v, this.y * v, this.z * v);
    }
};

// Method: negative
Vector.prototype.negative = function () {
    'use strict';

    return new Vector(-this.x, -this.y, -this.z);
};

// Method: subtract
Vector.prototype.subtract = function (v) {
    'use strict';

    if (v instanceof Vector) {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    else {
        return new Vector(this.x - v, this.y - v, this.z - v);
    }
};

// Method: toAngles
Vector.prototype.toAngles = function () {
    'use strict';

    return {
        'theta': Math.atan2(this.z, this.x),
        'phi': Math.asin(this.y / this.length())
    };
};

// Method: toArray
Vector.prototype.toArray = function (n) {
    'use strict';

    return [this.x, this.y, this.z].slice(0, n || 3);
};

// Method: unit
Vector.prototype.unit = function () {
    'use strict';

    return this.divide(this.length());
};

Vector.negative = function (a, b) {
    'use strict';

    b.x = -a.x;
    b.y = -a.y;
    b.z = -a.z;

    return b;
};

Vector.add = function (a, b, c) {
    'use strict';

    if (b instanceof Vector) {
        c.x = a.x + b.x;
        c.y = a.y + b.y;
        c.z = a.z + b.z;
    }

    else {
        c.x = a.x + b;
        c.y = a.y + b;
        c.z = a.z + b;
    }

    return c;
};

Vector.subtract = function (a, b, c) {
    'use strict';

    if (b instanceof Vector) {
        c.x = a.x - b.x;
        c.y = a.y - b.y;
        c.z = a.z - b.z;
    }

    else {
        c.x = a.x - b;
        c.y = a.y - b;
        c.z = a.z - b;
    }

    return c;
};

Vector.multiply = function (a, b, c) {
    'use strict';

    if (b instanceof Vector) {
        c.x = a.x * b.x;
        c.y = a.y * b.y;
        c.z = a.z * b.z;
    }

    else {
        c.x = a.x * b;
        c.y = a.y * b;
        c.z = a.z * b;
    }

    return c;
};

Vector.divide = function (a, b, c) {
    'use strict';

    if (b instanceof Vector) {
        c.x = a.x / b.x;
        c.y = a.y / b.y;
        c.z = a.z / b.z;
    }

    else {
        c.x = a.x / b;
        c.y = a.y / b;
        c.z = a.z / b;
    }

    return c;
};

Vector.cross = function (a, b, c) {
    'use strict';

    c.x = a.y * b.z - a.z * b.y;
    c.y = a.z * b.x - a.x * b.z;
    c.z = a.x * b.y - a.y * b.x;

    return c;
};

Vector.unit = function (a, b) {
    'use strict';

    var length = a.length();

    b.x = a.x / length;
    b.y = a.y / length;
    b.z = a.z / length;

    return b;
};

Vector.fromAngles = function (theta, phi) {
    'use strict';

    return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
};

Vector.randomDirection = function () {
    'use strict';

    return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
};

Vector.min = function (a, b) {
    'use strict';

    return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
};

Vector.max = function (a, b) {
    'use strict';

    return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
};

Vector.lerp = function (a, b, fraction) {
    'use strict';

    return b.subtract(a).multiply(fraction).add(a);
};

Vector.fromArray = function (a) {
    'use strict';

    return new Vector(a[0], a[1], a[2]);
};

Vector.angleBetween = function (a, b) {
    'use strict';

    return a.angleTo(b);
};

module.exports = Vector;
