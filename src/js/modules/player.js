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
    this.speedMultiplier = 1;
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

    // Update Y
    this.vy += (this.gravity / this.mass) * deltaTime / 2;
    this.y += this.vy * deltaTime;
    this.vy += (this.gravity / this.mass) * deltaTime / 2;

    // // Update X
    this.x += this.dx * (this.speed * this.speedMultiplier) * deltaTime;

    // Collision with walls
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

            // A
            if (key === 65) {
                this.dx = -1;
            }

            // W
            if (key === 87) {
                this.dy = -1;
            }

            // D
            if (key === 68) {
                this.dx = 1;
            }

            // S
            if (key === 83) {
                this.dy = 1;
            }

            // Spacebar
            if (key === 32) {
                this.vy = this.jumpForce;
            }

            // Shift
            if (key === 16) {
                this.speedMultiplier = 2;
            }

            break;
        }

        // Key Up
        case 'keyup': {

            // A
            if (key === 65) {
                this.dx = 0;
            }

            // W
            if (key === 87) {
                this.dy = 0;
            }

            // D
            if (key === 68) {
                this.dx = 0;
            }

            // S
            if (key === 83) {
                this.dy = 0;
            }

            // Shift
            if (key === 16) {
                this.speedMultiplier = 1;
            }

            break;
        }
    }
};

module.exports = Player;
