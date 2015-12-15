var Player = function (scope) {
    'use strict';

    this.context = scope.context;

    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.width = 10;
    this.height = 10;
};

// Method: draw
Player.prototype.draw = function () {
    'use strict';

    this.context.fillStyle = 'rgb(200, 0, 0)';
    this.context.fillRect(this.x, this.y, this.width, this.height);
};

// Method: update
Player.prototype.update = function () {
    'use strict';

    this.x += this.dx;
    this.y += this.dy;
};

module.exports = Player;
