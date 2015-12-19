/**
 * AG2D
 *
 * @desc A 2D game engine
 */

var AG2D = function (canvas, options) {
    'use strict';

    // If this is being called for the first time, make it an instance
    if (!(this instanceof AG2D)) {
        return new AG2D(canvas, options);
    }

    // Defaults
    this.canvas = canvas;
    this.options = options || {};
    this.context = this.canvas.getContext('2d');
    this.fps = this.options.options.fps;
    this.lastUpdate = window.performance.now();

    // Call `init`
    this.init();
};

// Method: init
AG2D.prototype.init = function () {
    'use strict';

    // Call `inject`
    this.inject();

    // Call `bindEventListeners`
    this.bindEventListeners();

    // Call `options.init`
    this.options.init();

    // Call `options.draw`
    this.options.draw();

    // Call `renderLoop`
    this.renderLoop();
};

// Method: update
AG2D.prototype.update = function (deltaTime) {
    'use strict';

    // Call `options.update` and pass delta time
    this.options.update(deltaTime);
};

// Method: draw
AG2D.prototype.draw = function () {
    'use strict';

    // Call `clearCanvas`
    this.clearCanvas();

    // Call `options.draw`
    this.options.draw();
};

// Method: renderLoop
AG2D.prototype.renderLoop = function (timeNow) {
    'use strict';

    // Call `renderLoop` on next tick
    window.requestAnimationFrame(this.renderLoop.bind(this));

    // Calculate delta time
    var deltaTime = timeNow - this.lastUpdate;

    // If `deltaTime` is higher than 1000 / `fps`
    if (deltaTime > 1000 / this.fps) {

        // Call `update` and pass `deltaTime`
        this.update(deltaTime);

        // Update `lastUpdate`
        this.lastUpdate = timeNow - (deltaTime % this.fps / 1000);
    }

    // Call `draw`
    this.draw();
};

// Method: clearCanvas
AG2D.prototype.clearCanvas = function () {
    'use strict';

    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
};

// Method: inject
AG2D.prototype.inject = function () {
    'use strict';

    // Inject canvas
    this.options.canvas = this.canvas;

    // Inject context
    this.options.context = this.context;
};

// Method: bindEventListeners
AG2D.prototype.bindEventListeners = function () {
    'use strict';

    // Store reference to `this`
    var _this = this;

    // Add keydown listener
    window.addEventListener('keydown', function (e) {
        _this.options.keydown(e.keyCode, e);
    });

    // Add keyup listener
    window.addEventListener('keyup', function (e) {
        _this.options.keyup(e.keyCode, e);
    });
};

module.exports = AG2D;
