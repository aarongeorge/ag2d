var Player = function (scope) {
    'use strict';

    this.context = scope.context;

    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.vx = 0;
    this.vy = 0;
    this.gravity = 9.807;
    this.width = 10;
    this.height = 10;
    this.speed = 100;
    this.mass = 0.0062;
    this.jumpForce = -300;
};

// Method: draw
Player.prototype.draw = function () {
    'use strict';

    this.context.fillStyle = 'rgb(255, 255, 255)';
    this.context.fillRect(Math.round(this.x), Math.round(this.y), this.width, this.height);
};

// Method: update
Player.prototype.update = function (deltaTime) {
    'use strict';

    // Convert `deltaTime` to a fraction
    deltaTime /= 1000;

    this.vy += (this.gravity / this.mass) * deltaTime / 2;
    this.y += this.vy * deltaTime;
    this.vy += (this.gravity / this.mass) * deltaTime / 2;

    this.x += (this.dx * this.speed) * deltaTime;

    if (this.x + this.width > this.context.canvas.offsetWidth) {
        this.x = this.context.canvas.offsetWidth - this.width;
    }

    if (this.y + this.height > this.context.canvas.offsetHeight) {
        this.y = this.context.canvas.offsetHeight - this.height;
    }

    if (this.x < 0) {
        this.x = 0;
    }

    if (this.y < 0) {
        this.y = 0;
    }
};

// Method: movement
Player.prototype.movement = function (key, evt) {
    'use strict';

    // Switch on `evt.type`
    switch (evt.type) {

        // Key Down
        case 'keydown': {

            // Switch on `key`
            switch (key) {

                // A
                case 65: {
                    this.dx = -1;
                    break;
                }

                // W
                case 87: {
                    this.dy = -1;
                    break;
                }

                // D
                case 68: {
                    this.dx = 1;
                    break;
                }

                // S
                case 83: {
                    this.dy = 1;
                    break;
                }

                // Space
                case 32: {
                    this.vy = this.jumpForce;
                    break;
                }
            }
            break;
        }

        // Key Up
        case 'keyup': {

            // Switch on `key`
            switch (key) {

                // A
                case 65: {
                    this.dx = 0;
                    break;
                }

                // W
                case 87: {
                    this.dy = 0;
                    break;
                }

                // D
                case 68: {
                    this.dx = 0;
                    break;
                }

                // S
                case 83: {
                    this.dy = 0;
                    break;
                }
            }
            break;
        }
    }
};

module.exports = Player;
