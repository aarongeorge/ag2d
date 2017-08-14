(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ag2d = require('./libs/ag2d');

var _ag2d2 = _interopRequireDefault(_ag2d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create instance of `AG2D`
var experience = new _ag2d2.default(document.querySelector('canvas'));

// Configure `experience`
/**
 * Experience
 */

// Dependencies
experience.configure({
    'fps': 60,
    'backgroundColour': '#FF00FF',
    'size': {
        'height': 720,
        'width': 1280
    }
});

// Update
var update = function update(deltaTime) {
    _ag2d.animationManager.update(deltaTime);
    _ag2d.sceneManager.update(deltaTime);
};

// Render
var render = function render() {
    _ag2d.sceneManager.render();
};

// Stop
var stop = function stop() {
    console.log('Stop called');
};

// Start
var start = function start() {
    console.log('Start called');
};

// Bind the hooks
experience.hooks.bind('update', update);
experience.hooks.bind('render', render);
experience.hooks.bind('stop', stop);
experience.hooks.bind('start', start);

// Export `experience`
exports.default = experience;

},{"./libs/ag2d":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sceneManager = exports.Scene = exports.eventHandler = exports.eventEmitter = exports.audioManager = exports.assetLoader = exports.animationManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * AG2D
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @desc A 2D game engine
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

// Dependencies


var _Scene = require('./modules/Scene');

Object.defineProperty(exports, 'Scene', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_Scene).default;
    }
});

var _AnimationManager = require('./modules/AnimationManager');

var _AnimationManager2 = _interopRequireDefault(_AnimationManager);

var _AssetLoader = require('./modules/AssetLoader');

var _AssetLoader2 = _interopRequireDefault(_AssetLoader);

var _AudioManager = require('./modules/AudioManager');

var _AudioManager2 = _interopRequireDefault(_AudioManager);

var _EventEmitter = require('./modules/EventEmitter');

var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

var _EventHandler = require('./modules/EventHandler');

var _EventHandler2 = _interopRequireDefault(_EventHandler);

var _SceneManager = require('./modules/SceneManager');

var _SceneManager2 = _interopRequireDefault(_SceneManager);

var _Utils = require('./modules/Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Class: AG2D
var AG2D = function () {

    // Constructor
    function AG2D() {
        var canvas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.createElement('CANVAS');

        _classCallCheck(this, AG2D);

        // `canvas` param was not a canvas
        if (canvas.tagName.toLowerCase() !== 'canvas') {
            throw new Error(canvas + ' is not a canvas element');
        }

        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.isRunning = false;
        this.interval = 1000 / 60;
        this.size = {
            'height': this.canvas.getBoundingClientRect().height,
            'width': this.canvas.getBoundingClientRect().width
        };
        this.bounds = {
            'height': this.canvas.getBoundingClientRect().height,
            'width': this.canvas.getBoundingClientRect().width
        };

        // Call `resizeCanvas`
        this.resizeCanvas(this.bounds.width, this.bounds.height);

        // Call `setUpHooks`
        this.setUpHooks();
    }

    // Method: clearCanvas


    _createClass(AG2D, [{
        key: 'clearCanvas',
        value: function clearCanvas() {

            // Clear canvas
            this.context.clearRect(0, 0, this.size.width, this.size.height);

            // If `this.backgroundColour` is not `transparent`
            if (this.backgroundColour !== 'transparent') {

                // Set backgroundColour
                this.context.fillStyle = this.backgroundColour;
                this.context.fillRect(0, 0, this.size.width, this.size.height);
            }
        }

        // Method: configure

    }, {
        key: 'configure',
        value: function configure(options) {
            this.fps = options.fps;
            this.interval = 1000 / this.fps;
            this.backgroundColour = options.backgroundColour || 'transparent';

            // Check if `size` was passed
            if (options.size) {
                this.size = {
                    'height': options.size.height,
                    'width': options.size.width
                };
                this.bounds = {
                    'height': options.size.height,
                    'width': options.size.width
                };

                // Call `resizeCanvas`
                this.resizeCanvas(this.bounds.width, this.bounds.height);
            }
        }

        // Method: render

    }, {
        key: 'render',
        value: function render() {

            // Save `context`
            this.context.save();

            // Scale `context` by `devicePixelRatio`
            this.context.scale(window.devicePixelRatio * this.ratio, window.devicePixelRatio * this.ratio);

            // Call `clearCanvas`
            this.clearCanvas();

            // Call `render` on `hooks`
            this.hooks.render();

            // Restore `context`
            this.context.restore();

            // Update `lastRender`
            this.lastRender = window.performance.now();
        }

        // Method: renderLoop

    }, {
        key: 'renderLoop',
        value: function renderLoop() {

            // Render only if `isRunning`
            if (this.isRunning) {

                // Call `renderLoop` on next tick
                window.requestAnimationFrame(this.renderLoop.bind(this));
            }

            // Store reference to current time
            var timeNow = window.performance.now();

            // Calculate delta times
            var updateDeltaTime = timeNow - this.lastUpdate;
            var renderDeltaTime = timeNow - this.lastRender;

            // Call `update` and pass `updateDeltaTime`
            this.update(updateDeltaTime);

            // If `deltaTime` is higher than `interval`
            if (renderDeltaTime > this.interval) {

                // Call `render`
                this.render();
            }
        }

        // Method: setUpHooks

    }, {
        key: 'setUpHooks',
        value: function setUpHooks() {
            var _this = this;

            this.hooks = {
                'update': _Utils.noOp,
                'render': _Utils.noOp,
                'stop': _Utils.noOp,
                'start': _Utils.noOp,
                'bind': function bind(name, func) {
                    _this.hooks[name] = func;
                },
                'unbind': function unbind(name) {
                    delete _this.hooks[name];
                }
            };
        }

        // Method: start

    }, {
        key: 'start',
        value: function start() {

            // Set `isRunning` to `true`
            this.isRunning = true;

            // Set `lastUpdate` and `lastRender`
            var now = window.performance.now();

            this.lastUpdate = now;
            this.lastRender = now;

            // Call `start` on `hooks`
            this.hooks.start();

            // Call `renderLoop`
            this.renderLoop();
        }

        // Method: stop

    }, {
        key: 'stop',
        value: function stop() {

            // Set `isRunning` to `false`
            this.isRunning = false;

            // Call `stop` on `hooks`
            this.hooks.stop();
        }

        // Method: update

    }, {
        key: 'update',
        value: function update(deltaTime) {

            // Call `update` on `hooks`
            this.hooks.update(deltaTime);

            // Update `lastUpdate`
            this.lastUpdate = window.performance.now();
        }

        // Method: resizeCanvas

    }, {
        key: 'resizeCanvas',
        value: function resizeCanvas(width, height) {

            // Calculate the ratios
            var ratio = this.size.width / this.size.height;
            var destRatio = width / height;

            var destWidth = width;
            var destHeight = height;

            // `destRatio` is larger than `ratio`
            if (destRatio > ratio) {

                // Crop width
                destWidth = Math.floor(height * ratio);
            }

            // `destRatio` is smaller than `ratio`
            else {

                    // Crop height
                    destHeight = Math.floor(width / ratio);
                }

            // Update `bounds`
            this.bounds = {
                'height': destHeight,
                'width': destWidth
            };

            // Update `ratio`
            this.ratio = destWidth / this.size.width;

            // Set attributes `height` and `width`
            this.canvas.setAttribute('height', Math.round(destHeight * window.devicePixelRatio));
            this.canvas.setAttribute('width', Math.round(destWidth * window.devicePixelRatio));

            // Set styles `height` and `width`
            this.canvas.style.height = destHeight + 'px';
            this.canvas.style.width = destWidth + 'px';
        }
    }]);

    return AG2D;
}();

// Export `AG2D`


exports.default = AG2D;

// Export `animationManager`

var animationManager = exports.animationManager = new _AnimationManager2.default();

// Export `sssetLoader`
var assetLoader = exports.assetLoader = new _AssetLoader2.default();

// Export `audioManager`
var audioManager = exports.audioManager = new _AudioManager2.default();

// Export `eventEmitter`
var eventEmitter = exports.eventEmitter = new _EventEmitter2.default();

// Export `eventHandler`
var eventHandler = exports.eventHandler = new _EventHandler2.default();

// Export `Scene`


// Export `SceneManager`
var sceneManager = exports.sceneManager = new _SceneManager2.default();

},{"./modules/AnimationManager":3,"./modules/AssetLoader":4,"./modules/AudioManager":5,"./modules/EventEmitter":6,"./modules/EventHandler":7,"./modules/Scene":8,"./modules/SceneManager":9,"./modules/Utils":10}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * AnimationManager
 *
 * @desc An animation manager
 */

// Constructor: AnimationManager
var AnimationManager = function () {

    // Constructor
    function AnimationManager() {
        _classCallCheck(this, AnimationManager);

        // Object to hold animations
        this.animations = {};

        // Array to hold animation names
        this.animationNames = [];
    }

    // Method: add


    _createClass(AnimationManager, [{
        key: "add",
        value: function add(animation) {

            // `animation` doesn't already exist in `animations`
            if (animation.name in this.animations === false) {

                // Add `name` to `animations`
                this.animations[animation.name] = animation;

                // Update `animationNames`
                this.animationNames = Object.keys(this.animations);
            }

            // `animation` does exist in `animation`
            else {

                    // Throw error
                    throw new Error("An animation with the name `" + animation.name + "` already exists");
                }
        }

        // Method: remove

    }, {
        key: "remove",
        value: function remove(name) {

            // `name` does exist in `animations`
            if (name in this.animations) {

                // Remove `name` from `animations`
                delete this.animations[name];

                // Update `animationNames`
                this.animationNames = Object.keys(this.animations);
            }

            // `name` does not exist in `animations`
            else {

                    // Throw error
                    throw new Error("No animation with the name `" + name + "` exists");
                }
        }

        // Method: update

    }, {
        key: "update",
        value: function update(deltaTime) {
            var _this = this;

            // Iterate over `animationNames`
            this.animationNames.forEach(function (animation) {

                // Call `update` on `animation`
                _this.animations[animation].update(deltaTime);
            });
        }
    }]);

    return AnimationManager;
}();

// Export `AnimationManager`


exports.default = AnimationManager;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * AssetLoader
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @desc An asset loader
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

// Depencencies


var _Utils = require('./Utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Class: AssetLoader
var AssetLoader = function () {

    // Constructor
    function AssetLoader() {
        _classCallCheck(this, AssetLoader);

        this.assets = {};
        this.assetsToLoad = [];
        this.assetsLoaded = false;
    }

    // Method: addAsset


    _createClass(AssetLoader, [{
        key: 'addAsset',
        value: function addAsset(asset) {

            // Asset has a type
            if (asset.type) {

                // Switch over `type`
                switch (asset.type) {

                    // Audio
                    case 'audio':
                        {

                            // Asset doesn't have sources
                            if (!asset.sources) {

                                // Throw error
                                throw new Error('Asset does not have sources ' + asset);
                            }

                            // Asset doesn't have a name
                            else if (!asset.name) {

                                    // Throw error
                                    throw new Error('Asset does not have a name ' + asset);
                                }

                                // Asset has everything we need
                                else {

                                        // Add asset to `assetsToLoad`
                                        this.assetsToLoad.push(asset);
                                    }

                            break;
                        }

                    // Image
                    case 'image':
                        {

                            // Asset doesn't have a path
                            if (!asset.path) {

                                // Throw error
                                throw new Error('Asset does not have a path ' + asset);
                            }

                            // Asset doesn't have a name
                            else if (!asset.name) {

                                    // Throw error
                                    throw new Error('Asset does not have a name ' + asset);
                                }

                                // Asset has everything we need
                                else {

                                        // Add asset to `assetsToLoad`
                                        this.assetsToLoad.push(asset);
                                    }

                            break;
                        }

                    // Video
                    case 'video':
                        {

                            // Asset doesn't have sources
                            if (!asset.sources) {

                                // Throw error
                                throw new Error('Asset does not have sources ' + asset);
                            }

                            // Asset doesn't have a name
                            else if (!asset.name) {

                                    // Throw error
                                    throw new Error('Asset does not have a name ' + asset);
                                }

                                // Asset has everything we need
                                else {

                                        // Add asset to `assetsToLoad`
                                        this.assetsToLoad.push(asset);
                                    }

                            break;
                        }

                    // Invalid type
                    default:
                        {

                            // Throw error
                            throw new Error('Asset is not a valid type');
                        }
                }
            }

            // Asset doesn have a type
            else {

                    // Throw error
                    throw new Error('Asset does not have a type', asset);
                }
        }

        // Method: addAssets

    }, {
        key: 'addAssets',
        value: function addAssets(assets) {
            var _this = this;

            // `assets` is not an array
            if (Object.prototype.toString.call(assets) !== '[object Array]') {

                // Throw error
                throw new Error('`addAssets` must be passed an array');
            }

            // `assets` is an array
            else {

                    // Iterate over `assets`
                    assets.forEach(function (asset) {

                        // Call `addAsset`
                        _this.addAsset(asset);
                    });
                }
        }

        // Method: loadAssets

    }, {
        key: 'loadAssets',
        value: function loadAssets() {
            var _this2 = this;

            var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _Utils.noOp;


            // Make sure there are still assets to load
            if (this.assetsToLoad.length > 0) {

                // Set `assetsLoaded` to `false`
                this.assetsLoaded = false;

                // Load the asset
                this.loadAsset(this.assetsToLoad[0], function () {

                    // Move to next asset
                    var _assetsToLoad = _slicedToArray(_this2.assetsToLoad, 1);

                    // Add the asset to `assets`


                    _this2.assets[_this2.assetsToLoad[0].name] = _assetsToLoad[0];
                    _this2.assetsToLoad.shift();

                    // Start loading next asset
                    _this2.loadAssets(callback);
                });
            }

            // There are no more assets
            else {

                    // Set `assetsLoaded` to `true`
                    this.assetsLoaded = true;

                    // Call `callback`
                    return callback();
                }
        }

        // Method: loadAsset

    }, {
        key: 'loadAsset',
        value: function loadAsset(asset, callback) {

            // Switch on `type`
            switch (asset.type) {

                // Audio
                case 'audio':
                    {

                        // Call `loadAudio`
                        this.loadAudio(asset, callback);

                        break;
                    }

                // Image
                case 'image':
                    {

                        // Call `loadImage`
                        this.loadImage(asset, callback);

                        break;
                    }

                case 'video':
                    {

                        // Call `loadVideo`
                        this.loadVideo(asset, callback);

                        break;
                    }

                case 'subtitle':
                    {

                        // Call `loadSubtitle`
                        this.loadSubtitle(asset, callback);

                        break;
                    }

                // Default
                default:
                    {
                        throw new Error('Asset has no type');
                    }
            }
        }

        // Method: loadAudio

    }, {
        key: 'loadAudio',
        value: function loadAudio(asset, callback) {

            // Call `getAudioArrayBuffer`
            (0, _Utils.getAudioArrayBuffer)(asset.sources, function (buffer) {

                // Set buffer
                asset.buffer = buffer;

                // Call `callback`
                callback();
            });
        }

        // Method: loadImage

    }, {
        key: 'loadImage',
        value: function loadImage(asset, callback) {

            // Create new image
            var img = new Image();

            // On load of image
            img.addEventListener('load', function () {

                asset.loaded = true;

                // Add element
                asset.element = img;

                // Call `callback`
                return callback();
            });

            // On error of image
            img.addEventListener('error', function (e) {

                // Throw error
                throw new Error(e);
            });

            // Set `crossOrigin` to `anonymous`
            img.crossOrigin = 'anonymous';

            // Set `img.src`
            img.src = asset.path;
        }

        // Method: loadVideo

    }, {
        key: 'loadVideo',
        value: function loadVideo(asset, callback) {

            // Create new video
            var video = document.createElement('video');

            // Set `element`
            asset.element = video;

            // On error of video
            video.addEventListener('error', function (e) {

                // Throw error
                throw new Error(e);
            });

            // Call `getVideoBlob`
            (0, _Utils.getVideoBlob)(asset.sources, function (blob, supportedVideoType) {

                // Create source element
                var sourceEl = document.createElement('source');

                // Add type
                sourceEl.type = supportedVideoType.type;

                // Add source
                sourceEl.src = blob;

                // Append `sourceEl` to `video`
                video.appendChild(sourceEl);

                // Set `loaded` to `true`
                asset.loaded = true;

                // Call `callback`
                return callback();
            });
        }
    }]);

    return AssetLoader;
}();

// Export `AssetLoader`


exports.default = AssetLoader;

},{"./Utils":10}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * AudioManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @desc An audio manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

// Dependencies


var _Utils = require('./Utils');

var _EventHandler = require('./EventHandler');

var _EventHandler2 = _interopRequireDefault(_EventHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Constructor: AudioManager
var AudioManager = function () {

    // Constructor
    function AudioManager() {
        _classCallCheck(this, AudioManager);

        // Create `eventHandler`
        this.eventHandler = new _EventHandler2.default();

        // Object to hold audioClips
        this.audioClips = {};

        // Array to hold audioClip names
        this.audioClipNames = [];
    }

    // Method: add


    _createClass(AudioManager, [{
        key: 'add',
        value: function add(audioClip) {

            // `audioClip` doesn't already exist in `audioClips`
            if (audioClip.name in this.audioClips === false) {

                // Add `name` to `audioClips`
                this.audioClips[audioClip.name] = audioClip;

                // Update `audioClipNames`
                this.audioClipNames = Object.keys(this.audioClips);
            }

            // `audioClip` does exist in `audioClip`
            else {

                    // Throw error
                    throw new Error('An audioClip with the name `' + audioClip.name + '` already exists');
                }
        }

        // Method: init

    }, {
        key: 'init',
        value: function init() {
            var _this = this;

            var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _Utils.noOp;


            // Function to create an audio context
            var createContext = function createContext() {

                // Create new `audioContextPatch`
                _this.context = (0, _Utils.createAudioContext)();

                // Remove event handlers
                _this.eventHandler.removeEvent('iOSTouchStartAudioContext');
                _this.eventHandler.removeEvent('iOSTouchEndAudioContext');

                // Call `cb`
                return cb();
            };

            // Regular expression that matches iOS devices
            var iOSRegex = new RegExp('iPhone|iPad|iPod', 'i');

            // Is iOS
            if (iOSRegex.test(navigator.userAgent) && !window.MSStream) {

                // Handle audio context for iOS 6-8
                this.eventHandler.addEvent({
                    'name': 'iOSTouchStartAudioContext',
                    'element': document,
                    'type': 'touchstart',
                    'function': createContext.bind(this)
                });

                // Handle audio context for iOS 9-10
                this.eventHandler.addEvent({
                    'name': 'iOSTouchEndAudioContext',
                    'element': document,
                    'type': 'touchend',
                    'function': createContext.bind(this)
                });
            }

            // Is not iOS
            else {

                    // Create `context`
                    this.context = (0, _Utils.createAudioContext)();

                    // Call `cb`
                    return cb();
                }
        }

        // Method: play

    }, {
        key: 'play',
        value: function play(name) {

            if (!this.audioClips[name].element) {
                this.audioClips[name].element = this.context.createBufferSource();
                this.audioClips[name].element.buffer = this.audioClips[name].buffer;
                this.audioClips[name].element.connect(this.context.destination);
            }

            this.audioClips[name].element.start(0);
        }

        // Method: remove

    }, {
        key: 'remove',
        value: function remove(name) {

            // `name` does exist in `audioClips`
            if (name in this.audioClips) {

                // Remove `name` from `audioClips`
                delete this.audioClips[name];

                // Update `audioClipNames`
                this.audioClipNames = Object.keys(this.audioClips);
            }

            // `name` does not exist in `audioClips`
            else {

                    // Throw error
                    throw new Error('No audioClip with the name `' + name + '` exists');
                }
        }

        // Method: stop

    }, {
        key: 'stop',
        value: function stop(name) {

            if (this.audioClips[name].element) {
                this.audioClips[name].element.disconnect(this.context.destination);
                delete this.audioClips[name].element;
            }
        }
    }]);

    return AudioManager;
}();

// Export `AudioManager`


exports.default = AudioManager;

},{"./EventHandler":7,"./Utils":10}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * EventEmitter
 *
 * @desc An event emitter
 */

// Class: EventEmitter
var EventEmitter = function () {

    // Constructor
    function EventEmitter() {
        _classCallCheck(this, EventEmitter);

        // Set `listenersMap`
        this.listeners = [];
    }

    // Method: addListener


    _createClass(EventEmitter, [{
        key: 'addListener',
        value: function addListener(name, callback) {
            var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;


            // `name` doesn't exist in `listeners`
            if (typeof this.listeners[name] === 'undefined') {

                // Create array
                this.listeners[name] = [];
            }

            // Create `reference`
            var reference = {
                name: name,
                callback: callback,
                count: count
            };

            // Push `reference` to `listeners[name]`
            this.listeners[name].push(reference);

            // Return `reference` so we can remove it later
            return reference;
        }

        // Method: removeListener

    }, {
        key: 'removeListener',
        value: function removeListener(reference) {

            // `name` exists in `listeners`
            if (typeof this.listeners[reference.name] !== 'undefined') {

                // Remove `reference` from `listeners[reference.name]`
                this.listeners[reference.name] = this.listeners[reference.name].filter(function (eventListener) {
                    return reference !== eventListener;
                });

                // Remove `reference.name` if `length` is `0`
                if (this.listeners[reference.name].length === 0) {
                    delete this.listeners[reference.name];
                }
            }
        }

        // Method: emit

    }, {
        key: 'emit',
        value: function emit(name) {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            // `name` exists in `listeners`
            if (Object.keys(this.listeners).includes(name)) {

                // Iterate over each `listener`
                this.listeners[name].forEach(function (listener) {

                    // Call `callback`
                    listener.callback.apply(listener, args);

                    // Decrement `count`
                    listener.count -= 1;

                    // `count` is less than or equal to `0`
                    if (listener.count <= 0) {

                        // Remove `listener` from `listeners[name]`
                        _this.listeners[name] = _this.listeners[name].filter(function (eventListener) {
                            return listener !== eventListener;
                        });
                    }
                });
            }
        }
    }]);

    return EventEmitter;
}();

// Export `EventEmitter`


exports.default = EventEmitter;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Modules: Event Handler
 */

// Constructor: EventHandler
var EventHandler = function () {

    // Constructor
    function EventHandler() {
        _classCallCheck(this, EventHandler);

        // Object to store `events`
        this.events = {};
    }

    // Method: addEvent


    _createClass(EventHandler, [{
        key: 'addEvent',
        value: function addEvent(name, type, el, fn) {

            // `evt` will hold the final object
            var evt = undefined;

            // Passed individual params and not an object
            if (arguments.length > 1) {

                // Create the object
                evt = {
                    name: name,
                    'element': el,
                    type: type,
                    'function': fn
                };
            }

            // Passed object as first param
            else {

                    // Set `evt` to `name`
                    evt = name;
                }

            // Create new `CustomEvent`
            var customEvent = Object.assign({}, evt);

            // `name` already exists
            if (Object.prototype.hasOwnProperty.call(this.events, customEvent.name)) {

                // Throw error
                throw new Error('`name` of `' + customEvent.name + '` is already in use');
            }

            // Add the listener to the element
            customEvent.element.addEventListener(customEvent.type, customEvent.function);

            // Add `customEvent` to `events`
            this.events[customEvent.name] = customEvent;
        }

        // Method: removeEvent

    }, {
        key: 'removeEvent',
        value: function removeEvent(eventName) {

            // `eventName` is undefined
            if (typeof this.events[eventName] === 'undefined') {

                // Throw error
                throw new Error('There is no event named `' + eventName + '`');
            }

            // `eventName` is defined
            else {

                    // Store reference to `customEvent`
                    var customEvent = this.events[eventName];

                    // Remove the listener from the element
                    customEvent.element.removeEventListener(customEvent.type, customEvent.function);

                    // Remove `customEvent` from `events`
                    delete this.events[customEvent.name];
                }
        }

        // Method: removeEvents

    }, {
        key: 'removeEvents',
        value: function removeEvents() {
            var _this = this;

            // Get all event names from `events`
            var eventNames = Object.keys(this.events);

            // Iterate over `eventNames`
            eventNames.forEach(function (eventName) {

                // Store reference to `currentEvent`
                var customEvent = _this.events[eventName];

                // Remove `customEvent` from `events`
                _this.removeEvent(customEvent.name);
            });
        }
    }]);

    return EventHandler;
}();

// Export `EventHandler`


exports.default = EventHandler;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Modules: Scene
 */

// Class: Scene
var Scene = function () {

    // Constructor
    function Scene() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Default';

        _classCallCheck(this, Scene);

        // Set `name`
        this.name = name;

        // Set `enteredCount` and `exitedCount`
        this.enterCount = 0;
        this.exitCount = 0;

        console.log('Init: ' + this.name);
    }

    // Method: render


    _createClass(Scene, [{
        key: 'render',
        value: function render() {
            console.log('Render: ' + this.name);
        }

        // Method: sceneEnter

    }, {
        key: 'sceneEnter',
        value: function sceneEnter() {
            console.log('Scene Enter: ' + this.name);
        }

        // Method: sceneExit

    }, {
        key: 'sceneExit',
        value: function sceneExit() {
            console.log('Scene Exit: ' + this.name);
        }

        // Method: update

    }, {
        key: 'update',
        value: function update() {
            console.log('Update: ' + this.name);
        }
    }]);

    return Scene;
}();

// Export `Scene`


exports.default = Scene;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * SceneManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @desc A scene manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

// Dependencies


var _Utils = require('./Utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Class: SceneManager
var SceneManager = function () {

    // Constructor
    function SceneManager() {
        _classCallCheck(this, SceneManager);

        // Object to hold scenes
        this.scenes = {};

        // Array to hold the scene names
        this.sceneNames = [];
    }

    // Method: add


    _createClass(SceneManager, [{
        key: 'add',
        value: function add(scene) {

            // Add `name` to `scenes`
            this.scenes[scene.name] = scene;

            // Update `sceneNames`
            this.sceneNames = Object.keys(this.scenes);
        }

        // Method: goTo

    }, {
        key: 'goTo',
        value: function goTo(name) {

            // Check `scenes[name]` exists
            if (this.scenes[name]) {

                // Check `currentScene` exists and it has `sceneExit`
                if (this.currentScene && this.currentScene.sceneExit) {

                    // Call `sceneExit`
                    this.currentScene.sceneExit();

                    // Increment `exitCount`
                    this.currentScene.exitCount += 1;
                }

                // Set `currentScene`
                this.currentScene = this.scenes[name];

                // Check `sceneEnter` exists
                if (this.currentScene.sceneEnter) {

                    // Update `currentScene.sceneEntered`
                    this.currentScene.sceneEntered = window.performance.now();

                    // Call `sceneEnter`
                    this.currentScene.sceneEnter();

                    // Increment `enterCount`
                    this.currentScene.enterCount += 1;
                }
            }

            // `scenes[name]` does not exist
            else {

                    // Log error
                    throw new Error('Scene ' + name + ' does not exist');
                }
        }

        // Method: next

    }, {
        key: 'next',
        value: function next() {

            // Go to next scene
            this.goTo(this.scenes[(0, _Utils.cyclicArray)(this.sceneNames, this.sceneNames.indexOf(this.currentScene.name) + 1).value].name);
        }

        // Method: previous

    }, {
        key: 'previous',
        value: function previous() {

            // Go to previous scene
            this.goTo(this.scenes[(0, _Utils.cyclicArray)(this.sceneNames, this.sceneNames.indexOf(this.currentScene.name) - 1).value].name);
        }

        // Method: remove

    }, {
        key: 'remove',
        value: function remove(name) {

            // Remove `name` from `scenes`
            delete this.scenes[name];

            // Update `sceneNames`
            this.sceneNames = Object.keys(this.scenes);
        }

        // Method: render

    }, {
        key: 'render',
        value: function render() {

            // Check there is a current scene and it has `render`
            if (this.currentScene && this.currentScene.render) {

                // Call `render`
                this.currentScene.render();
            }
        }

        // Method: update

    }, {
        key: 'update',
        value: function update(deltaTime) {

            // Check there is a current scene and it has `update`
            if (this.currentScene && this.currentScene.update) {

                // Call `update`
                this.currentScene.update(deltaTime);
            }
        }
    }]);

    return SceneManager;
}();

// Export `SceneManager`


exports.default = SceneManager;

},{"./Utils":10}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * Utils
 */

// Create Audio Context
var createAudioContext = function createAudioContext() {
    var desiredSampleRate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 44100;


    // Deal with browser prefixes
    var AudioContext = window.AudioContext || window.webkitAudioContext;

    // Create new audio context
    var audioContext = new AudioContext();

    // Regular expression that matches iOS devices
    var iOSRegex = new RegExp('iPhone|iPad|iPod', 'i');

    // Warm a `context`
    var warmContext = function warmContext(context, sampleRate) {

        // Create buffer and warmer source
        var buffer = context.createBuffer(1, 1, sampleRate);
        var warmer = context.createBufferSource();

        // Set `warmer.buffer` to `buffer`
        warmer.buffer = buffer;

        // Connect `warmer`
        warmer.connect(context.destination);

        // Play `warmer`
        if (warmer.start) {
            warmer.start(0);
        } else if (warmer.noteOn) {
            warmer.noteOn(0);
        }

        // Disconnect `warmer`
        warmer.disconnect();
    };

    /**
     * There is a bug with iOS 6+ where you will get an incorrect sample rate
     * which causes distortion. The below checks for that and fixes it for you
     * by creating an audio context, destroying it, then creating a new one
     */

    // Check if iOS
    if (iOSRegex.test(navigator.userAgent) && !window.MSStream) {

        // Warm the context
        warmContext(audioContext, desiredSampleRate);

        // `sampleRate` does not match `desiredSampleRate`
        if (audioContext.sampleRate !== desiredSampleRate) {

            // Close `audioContext`
            audioContext.close();

            // Create new `AudioContext`
            audioContext = new AudioContext();

            // Warm the new context
            warmContext(audioContext, desiredSampleRate);
        }
    }

    // Return `audioContext`
    return audioContext;
};

// Cyclic Array
var cyclicArray = function cyclicArray(arr, index) {

    var item = (index % arr.length + arr.length) % arr.length;

    return {
        'index': item,
        'value': arr[item]
    };
};

// Get Video Blob
var getVideoBlob = function getVideoBlob(sources, callback) {

    // Create `testVideo`
    var testVideo = document.createElement('video');

    // Variable to hold the supported video type
    var supportedVideoType = undefined;

    // Array of video types in order of preference
    var supportedVideoTypes = ['video/ogg; codecs="theora"', 'video/webm; codecs="vp8, vorbis"', 'video/mp4; codecs="avc1.42E01E"'];

    // Iterate over `supportedVideoTypes`

    var _loop = function _loop(i) {

        // Browser can play `supportedVideoTypes[i]`
        if (testVideo.canPlayType(supportedVideoTypes[i])) {
            var _sources$filter = sources.filter(function (videoSource) {
                return videoSource.type === supportedVideoTypes[i].match(/[^;]*/gi)[0];
            });

            // Get the source from `sources`


            var _sources$filter2 = _slicedToArray(_sources$filter, 1);

            supportedVideoType = _sources$filter2[0];

            return 'break';
        }
    };

    for (var i = 0; i < supportedVideoTypes.length; i++) {
        var _ret = _loop(i);

        if (_ret === 'break') break;
    }

    // Create `req`
    var req = new XMLHttpRequest();

    // On load
    req.onload = function () {
        var source = URL.createObjectURL(req.response);

        // Call `callback` and pass `source`
        return callback(source, supportedVideoType);
    };

    // On Error
    req.onerror = function (e) {

        // Throw error
        throw new Error(e);
    };

    // Open `req`
    req.open('get', supportedVideoType.path);

    // Set `responseType` to `blob`
    req.responseType = 'blob';

    // Send `req`
    req.send();
};

// Get Audio Array Buffer
var getAudioArrayBuffer = function getAudioArrayBuffer(sources, callback) {

    // Create `testAudio`
    var testAudio = document.createElement('audio');

    // Variable to hold the supported audio type
    var supportedAudioType = undefined;

    // Array of audio types in order of preference
    var supportedAudioTypes = ['audio/ogg; codecs="vorbis"', 'audio/mpeg; codec="mp3"'];

    // Iterate over `supportedAudioTypes`

    var _loop2 = function _loop2(i) {

        // Browser can play `supportedAudioTypes[i]`
        if (testAudio.canPlayType(supportedAudioTypes[i])) {
            var _sources$filter3 = sources.filter(function (audioSource) {
                return audioSource.type === supportedAudioTypes[i].match(/[^;]*/gi)[0];
            });

            // Get the source from `sources`


            var _sources$filter4 = _slicedToArray(_sources$filter3, 1);

            supportedAudioType = _sources$filter4[0];

            return 'break';
        }
    };

    for (var i = 0; i < supportedAudioTypes.length; i++) {
        var _ret2 = _loop2(i);

        if (_ret2 === 'break') break;
    }

    // Sort out prefix
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // Create `audioContext`
    var audioContext = createAudioContext();

    // Close `audioContext`
    audioContext.close();

    // Create `request`
    var request = new XMLHttpRequest();

    // Open `request`
    request.open('GET', supportedAudioType.path, true);

    // Set `responseType` to `arraybuffer`
    request.responseType = 'arraybuffer';

    // Loaded
    request.onload = function () {

        // Decode buffer
        audioContext.decodeAudioData(request.response,

        // Decoded successfully
        function (buffer) {

            // Call `callback` and pass `buffer`
            callback(buffer);
        },

        // Error decoding
        function (e) {
            throw new Error(e);
        });
    };

    // Error
    request.onerror = function (e) {
        throw new Error(e);
    };

    // Send `request`
    request.send();
};

// No Op
var noOp = function noOp() {};

// Export Utilities
exports.createAudioContext = createAudioContext;
exports.cyclicArray = cyclicArray;
exports.getAudioArrayBuffer = getAudioArrayBuffer;
exports.getVideoBlob = getVideoBlob;
exports.noOp = noOp;

},{}],11:[function(require,module,exports){
'use strict';

var _experience = require('./experience');

var _experience2 = _interopRequireDefault(_experience);

var _ag2d = require('./libs/ag2d');

var _SceneMobileInteraction = require('./scenes/SceneMobileInteraction');

var _SceneMobileInteraction2 = _interopRequireDefault(_SceneMobileInteraction);

var _SceneLoading = require('./scenes/SceneLoading');

var _SceneLoading2 = _interopRequireDefault(_SceneLoading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Asset Loader setup
 */


// Scenes
/**
 * Page: ag2dPage
 */

// Dependencies
_ag2d.assetLoader.addAssets([{
    'type': 'audio',
    'name': 'TestAudio',
    'sources': [{
        'type': 'audio/ogg',
        'path': '/audio/TestAudio.ogg'
    }, {
        'type': 'audio/mpeg',
        'path': '/audio/TestAudio.mp3'
    }]
}, {
    'type': 'video',
    'name': 'TestVideo',
    'sources': [{
        'type': 'video/ogg',
        'path': '/video/TestVideo.ogg'
    }, {
        'type': 'video/webm',
        'path': '/video/TestVideo.webm'
    }, {
        'type': 'video/mp4',
        'path': '/video/TestVideo.mp4'
    }]
}]);

/**
 * Scene Manager setup
 */

// Add `SceneMobileInteraction` to `sceneManager`
_ag2d.sceneManager.add(new _SceneMobileInteraction2.default());

// Add `SceneLoading` to `sceneManager`
_ag2d.sceneManager.add(new _SceneLoading2.default());

/**
 * Start experience
 */

// Resize experience to window
_experience2.default.resizeCanvas(window.innerWidth, window.innerHeight);

// Add event listener to resize experience when window resizes
window.addEventListener('resize', function () {
    _experience2.default.resizeCanvas(window.innerWidth, window.innerHeight);
});

// Go to `SceneMobileInteraction`
_ag2d.sceneManager.goTo('SceneMobileInteraction');

window.audioManager = _ag2d.audioManager;

// Call `start`
_experience2.default.start();

},{"./experience":1,"./libs/ag2d":2,"./scenes/SceneLoading":12,"./scenes/SceneMobileInteraction":13}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _experience = require('../experience');

var _experience2 = _interopRequireDefault(_experience);

var _ag2d = require('../libs/ag2d');

var _SceneStart = require('./SceneStart');

var _SceneStart2 = _interopRequireDefault(_SceneStart);

var _SceneOne = require('./SceneOne');

var _SceneOne2 = _interopRequireDefault(_SceneOne);

var _SceneTwo = require('./SceneTwo');

var _SceneTwo2 = _interopRequireDefault(_SceneTwo);

var _SceneThree = require('./SceneThree');

var _SceneThree2 = _interopRequireDefault(_SceneThree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * SceneLoading
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// Dependencies


// Scenes


// Class: SceneLoading
var SceneLoading = function (_Scene) {
    _inherits(SceneLoading, _Scene);

    // Constructor
    function SceneLoading() {
        _classCallCheck(this, SceneLoading);

        // Set name of scene
        return _possibleConstructorReturn(this, (SceneLoading.__proto__ || Object.getPrototypeOf(SceneLoading)).call(this, 'SceneLoading'));
    }

    // Method: render


    _createClass(SceneLoading, [{
        key: 'render',
        value: function render() {

            // Yellow background
            _experience2.default.context.fillStyle = '#FFFF00';
            _experience2.default.context.fillRect(0, 0, _experience2.default.size.width, _experience2.default.size.height);

            // Scene name
            _experience2.default.context.textAlign = 'center';
            _experience2.default.context.textBaseline = 'middle';
            _experience2.default.context.fillStyle = '#000000';
            _experience2.default.context.fillText(this.name, _experience2.default.size.width / 2, _experience2.default.size.height / 2);
        }

        // Method: sceneEnter

    }, {
        key: 'sceneEnter',
        value: function sceneEnter() {

            // Scene hasn't been entered before
            if (this.enterCount === 0) {

                // Listener for `assetLoader` loaded
                _ag2d.eventEmitter.addListener('assetLoader:loaded', function () {

                    /**
                     * Audio Manager setup
                     */

                    // Add `TestAudio` to `audioManager`
                    _ag2d.audioManager.add(_ag2d.assetLoader.assets.TestAudio);

                    /**
                     * Scene Manager setup
                     */

                    // Add `SceneStart` to `sceneManager`
                    _ag2d.sceneManager.add(new _SceneStart2.default());

                    // Add `SceneOne` to `sceneManager`
                    _ag2d.sceneManager.add(new _SceneOne2.default());

                    // Add `SceneTwo` to `sceneManager`
                    _ag2d.sceneManager.add(new _SceneTwo2.default());

                    // Add `SceneThree` to `sceneManager`
                    _ag2d.sceneManager.add(new _SceneThree2.default());

                    // Go to `SceneStart`
                    _ag2d.sceneManager.goTo('SceneStart');
                }, 1);

                // Call `loadAssets`
                _ag2d.assetLoader.loadAssets(function () {

                    // Emit loaded
                    _ag2d.eventEmitter.emit('assetLoader:loaded');
                });
            }
        }
    }]);

    return SceneLoading;
}(_ag2d.Scene);

// Export `SceneLoading`


exports.default = SceneLoading;

},{"../experience":1,"../libs/ag2d":2,"./SceneOne":14,"./SceneStart":15,"./SceneThree":16,"./SceneTwo":17}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _experience = require('../experience');

var _experience2 = _interopRequireDefault(_experience);

var _ag2d = require('../libs/ag2d');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * SceneMobileInteraction
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// Dependencies


// Create the Mobile Interaction Scene
var SceneMobileInteraction = function (_Scene) {
    _inherits(SceneMobileInteraction, _Scene);

    // Constructor
    function SceneMobileInteraction() {
        _classCallCheck(this, SceneMobileInteraction);

        // Set name of scene
        return _possibleConstructorReturn(this, (SceneMobileInteraction.__proto__ || Object.getPrototypeOf(SceneMobileInteraction)).call(this, 'SceneMobileInteraction'));
    }

    // Method: render


    _createClass(SceneMobileInteraction, [{
        key: 'render',
        value: function render() {

            // Red background
            _experience2.default.context.fillStyle = '#FF0000';
            _experience2.default.context.fillRect(0, 0, _experience2.default.size.width, _experience2.default.size.height);

            // Scene name
            _experience2.default.context.textAlign = 'center';
            _experience2.default.context.textBaseline = 'middle';
            _experience2.default.context.fillStyle = '#000000';
            _experience2.default.context.fillText(this.name, _experience2.default.size.width / 2, _experience2.default.size.height / 2);
        }

        // Method: sceneEnter

    }, {
        key: 'sceneEnter',
        value: function sceneEnter() {

            // Scene hasn't been entered before
            if (this.enterCount === 0) {

                // Listener for `audioManager` context ready
                _ag2d.eventEmitter.addListener('audioManager:context ready', function () {

                    // Go to `SceneLoading`
                    _ag2d.sceneManager.goTo('SceneLoading');
                }, 1);

                // Call `init` on `audioManager`
                _ag2d.audioManager.init(function () {

                    // Emit when context is ready
                    _ag2d.eventEmitter.emit('audioManager:context ready');
                });
            }
        }
    }]);

    return SceneMobileInteraction;
}(_ag2d.Scene);

// Export `SceneMobileInteraction`


exports.default = SceneMobileInteraction;

},{"../experience":1,"../libs/ag2d":2}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _experience = require('../experience');

var _experience2 = _interopRequireDefault(_experience);

var _ag2d = require('../libs/ag2d');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Scenes: SceneOne
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// Dependencies


// Class: SceneOne
var SceneOne = function (_Scene) {
    _inherits(SceneOne, _Scene);

    // Constructor
    function SceneOne() {
        _classCallCheck(this, SceneOne);

        // Set `video`
        var _this2 = _possibleConstructorReturn(this, (SceneOne.__proto__ || Object.getPrototypeOf(SceneOne)).call(this, 'SceneOne'));

        // Set name of scene


        _this2.video = _ag2d.assetLoader.assets.TestVideo;
        return _this2;
    }

    // Method: render


    _createClass(SceneOne, [{
        key: 'render',
        value: function render() {

            // Red background
            _experience2.default.context.fillStyle = '#FF0000';
            _experience2.default.context.fillRect(0, 0, _experience2.default.size.width, _experience2.default.size.height);

            // Render `video`
            _experience2.default.context.drawImage(this.video.element, 0, 0);

            // Scene name
            _experience2.default.context.textAlign = 'center';
            _experience2.default.context.textBaseline = 'middle';
            _experience2.default.context.fillStyle = '#000000';
            _experience2.default.context.fillText(this.name, _experience2.default.size.width / 2, _experience2.default.size.height / 2);
        }

        // Method: sceneEnter

    }, {
        key: 'sceneEnter',
        value: function sceneEnter() {

            // Set `currentTime` to `0`
            this.video.element.currentTime = 0;

            // Play `video`
            this.video.element.play();

            // Store reference to `this`
            var _this = this;

            // Once the video is completed
            this.video.element.addEventListener('ended', function nextScene() {
                _this.video.element.removeEventListener('ended', nextScene, false);
                _ag2d.sceneManager.next();
            });

            // Play `TestAudio`
            _ag2d.audioManager.play('TestAudio');
        }

        // Method: sceneExit

    }, {
        key: 'sceneExit',
        value: function sceneExit() {

            // Pause `video`
            this.video.element.pause();

            // Set `currentTime` to `0`
            this.video.element.currentTime = 0;

            // Stop `TestAudio`
            _ag2d.audioManager.stop('TestAudio');
        }
    }]);

    return SceneOne;
}(_ag2d.Scene);

// Export `SceneOne`


exports.default = SceneOne;

},{"../experience":1,"../libs/ag2d":2}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _experience = require('../experience');

var _experience2 = _interopRequireDefault(_experience);

var _ag2d = require('../libs/ag2d');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * SceneStart
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// Dependencies


// Create the start Scene
var SceneStart = function (_Scene) {
    _inherits(SceneStart, _Scene);

    // Constructor
    function SceneStart() {
        _classCallCheck(this, SceneStart);

        // Set name of scene
        return _possibleConstructorReturn(this, (SceneStart.__proto__ || Object.getPrototypeOf(SceneStart)).call(this, 'SceneStart'));
    }

    // Method: render


    _createClass(SceneStart, [{
        key: 'render',
        value: function render() {

            // Red background
            _experience2.default.context.fillStyle = '#FF0000';
            _experience2.default.context.fillRect(0, 0, _experience2.default.size.width, _experience2.default.size.height);

            // Scene name
            _experience2.default.context.textAlign = 'center';
            _experience2.default.context.textBaseline = 'middle';
            _experience2.default.context.fillStyle = '#000000';
            _experience2.default.context.fillText(this.name, _experience2.default.size.width / 2, _experience2.default.size.height / 2);
        }

        // Method: sceneEnter

    }, {
        key: 'sceneEnter',
        value: function sceneEnter() {

            // Bind `click` interaction
            _ag2d.eventHandler.addEvent({
                'name': 'SceneStartInteraction',
                'element': _experience2.default.canvas,
                'type': 'click',
                'function': function _function() {
                    _ag2d.sceneManager.next();
                }
            });
        }

        // Method: sceneExit

    }, {
        key: 'sceneExit',
        value: function sceneExit() {

            // Unbind `click` interaction
            _ag2d.eventHandler.removeEvent('SceneStartInteraction');
        }
    }]);

    return SceneStart;
}(_ag2d.Scene);

// Export `SceneStart`


exports.default = SceneStart;

},{"../experience":1,"../libs/ag2d":2}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _experience = require('../experience');

var _experience2 = _interopRequireDefault(_experience);

var _ag2d = require('../libs/ag2d');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Scenes: SceneThree
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// Dependencies


// Class: SceneThree
var SceneThree = function (_Scene) {
    _inherits(SceneThree, _Scene);

    // Constructor
    function SceneThree() {
        _classCallCheck(this, SceneThree);

        // Set `video`
        var _this = _possibleConstructorReturn(this, (SceneThree.__proto__ || Object.getPrototypeOf(SceneThree)).call(this, 'SceneThree'));

        // Set name of scene


        _this.video = _ag2d.assetLoader.assets.TestVideo;
        return _this;
    }

    // Method: render


    _createClass(SceneThree, [{
        key: 'render',
        value: function render() {

            // Red background
            _experience2.default.context.fillStyle = '#FF0000';
            _experience2.default.context.fillRect(0, 0, _experience2.default.size.width, _experience2.default.size.height);

            // Render `video`
            _experience2.default.context.drawImage(this.video.element, 0, 0);

            // Scene name
            _experience2.default.context.textAlign = 'center';
            _experience2.default.context.textBaseline = 'middle';
            _experience2.default.context.fillStyle = '#000000';
            _experience2.default.context.fillText(this.name, _experience2.default.size.width / 2, _experience2.default.size.height / 2);
        }

        // Method: sceneEnter

    }, {
        key: 'sceneEnter',
        value: function sceneEnter() {

            // Set `currentTime` to `0`
            this.video.element.currentTime = 0;

            // Play `video`
            this.video.element.play();

            // Play `TestAudio`
            _ag2d.audioManager.play('TestAudio');
        }

        // Method: sceneExit

    }, {
        key: 'sceneExit',
        value: function sceneExit() {

            // Pause `video`
            this.video.element.pause();

            // Set `currentTime` to `0`
            this.video.element.currentTime = 0;

            // Stop `TestAudio`
            _ag2d.audioManager.stop('TestAudio');
        }
    }]);

    return SceneThree;
}(_ag2d.Scene);

// Export `SceneThree`


exports.default = SceneThree;

},{"../experience":1,"../libs/ag2d":2}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _experience = require('../experience');

var _experience2 = _interopRequireDefault(_experience);

var _ag2d = require('../libs/ag2d');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Scenes: SceneTwo
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// Dependencies


// Class: SceneTwo
var SceneTwo = function (_Scene) {
    _inherits(SceneTwo, _Scene);

    // Constructor
    function SceneTwo() {
        _classCallCheck(this, SceneTwo);

        // Set `video`
        var _this2 = _possibleConstructorReturn(this, (SceneTwo.__proto__ || Object.getPrototypeOf(SceneTwo)).call(this, 'SceneTwo'));

        // Set name of scene


        _this2.video = _ag2d.assetLoader.assets.TestVideo;
        return _this2;
    }

    // Method: render


    _createClass(SceneTwo, [{
        key: 'render',
        value: function render() {

            // Red background
            _experience2.default.context.fillStyle = '#FF0000';
            _experience2.default.context.fillRect(0, 0, _experience2.default.size.width, _experience2.default.size.height);

            // Render `video`
            _experience2.default.context.drawImage(this.video.element, 0, 0);

            // Scene name
            _experience2.default.context.textAlign = 'center';
            _experience2.default.context.textBaseline = 'middle';
            _experience2.default.context.fillStyle = '#000000';
            _experience2.default.context.fillText(this.name, _experience2.default.size.width / 2, _experience2.default.size.height / 2);
        }

        // Method: sceneEnter

    }, {
        key: 'sceneEnter',
        value: function sceneEnter() {

            // Set `currentTime` to `0`
            this.video.element.currentTime = 0;

            // Play `video`
            this.video.element.play();

            // Store reference to `this`
            var _this = this;

            // Once the video is completed
            this.video.element.addEventListener('ended', function nextScene() {
                _this.video.element.removeEventListener('ended', nextScene, false);
                _ag2d.sceneManager.next();
            });

            // Play `TestAudio`
            _ag2d.audioManager.play('TestAudio');
        }

        // Method: sceneExit

    }, {
        key: 'sceneExit',
        value: function sceneExit() {

            // Pause `video`
            this.video.element.pause();

            // Set `currentTime` to `0`
            this.video.element.currentTime = 0;

            // Stop `TestAudio`
            _ag2d.audioManager.stop('TestAudio');
        }
    }]);

    return SceneTwo;
}(_ag2d.Scene);

// Export `SceneTwo`


exports.default = SceneTwo;

},{"../experience":1,"../libs/ag2d":2}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvZXhwZXJpZW5jZS5qcyIsInNyYy9qcy9saWJzL2FnMmQvaW5kZXguanMiLCJzcmMvanMvbGlicy9hZzJkL21vZHVsZXMvQW5pbWF0aW9uTWFuYWdlci5qcyIsInNyYy9qcy9saWJzL2FnMmQvbW9kdWxlcy9Bc3NldExvYWRlci5qcyIsInNyYy9qcy9saWJzL2FnMmQvbW9kdWxlcy9BdWRpb01hbmFnZXIuanMiLCJzcmMvanMvbGlicy9hZzJkL21vZHVsZXMvRXZlbnRFbWl0dGVyLmpzIiwic3JjL2pzL2xpYnMvYWcyZC9tb2R1bGVzL0V2ZW50SGFuZGxlci5qcyIsInNyYy9qcy9saWJzL2FnMmQvbW9kdWxlcy9TY2VuZS5qcyIsInNyYy9qcy9saWJzL2FnMmQvbW9kdWxlcy9TY2VuZU1hbmFnZXIuanMiLCJzcmMvanMvbGlicy9hZzJkL21vZHVsZXMvVXRpbHMuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9zY2VuZXMvU2NlbmVMb2FkaW5nLmpzIiwic3JjL2pzL3NjZW5lcy9TY2VuZU1vYmlsZUludGVyYWN0aW9uLmpzIiwic3JjL2pzL3NjZW5lcy9TY2VuZU9uZS5qcyIsInNyYy9qcy9zY2VuZXMvU2NlbmVTdGFydC5qcyIsInNyYy9qcy9zY2VuZXMvU2NlbmVUaHJlZS5qcyIsInNyYy9qcy9zY2VuZXMvU2NlbmVUd28uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNLQTs7Ozs7O0FBRUE7QUFDQSxJQUFNLGFBQWEsbUJBQVMsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQVQsQ0FBbkI7O0FBRUE7QUFWQTs7OztBQUlBO0FBT0EsV0FBVyxTQUFYLENBQXFCO0FBQ2pCLFdBQU8sRUFEVTtBQUVqQix3QkFBb0IsU0FGSDtBQUdqQixZQUFRO0FBQ0osa0JBQVUsR0FETjtBQUVKLGlCQUFTO0FBRkw7QUFIUyxDQUFyQjs7QUFTQTtBQUNBLElB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QVksT0FBWixDQUFvQixtQkFBcEIsQ0FBd0MsT0FBeEMsRUFBaUQsU0FBakQsRUFBNEQsS0FBNUQ7QUFDQSxtQ0FBYSxJQUFiO0FBQ0gsYUFIRDs7QUFLQTtBQUNBLCtCQUFhLElBQWIsQ0FBa0IsV0FBbEI7QUFDSDs7QUFFRDs7OztvQ0FDYTs7QUFFVDtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEtBQW5COztBQUVBO0FBQ0EsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsV0FBbkIsR0FBaUMsQ0FBakM7O0FBRUE7QUFDQSwrQkFBYSxJQUFiLENBQWtCLFdBQWxCO0FBQ0g7Ozs7OztBQUdMOzs7a0JBQ2UsUSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIEV4cGVyaWVuY2VcbiAqL1xuXG4vLyBEZXBlbmRlbmNpZXNcbmltcG9ydCBBRzJELCB7YW5pbWF0aW9uTWFuYWdlciwgc2NlbmVNYW5hZ2VyfSBmcm9tICcuL2xpYnMvYWcyZCc7XG5cbi8vIENyZWF0ZSBpbnN0YW5jZSBvZiBgQUcyRGBcbmNvbnN0IGV4cGVyaWVuY2UgPSBuZXcgQUcyRChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKSk7XG5cbi8vIENvbmZpZ3VyZSBgZXhwZXJpZW5jZWBcbmV4cGVyaWVuY2UuY29uZmlndXJlKHtcbiAgICAnZnBzJzogNjAsXG4gICAgJ2JhY2tncm91bmRDb2xvdXInOiAnI0ZGMDBGRicsXG4gICAgJ3NpemUnOiB7XG4gICAgICAgICdoZWlnaHQnOiA3MjAsXG4gICAgICAgICd3aWR0aCc6IDEyODBcbiAgICB9XG59KTtcblxuLy8gVXBkYXRlXG5jb25zdCB1cGRhdGUgPSAoZGVsdGFUaW1lKSA9PiB7XG4gICAgYW5pbWF0aW9uTWFuYWdlci51cGRhdGUoZGVsdGFUaW1lKTtcbiAgICBzY2VuZU1hbmFnZXIudXBkYXRlKGRlbHRhVGltZSk7XG59O1xuXG4vLyBSZW5kZXJcbmNvbnN0IHJlbmRlciA9ICgpID0+IHtcbiAgICBzY2VuZU1hbmFnZXIucmVuZGVyKCk7XG59O1xuXG4vLyBTdG9wXG5jb25zdCBzdG9wID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdTdG9wIGNhbGxlZCcpO1xufTtcblxuLy8gU3RhcnRcbmNvbnN0IHN0YXJ0ID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdTdGFydCBjYWxsZWQnKTtcbn07XG5cbi8vIEJpbmQgdGhlIGhvb2tzXG5leHBlcmllbmNlLmhvb2tzLmJpbmQoJ3VwZGF0ZScsIHVwZGF0ZSk7XG5leHBlcmllbmNlLmhvb2tzLmJpbmQoJ3JlbmRlcicsIHJlbmRlcik7XG5leHBlcmllbmNlLmhvb2tzLmJpbmQoJ3N0b3AnLCBzdG9wKTtcbmV4cGVyaWVuY2UuaG9va3MuYmluZCgnc3RhcnQnLCBzdGFydCk7XG5cbi8vIEV4cG9ydCBgZXhwZXJpZW5jZWBcbmV4cG9ydCBkZWZhdWx0IGV4cGVyaWVuY2U7XG4iLCIvKipcbiAqIEFHMkRcbiAqXG4gKiBAZGVzYyBBIDJEIGdhbWUgZW5naW5lXG4gKi9cblxuLy8gRGVwZW5kZW5jaWVzXG5pbXBvcnQgQW5pbWF0aW9uTWFuYWdlciBmcm9tICcuL21vZHVsZXMvQW5pbWF0aW9uTWFuYWdlcic7XG5pbXBvcnQgQXNzZXRMb2FkZXIgZnJvbSAnLi9tb2R1bGVzL0Fzc2V0TG9hZGVyJztcbmltcG9ydCBBdWRpb01hbmFnZXIgZnJvbSAnLi9tb2R1bGVzL0F1ZGlvTWFuYWdlcic7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJy4vbW9kdWxlcy9FdmVudEVtaXR0ZXInO1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuL21vZHVsZXMvRXZlbnRIYW5kbGVyJztcbmltcG9ydCBTY2VuZU1hbmFnZXIgZnJvbSAnLi9tb2R1bGVzL1NjZW5lTWFuYWdlcic7XG5pbXBvcnQge25vT3B9IGZyb20gJy4vbW9kdWxlcy9VdGlscyc7XG5cbi8vIENsYXNzOiBBRzJEXG5jbGFzcyBBRzJEIHtcblxuICAgIC8vIENvbnN0cnVjdG9yXG4gICAgY29uc3RydWN0b3IgKGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0NBTlZBUycpKSB7XG5cbiAgICAgICAgLy8gYGNhbnZhc2AgcGFyYW0gd2FzIG5vdCBhIGNhbnZhc1xuICAgICAgICBpZiAoY2FudmFzLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ2NhbnZhcycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtjYW52YXN9IGlzIG5vdCBhIGNhbnZhcyBlbGVtZW50YCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pbnRlcnZhbCA9IDEwMDAgLyA2MDtcbiAgICAgICAgdGhpcy5zaXplID0ge1xuICAgICAgICAgICAgJ2hlaWdodCc6IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCxcbiAgICAgICAgICAgICd3aWR0aCc6IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYm91bmRzID0ge1xuICAgICAgICAgICAgJ2hlaWdodCc6IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCxcbiAgICAgICAgICAgICd3aWR0aCc6IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQ2FsbCBgcmVzaXplQ2FudmFzYFxuICAgICAgICB0aGlzLnJlc2l6ZUNhbnZhcyh0aGlzLmJvdW5kcy53aWR0aCwgdGhpcy5ib3VuZHMuaGVpZ2h0KTtcblxuICAgICAgICAvLyBDYWxsIGBzZXRVcEhvb2tzYFxuICAgICAgICB0aGlzLnNldFVwSG9va3MoKTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IGNsZWFyQ2FudmFzXG4gICAgY2xlYXJDYW52YXMgKCkge1xuXG4gICAgICAgIC8vIENsZWFyIGNhbnZhc1xuICAgICAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuc2l6ZS53aWR0aCwgdGhpcy5zaXplLmhlaWdodCk7XG5cbiAgICAgICAgLy8gSWYgYHRoaXMuYmFja2dyb3VuZENvbG91cmAgaXMgbm90IGB0cmFuc3BhcmVudGBcbiAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZENvbG91ciAhPT0gJ3RyYW5zcGFyZW50Jykge1xuXG4gICAgICAgICAgICAvLyBTZXQgYmFja2dyb3VuZENvbG91clxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuYmFja2dyb3VuZENvbG91cjtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLnNpemUud2lkdGgsIHRoaXMuc2l6ZS5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiBjb25maWd1cmVcbiAgICBjb25maWd1cmUgKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5mcHMgPSBvcHRpb25zLmZwcztcbiAgICAgICAgdGhpcy5pbnRlcnZhbCA9IDEwMDAgLyB0aGlzLmZwcztcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3VyID0gb3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3VyIHx8ICd0cmFuc3BhcmVudCc7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgYHNpemVgIHdhcyBwYXNzZWRcbiAgICAgICAgaWYgKG9wdGlvbnMuc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5zaXplID0ge1xuICAgICAgICAgICAgICAgICdoZWlnaHQnOiBvcHRpb25zLnNpemUuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICd3aWR0aCc6IG9wdGlvbnMuc2l6ZS53aWR0aFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYm91bmRzID0ge1xuICAgICAgICAgICAgICAgICdoZWlnaHQnOiBvcHRpb25zLnNpemUuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICd3aWR0aCc6IG9wdGlvbnMuc2l6ZS53aWR0aFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gQ2FsbCBgcmVzaXplQ2FudmFzYFxuICAgICAgICAgICAgdGhpcy5yZXNpemVDYW52YXModGhpcy5ib3VuZHMud2lkdGgsIHRoaXMuYm91bmRzLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IHJlbmRlclxuICAgIHJlbmRlciAoKSB7XG5cbiAgICAgICAgLy8gU2F2ZSBgY29udGV4dGBcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgICAgICAvLyBTY2FsZSBgY29udGV4dGAgYnkgYGRldmljZVBpeGVsUmF0aW9gXG4gICAgICAgIHRoaXMuY29udGV4dC5zY2FsZSh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyAqIHRoaXMucmF0aW8sIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvICogdGhpcy5yYXRpbyk7XG5cbiAgICAgICAgLy8gQ2FsbCBgY2xlYXJDYW52YXNgXG4gICAgICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcblxuICAgICAgICAvLyBDYWxsIGByZW5kZXJgIG9uIGBob29rc2BcbiAgICAgICAgdGhpcy5ob29rcy5yZW5kZXIoKTtcblxuICAgICAgICAvLyBSZXN0b3JlIGBjb250ZXh0YFxuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBgbGFzdFJlbmRlcmBcbiAgICAgICAgdGhpcy5sYXN0UmVuZGVyID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogcmVuZGVyTG9vcFxuICAgIHJlbmRlckxvb3AgKCkge1xuXG4gICAgICAgIC8vIFJlbmRlciBvbmx5IGlmIGBpc1J1bm5pbmdgXG4gICAgICAgIGlmICh0aGlzLmlzUnVubmluZykge1xuXG4gICAgICAgICAgICAvLyBDYWxsIGByZW5kZXJMb29wYCBvbiBuZXh0IHRpY2tcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXJMb29wLmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RvcmUgcmVmZXJlbmNlIHRvIGN1cnJlbnQgdGltZVxuICAgICAgICBjb25zdCB0aW1lTm93ID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBkZWx0YSB0aW1lc1xuICAgICAgICBjb25zdCB1cGRhdGVEZWx0YVRpbWUgPSB0aW1lTm93IC0gdGhpcy5sYXN0VXBkYXRlO1xuICAgICAgICBjb25zdCByZW5kZXJEZWx0YVRpbWUgPSB0aW1lTm93IC0gdGhpcy5sYXN0UmVuZGVyO1xuXG4gICAgICAgIC8vIENhbGwgYHVwZGF0ZWAgYW5kIHBhc3MgYHVwZGF0ZURlbHRhVGltZWBcbiAgICAgICAgdGhpcy51cGRhdGUodXBkYXRlRGVsdGFUaW1lKTtcblxuICAgICAgICAvLyBJZiBgZGVsdGFUaW1lYCBpcyBoaWdoZXIgdGhhbiBgaW50ZXJ2YWxgXG4gICAgICAgIGlmIChyZW5kZXJEZWx0YVRpbWUgPiB0aGlzLmludGVydmFsKSB7XG5cbiAgICAgICAgICAgIC8vIENhbGwgYHJlbmRlcmBcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IHNldFVwSG9va3NcbiAgICBzZXRVcEhvb2tzICgpIHtcbiAgICAgICAgdGhpcy5ob29rcyA9IHtcbiAgICAgICAgICAgICd1cGRhdGUnOiBub09wLFxuICAgICAgICAgICAgJ3JlbmRlcic6IG5vT3AsXG4gICAgICAgICAgICAnc3RvcCc6IG5vT3AsXG4gICAgICAgICAgICAnc3RhcnQnOiBub09wLFxuICAgICAgICAgICAgJ2JpbmQnOiAobmFtZSwgZnVuYykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaG9va3NbbmFtZV0gPSBmdW5jO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd1bmJpbmQnOiAobmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmhvb2tzW25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogc3RhcnRcbiAgICBzdGFydCAoKSB7XG5cbiAgICAgICAgLy8gU2V0IGBpc1J1bm5pbmdgIHRvIGB0cnVlYFxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XG5cbiAgICAgICAgLy8gU2V0IGBsYXN0VXBkYXRlYCBhbmQgYGxhc3RSZW5kZXJgXG4gICAgICAgIGNvbnN0IG5vdyA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcblxuICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSBub3c7XG4gICAgICAgIHRoaXMubGFzdFJlbmRlciA9IG5vdztcblxuICAgICAgICAvLyBDYWxsIGBzdGFydGAgb24gYGhvb2tzYFxuICAgICAgICB0aGlzLmhvb2tzLnN0YXJ0KCk7XG5cbiAgICAgICAgLy8gQ2FsbCBgcmVuZGVyTG9vcGBcbiAgICAgICAgdGhpcy5yZW5kZXJMb29wKCk7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiBzdG9wXG4gICAgc3RvcCAoKSB7XG5cbiAgICAgICAgLy8gU2V0IGBpc1J1bm5pbmdgIHRvIGBmYWxzZWBcbiAgICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcblxuICAgICAgICAvLyBDYWxsIGBzdG9wYCBvbiBgaG9va3NgXG4gICAgICAgIHRoaXMuaG9va3Muc3RvcCgpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogdXBkYXRlXG4gICAgdXBkYXRlIChkZWx0YVRpbWUpIHtcblxuICAgICAgICAvLyBDYWxsIGB1cGRhdGVgIG9uIGBob29rc2BcbiAgICAgICAgdGhpcy5ob29rcy51cGRhdGUoZGVsdGFUaW1lKTtcblxuICAgICAgICAvLyBVcGRhdGUgYGxhc3RVcGRhdGVgXG4gICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IHJlc2l6ZUNhbnZhc1xuICAgIHJlc2l6ZUNhbnZhcyAod2lkdGgsIGhlaWdodCkge1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgcmF0aW9zXG4gICAgICAgIGNvbnN0IHJhdGlvID0gdGhpcy5zaXplLndpZHRoIC8gdGhpcy5zaXplLmhlaWdodDtcbiAgICAgICAgY29uc3QgZGVzdFJhdGlvID0gd2lkdGggLyBoZWlnaHQ7XG5cbiAgICAgICAgbGV0IGRlc3RXaWR0aCA9IHdpZHRoO1xuICAgICAgICBsZXQgZGVzdEhlaWdodCA9IGhlaWdodDtcblxuICAgICAgICAvLyBgZGVzdFJhdGlvYCBpcyBsYXJnZXIgdGhhbiBgcmF0aW9gXG4gICAgICAgIGlmIChkZXN0UmF0aW8gPiByYXRpbykge1xuXG4gICAgICAgICAgICAvLyBDcm9wIHdpZHRoXG4gICAgICAgICAgICBkZXN0V2lkdGggPSBNYXRoLmZsb29yKGhlaWdodCAqIHJhdGlvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGBkZXN0UmF0aW9gIGlzIHNtYWxsZXIgdGhhbiBgcmF0aW9gXG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBDcm9wIGhlaWdodFxuICAgICAgICAgICAgZGVzdEhlaWdodCA9IE1hdGguZmxvb3Iod2lkdGggLyByYXRpbyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcGRhdGUgYGJvdW5kc2BcbiAgICAgICAgdGhpcy5ib3VuZHMgPSB7XG4gICAgICAgICAgICAnaGVpZ2h0JzogZGVzdEhlaWdodCxcbiAgICAgICAgICAgICd3aWR0aCc6IGRlc3RXaWR0aFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFVwZGF0ZSBgcmF0aW9gXG4gICAgICAgIHRoaXMucmF0aW8gPSBkZXN0V2lkdGggLyB0aGlzLnNpemUud2lkdGg7XG5cbiAgICAgICAgLy8gU2V0IGF0dHJpYnV0ZXMgYGhlaWdodGAgYW5kIGB3aWR0aGBcbiAgICAgICAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBNYXRoLnJvdW5kKGRlc3RIZWlnaHQgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbykpO1xuICAgICAgICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgTWF0aC5yb3VuZChkZXN0V2lkdGggKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbykpO1xuXG4gICAgICAgIC8vIFNldCBzdHlsZXMgYGhlaWdodGAgYW5kIGB3aWR0aGBcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gYCR7ZGVzdEhlaWdodH1weGA7XG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gYCR7ZGVzdFdpZHRofXB4YDtcbiAgICB9XG59XG5cbi8vIEV4cG9ydCBgQUcyRGBcbmV4cG9ydCBkZWZhdWx0IEFHMkQ7XG5cbi8vIEV4cG9ydCBgYW5pbWF0aW9uTWFuYWdlcmBcbmV4cG9ydCBjb25zdCBhbmltYXRpb25NYW5hZ2VyID0gbmV3IEFuaW1hdGlvbk1hbmFnZXIoKTtcblxuLy8gRXhwb3J0IGBzc3NldExvYWRlcmBcbmV4cG9ydCBjb25zdCBhc3NldExvYWRlciA9IG5ldyBBc3NldExvYWRlcigpO1xuXG4vLyBFeHBvcnQgYGF1ZGlvTWFuYWdlcmBcbmV4cG9ydCBjb25zdCBhdWRpb01hbmFnZXIgPSBuZXcgQXVkaW9NYW5hZ2VyKCk7XG5cbi8vIEV4cG9ydCBgZXZlbnRFbWl0dGVyYFxuZXhwb3J0IGNvbnN0IGV2ZW50RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuLy8gRXhwb3J0IGBldmVudEhhbmRsZXJgXG5leHBvcnQgY29uc3QgZXZlbnRIYW5kbGVyID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuXG4vLyBFeHBvcnQgYFNjZW5lYFxuZXhwb3J0IHtkZWZhdWx0IGFzIFNjZW5lfSBmcm9tICcuL21vZHVsZXMvU2NlbmUnO1xuXG4vLyBFeHBvcnQgYFNjZW5lTWFuYWdlcmBcbmV4cG9ydCBjb25zdCBzY2VuZU1hbmFnZXIgPSBuZXcgU2NlbmVNYW5hZ2VyKCk7XG4iLCIvKipcbiAqIEFuaW1hdGlvbk1hbmFnZXJcbiAqXG4gKiBAZGVzYyBBbiBhbmltYXRpb24gbWFuYWdlclxuICovXG5cbi8vIENvbnN0cnVjdG9yOiBBbmltYXRpb25NYW5hZ2VyXG5jbGFzcyBBbmltYXRpb25NYW5hZ2VyIHtcblxuICAgIC8vIENvbnN0cnVjdG9yXG4gICAgY29uc3RydWN0b3IgKCkge1xuXG4gICAgICAgIC8vIE9iamVjdCB0byBob2xkIGFuaW1hdGlvbnNcbiAgICAgICAgdGhpcy5hbmltYXRpb25zID0ge307XG5cbiAgICAgICAgLy8gQXJyYXkgdG8gaG9sZCBhbmltYXRpb24gbmFtZXNcbiAgICAgICAgdGhpcy5hbmltYXRpb25OYW1lcyA9IFtdO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogYWRkXG4gICAgYWRkIChhbmltYXRpb24pIHtcblxuICAgICAgICAvLyBgYW5pbWF0aW9uYCBkb2Vzbid0IGFscmVhZHkgZXhpc3QgaW4gYGFuaW1hdGlvbnNgXG4gICAgICAgIGlmIChhbmltYXRpb24ubmFtZSBpbiB0aGlzLmFuaW1hdGlvbnMgPT09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgIC8vIEFkZCBgbmFtZWAgdG8gYGFuaW1hdGlvbnNgXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnNbYW5pbWF0aW9uLm5hbWVdID0gYW5pbWF0aW9uO1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgYGFuaW1hdGlvbk5hbWVzYFxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25OYW1lcyA9IE9iamVjdC5rZXlzKHRoaXMuYW5pbWF0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBgYW5pbWF0aW9uYCBkb2VzIGV4aXN0IGluIGBhbmltYXRpb25gXG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBUaHJvdyBlcnJvclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbiBhbmltYXRpb24gd2l0aCB0aGUgbmFtZSBcXGAke2FuaW1hdGlvbi5uYW1lfVxcYCBhbHJlYWR5IGV4aXN0c2ApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiByZW1vdmVcbiAgICByZW1vdmUgKG5hbWUpIHtcblxuICAgICAgICAvLyBgbmFtZWAgZG9lcyBleGlzdCBpbiBgYW5pbWF0aW9uc2BcbiAgICAgICAgaWYgKG5hbWUgaW4gdGhpcy5hbmltYXRpb25zKSB7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSBgbmFtZWAgZnJvbSBgYW5pbWF0aW9uc2BcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmFuaW1hdGlvbnNbbmFtZV07XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBgYW5pbWF0aW9uTmFtZXNgXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbk5hbWVzID0gT2JqZWN0LmtleXModGhpcy5hbmltYXRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGBuYW1lYCBkb2VzIG5vdCBleGlzdCBpbiBgYW5pbWF0aW9uc2BcbiAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIFRocm93IGVycm9yXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGFuaW1hdGlvbiB3aXRoIHRoZSBuYW1lIFxcYCR7bmFtZX1cXGAgZXhpc3RzYCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IHVwZGF0ZVxuICAgIHVwZGF0ZSAoZGVsdGFUaW1lKSB7XG5cbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGBhbmltYXRpb25OYW1lc2BcbiAgICAgICAgdGhpcy5hbmltYXRpb25OYW1lcy5mb3JFYWNoKChhbmltYXRpb24pID0+IHtcblxuICAgICAgICAgICAgLy8gQ2FsbCBgdXBkYXRlYCBvbiBgYW5pbWF0aW9uYFxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zW2FuaW1hdGlvbl0udXBkYXRlKGRlbHRhVGltZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLy8gRXhwb3J0IGBBbmltYXRpb25NYW5hZ2VyYFxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0aW9uTWFuYWdlcjtcbiIsIi8qKlxuICogQXNzZXRMb2FkZXJcbiAqXG4gKiBAZGVzYyBBbiBhc3NldCBsb2FkZXJcbiAqL1xuXG4vLyBEZXBlbmNlbmNpZXNcbmltcG9ydCB7Z2V0QXVkaW9BcnJheUJ1ZmZlciwgZ2V0VmlkZW9CbG9iLCBub09wfSBmcm9tICcuL1V0aWxzJztcblxuLy8gQ2xhc3M6IEFzc2V0TG9hZGVyXG5jbGFzcyBBc3NldExvYWRlciB7XG5cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5hc3NldHMgPSB7fTtcbiAgICAgICAgdGhpcy5hc3NldHNUb0xvYWQgPSBbXTtcbiAgICAgICAgdGhpcy5hc3NldHNMb2FkZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IGFkZEFzc2V0XG4gICAgYWRkQXNzZXQgKGFzc2V0KSB7XG5cbiAgICAgICAgLy8gQXNzZXQgaGFzIGEgdHlwZVxuICAgICAgICBpZiAoYXNzZXQudHlwZSkge1xuXG4gICAgICAgICAgICAvLyBTd2l0Y2ggb3ZlciBgdHlwZWBcbiAgICAgICAgICAgIHN3aXRjaCAoYXNzZXQudHlwZSkge1xuXG4gICAgICAgICAgICAgICAgLy8gQXVkaW9cbiAgICAgICAgICAgICAgICBjYXNlICdhdWRpbyc6IHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBBc3NldCBkb2Vzbid0IGhhdmUgc291cmNlc1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWFzc2V0LnNvdXJjZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhyb3cgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQXNzZXQgZG9lcyBub3QgaGF2ZSBzb3VyY2VzICR7YXNzZXR9YCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBBc3NldCBkb2Vzbid0IGhhdmUgYSBuYW1lXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFhc3NldC5uYW1lKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRocm93IGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFzc2V0IGRvZXMgbm90IGhhdmUgYSBuYW1lICR7YXNzZXR9YCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBBc3NldCBoYXMgZXZlcnl0aGluZyB3ZSBuZWVkXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgYXNzZXQgdG8gYGFzc2V0c1RvTG9hZGBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXNzZXRzVG9Mb2FkLnB1c2goYXNzZXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSW1hZ2VcbiAgICAgICAgICAgICAgICBjYXNlICdpbWFnZSc6IHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBBc3NldCBkb2Vzbid0IGhhdmUgYSBwYXRoXG4gICAgICAgICAgICAgICAgICAgIGlmICghYXNzZXQucGF0aCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaHJvdyBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3NldCBkb2VzIG5vdCBoYXZlIGEgcGF0aCAke2Fzc2V0fWApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQXNzZXQgZG9lc24ndCBoYXZlIGEgbmFtZVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICghYXNzZXQubmFtZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaHJvdyBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3NldCBkb2VzIG5vdCBoYXZlIGEgbmFtZSAke2Fzc2V0fWApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQXNzZXQgaGFzIGV2ZXJ5dGhpbmcgd2UgbmVlZFxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGFzc2V0IHRvIGBhc3NldHNUb0xvYWRgXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFzc2V0c1RvTG9hZC5wdXNoKGFzc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFZpZGVvXG4gICAgICAgICAgICAgICAgY2FzZSAndmlkZW8nOiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQXNzZXQgZG9lc24ndCBoYXZlIHNvdXJjZXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhc3NldC5zb3VyY2VzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRocm93IGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFzc2V0IGRvZXMgbm90IGhhdmUgc291cmNlcyAke2Fzc2V0fWApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQXNzZXQgZG9lc24ndCBoYXZlIGEgbmFtZVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICghYXNzZXQubmFtZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaHJvdyBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3NldCBkb2VzIG5vdCBoYXZlIGEgbmFtZSAke2Fzc2V0fWApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQXNzZXQgaGFzIGV2ZXJ5dGhpbmcgd2UgbmVlZFxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGFzc2V0IHRvIGBhc3NldHNUb0xvYWRgXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFzc2V0c1RvTG9hZC5wdXNoKGFzc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEludmFsaWQgdHlwZVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBUaHJvdyBlcnJvclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Fzc2V0IGlzIG5vdCBhIHZhbGlkIHR5cGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBc3NldCBkb2VzbiBoYXZlIGEgdHlwZVxuICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgLy8gVGhyb3cgZXJyb3JcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXNzZXQgZG9lcyBub3QgaGF2ZSBhIHR5cGUnLCBhc3NldCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IGFkZEFzc2V0c1xuICAgIGFkZEFzc2V0cyAoYXNzZXRzKSB7XG5cbiAgICAgICAgLy8gYGFzc2V0c2AgaXMgbm90IGFuIGFycmF5XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXNzZXRzKSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuXG4gICAgICAgICAgICAvLyBUaHJvdyBlcnJvclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgYWRkQXNzZXRzYCBtdXN0IGJlIHBhc3NlZCBhbiBhcnJheScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYGFzc2V0c2AgaXMgYW4gYXJyYXlcbiAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBgYXNzZXRzYFxuICAgICAgICAgICAgYXNzZXRzLmZvckVhY2goKGFzc2V0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxsIGBhZGRBc3NldGBcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEFzc2V0KGFzc2V0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiBsb2FkQXNzZXRzXG4gICAgbG9hZEFzc2V0cyAoY2FsbGJhY2sgPSBub09wKSB7XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZXJlIGFyZSBzdGlsbCBhc3NldHMgdG8gbG9hZFxuICAgICAgICBpZiAodGhpcy5hc3NldHNUb0xvYWQubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICAvLyBTZXQgYGFzc2V0c0xvYWRlZGAgdG8gYGZhbHNlYFxuICAgICAgICAgICAgdGhpcy5hc3NldHNMb2FkZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gTG9hZCB0aGUgYXNzZXRcbiAgICAgICAgICAgIHRoaXMubG9hZEFzc2V0KHRoaXMuYXNzZXRzVG9Mb2FkWzBdLCAoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIGFzc2V0IHRvIGBhc3NldHNgXG4gICAgICAgICAgICAgICAgW3RoaXMuYXNzZXRzW3RoaXMuYXNzZXRzVG9Mb2FkWzBdLm5hbWVdXSA9IHRoaXMuYXNzZXRzVG9Mb2FkO1xuXG4gICAgICAgICAgICAgICAgLy8gTW92ZSB0byBuZXh0IGFzc2V0XG4gICAgICAgICAgICAgICAgdGhpcy5hc3NldHNUb0xvYWQuc2hpZnQoKTtcblxuICAgICAgICAgICAgICAgIC8vIFN0YXJ0IGxvYWRpbmcgbmV4dCBhc3NldFxuICAgICAgICAgICAgICAgIHRoaXMubG9hZEFzc2V0cyhjYWxsYmFjayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZXJlIGFyZSBubyBtb3JlIGFzc2V0c1xuICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgLy8gU2V0IGBhc3NldHNMb2FkZWRgIHRvIGB0cnVlYFxuICAgICAgICAgICAgdGhpcy5hc3NldHNMb2FkZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBDYWxsIGBjYWxsYmFja2BcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiBsb2FkQXNzZXRcbiAgICBsb2FkQXNzZXQgKGFzc2V0LCBjYWxsYmFjaykge1xuXG4gICAgICAgIC8vIFN3aXRjaCBvbiBgdHlwZWBcbiAgICAgICAgc3dpdGNoIChhc3NldC50eXBlKSB7XG5cbiAgICAgICAgICAgIC8vIEF1ZGlvXG4gICAgICAgICAgICBjYXNlICdhdWRpbyc6IHtcblxuICAgICAgICAgICAgICAgIC8vIENhbGwgYGxvYWRBdWRpb2BcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRBdWRpbyhhc3NldCwgY2FsbGJhY2spO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEltYWdlXG4gICAgICAgICAgICBjYXNlICdpbWFnZSc6IHtcblxuICAgICAgICAgICAgICAgIC8vIENhbGwgYGxvYWRJbWFnZWBcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRJbWFnZShhc3NldCwgY2FsbGJhY2spO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgJ3ZpZGVvJzoge1xuXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCBgbG9hZFZpZGVvYFxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFZpZGVvKGFzc2V0LCBjYWxsYmFjayk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSAnc3VidGl0bGUnOiB7XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxsIGBsb2FkU3VidGl0bGVgXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU3VidGl0bGUoYXNzZXQsIGNhbGxiYWNrKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEZWZhdWx0XG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBc3NldCBoYXMgbm8gdHlwZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiBsb2FkQXVkaW9cbiAgICBsb2FkQXVkaW8gKGFzc2V0LCBjYWxsYmFjaykge1xuXG4gICAgICAgIC8vIENhbGwgYGdldEF1ZGlvQXJyYXlCdWZmZXJgXG4gICAgICAgIGdldEF1ZGlvQXJyYXlCdWZmZXIoYXNzZXQuc291cmNlcywgKGJ1ZmZlcikgPT4ge1xuXG4gICAgICAgICAgICAvLyBTZXQgYnVmZmVyXG4gICAgICAgICAgICBhc3NldC5idWZmZXIgPSBidWZmZXI7XG5cbiAgICAgICAgICAgIC8vIENhbGwgYGNhbGxiYWNrYFxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiBsb2FkSW1hZ2VcbiAgICBsb2FkSW1hZ2UgKGFzc2V0LCBjYWxsYmFjaykge1xuXG4gICAgICAgIC8vIENyZWF0ZSBuZXcgaW1hZ2VcbiAgICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG5cbiAgICAgICAgLy8gT24gbG9hZCBvZiBpbWFnZVxuICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcblxuICAgICAgICAgICAgYXNzZXQubG9hZGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gQWRkIGVsZW1lbnRcbiAgICAgICAgICAgIGFzc2V0LmVsZW1lbnQgPSBpbWc7XG5cbiAgICAgICAgICAgIC8vIENhbGwgYGNhbGxiYWNrYFxuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE9uIGVycm9yIG9mIGltYWdlXG4gICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChlKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIFRocm93IGVycm9yXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNldCBgY3Jvc3NPcmlnaW5gIHRvIGBhbm9ueW1vdXNgXG4gICAgICAgIGltZy5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xuXG4gICAgICAgIC8vIFNldCBgaW1nLnNyY2BcbiAgICAgICAgaW1nLnNyYyA9IGFzc2V0LnBhdGg7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiBsb2FkVmlkZW9cbiAgICBsb2FkVmlkZW8gKGFzc2V0LCBjYWxsYmFjaykge1xuXG4gICAgICAgIC8vIENyZWF0ZSBuZXcgdmlkZW9cbiAgICAgICAgY29uc3QgdmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuXG4gICAgICAgIC8vIFNldCBgZWxlbWVudGBcbiAgICAgICAgYXNzZXQuZWxlbWVudCA9IHZpZGVvO1xuXG4gICAgICAgIC8vIE9uIGVycm9yIG9mIHZpZGVvXG4gICAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGUpID0+IHtcblxuICAgICAgICAgICAgLy8gVGhyb3cgZXJyb3JcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ2FsbCBgZ2V0VmlkZW9CbG9iYFxuICAgICAgICBnZXRWaWRlb0Jsb2IoYXNzZXQuc291cmNlcywgKGJsb2IsIHN1cHBvcnRlZFZpZGVvVHlwZSkgPT4ge1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgc291cmNlIGVsZW1lbnRcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc291cmNlJyk7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0eXBlXG4gICAgICAgICAgICBzb3VyY2VFbC50eXBlID0gc3VwcG9ydGVkVmlkZW9UeXBlLnR5cGU7XG5cbiAgICAgICAgICAgIC8vIEFkZCBzb3VyY2VcbiAgICAgICAgICAgIHNvdXJjZUVsLnNyYyA9IGJsb2I7XG5cbiAgICAgICAgICAgIC8vIEFwcGVuZCBgc291cmNlRWxgIHRvIGB2aWRlb2BcbiAgICAgICAgICAgIHZpZGVvLmFwcGVuZENoaWxkKHNvdXJjZUVsKTtcblxuICAgICAgICAgICAgLy8gU2V0IGBsb2FkZWRgIHRvIGB0cnVlYFxuICAgICAgICAgICAgYXNzZXQubG9hZGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gQ2FsbCBgY2FsbGJhY2tgXG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vLyBFeHBvcnQgYEFzc2V0TG9hZGVyYFxuZXhwb3J0IGRlZmF1bHQgQXNzZXRMb2FkZXI7XG4iLCIvKipcbiAqIEF1ZGlvTWFuYWdlclxuICpcbiAqIEBkZXNjIEFuIGF1ZGlvIG1hbmFnZXJcbiAqL1xuXG4vLyBEZXBlbmRlbmNpZXNcbmltcG9ydCB7Y3JlYXRlQXVkaW9Db250ZXh0LCBub09wfSBmcm9tICcuL1V0aWxzJztcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSAnLi9FdmVudEhhbmRsZXInO1xuXG4vLyBDb25zdHJ1Y3RvcjogQXVkaW9NYW5hZ2VyXG5jbGFzcyBBdWRpb01hbmFnZXIge1xuXG4gICAgLy8gQ29uc3RydWN0b3JcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGBldmVudEhhbmRsZXJgXG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuXG4gICAgICAgIC8vIE9iamVjdCB0byBob2xkIGF1ZGlvQ2xpcHNcbiAgICAgICAgdGhpcy5hdWRpb0NsaXBzID0ge307XG5cbiAgICAgICAgLy8gQXJyYXkgdG8gaG9sZCBhdWRpb0NsaXAgbmFtZXNcbiAgICAgICAgdGhpcy5hdWRpb0NsaXBOYW1lcyA9IFtdO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogYWRkXG4gICAgYWRkIChhdWRpb0NsaXApIHtcblxuICAgICAgICAvLyBgYXVkaW9DbGlwYCBkb2Vzbid0IGFscmVhZHkgZXhpc3QgaW4gYGF1ZGlvQ2xpcHNgXG4gICAgICAgIGlmIChhdWRpb0NsaXAubmFtZSBpbiB0aGlzLmF1ZGlvQ2xpcHMgPT09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgIC8vIEFkZCBgbmFtZWAgdG8gYGF1ZGlvQ2xpcHNgXG4gICAgICAgICAgICB0aGlzLmF1ZGlvQ2xpcHNbYXVkaW9DbGlwLm5hbWVdID0gYXVkaW9DbGlwO1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgYGF1ZGlvQ2xpcE5hbWVzYFxuICAgICAgICAgICAgdGhpcy5hdWRpb0NsaXBOYW1lcyA9IE9iamVjdC5rZXlzKHRoaXMuYXVkaW9DbGlwcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBgYXVkaW9DbGlwYCBkb2VzIGV4aXN0IGluIGBhdWRpb0NsaXBgXG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBUaHJvdyBlcnJvclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbiBhdWRpb0NsaXAgd2l0aCB0aGUgbmFtZSBcXGAke2F1ZGlvQ2xpcC5uYW1lfVxcYCBhbHJlYWR5IGV4aXN0c2ApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiBpbml0XG4gICAgaW5pdCAoY2IgPSBub09wKSB7XG5cbiAgICAgICAgLy8gRnVuY3Rpb24gdG8gY3JlYXRlIGFuIGF1ZGlvIGNvbnRleHRcbiAgICAgICAgY29uc3QgY3JlYXRlQ29udGV4dCA9ICgpID0+IHtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyBgYXVkaW9Db250ZXh0UGF0Y2hgXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQgPSBjcmVhdGVBdWRpb0NvbnRleHQoKTtcblxuICAgICAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgICAgICB0aGlzLmV2ZW50SGFuZGxlci5yZW1vdmVFdmVudCgnaU9TVG91Y2hTdGFydEF1ZGlvQ29udGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIucmVtb3ZlRXZlbnQoJ2lPU1RvdWNoRW5kQXVkaW9Db250ZXh0Jyk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgYGNiYFxuICAgICAgICAgICAgcmV0dXJuIGNiKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmVndWxhciBleHByZXNzaW9uIHRoYXQgbWF0Y2hlcyBpT1MgZGV2aWNlc1xuICAgICAgICBjb25zdCBpT1NSZWdleCA9IG5ldyBSZWdFeHAoJ2lQaG9uZXxpUGFkfGlQb2QnLCAnaScpO1xuXG4gICAgICAgIC8vIElzIGlPU1xuICAgICAgICBpZiAoaU9TUmVnZXgudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAhd2luZG93Lk1TU3RyZWFtKSB7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSBhdWRpbyBjb250ZXh0IGZvciBpT1MgNi04XG4gICAgICAgICAgICB0aGlzLmV2ZW50SGFuZGxlci5hZGRFdmVudCh7XG4gICAgICAgICAgICAgICAgJ25hbWUnOiAnaU9TVG91Y2hTdGFydEF1ZGlvQ29udGV4dCcsXG4gICAgICAgICAgICAgICAgJ2VsZW1lbnQnOiBkb2N1bWVudCxcbiAgICAgICAgICAgICAgICAndHlwZSc6ICd0b3VjaHN0YXJ0JyxcbiAgICAgICAgICAgICAgICAnZnVuY3Rpb24nOiBjcmVhdGVDb250ZXh0LmJpbmQodGhpcylcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgYXVkaW8gY29udGV4dCBmb3IgaU9TIDktMTBcbiAgICAgICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyLmFkZEV2ZW50KHtcbiAgICAgICAgICAgICAgICAnbmFtZSc6ICdpT1NUb3VjaEVuZEF1ZGlvQ29udGV4dCcsXG4gICAgICAgICAgICAgICAgJ2VsZW1lbnQnOiBkb2N1bWVudCxcbiAgICAgICAgICAgICAgICAndHlwZSc6ICd0b3VjaGVuZCcsXG4gICAgICAgICAgICAgICAgJ2Z1bmN0aW9uJzogY3JlYXRlQ29udGV4dC5iaW5kKHRoaXMpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElzIG5vdCBpT1NcbiAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBgY29udGV4dGBcbiAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IGNyZWF0ZUF1ZGlvQ29udGV4dCgpO1xuXG4gICAgICAgICAgICAvLyBDYWxsIGBjYmBcbiAgICAgICAgICAgIHJldHVybiBjYigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiBwbGF5XG4gICAgcGxheSAobmFtZSkge1xuXG4gICAgICAgIGlmICghdGhpcy5hdWRpb0NsaXBzW25hbWVdLmVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuYXVkaW9DbGlwc1tuYW1lXS5lbGVtZW50ID0gdGhpcy5jb250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgICAgICAgdGhpcy5hdWRpb0NsaXBzW25hbWVdLmVsZW1lbnQuYnVmZmVyID0gdGhpcy5hdWRpb0NsaXBzW25hbWVdLmJ1ZmZlcjtcbiAgICAgICAgICAgIHRoaXMuYXVkaW9DbGlwc1tuYW1lXS5lbGVtZW50LmNvbm5lY3QodGhpcy5jb250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXVkaW9DbGlwc1tuYW1lXS5lbGVtZW50LnN0YXJ0KDApO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogcmVtb3ZlXG4gICAgcmVtb3ZlIChuYW1lKSB7XG5cbiAgICAgICAgLy8gYG5hbWVgIGRvZXMgZXhpc3QgaW4gYGF1ZGlvQ2xpcHNgXG4gICAgICAgIGlmIChuYW1lIGluIHRoaXMuYXVkaW9DbGlwcykge1xuXG4gICAgICAgICAgICAvLyBSZW1vdmUgYG5hbWVgIGZyb20gYGF1ZGlvQ2xpcHNgXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5hdWRpb0NsaXBzW25hbWVdO1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgYGF1ZGlvQ2xpcE5hbWVzYFxuICAgICAgICAgICAgdGhpcy5hdWRpb0NsaXBOYW1lcyA9IE9iamVjdC5rZXlzKHRoaXMuYXVkaW9DbGlwcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBgbmFtZWAgZG9lcyBub3QgZXhpc3QgaW4gYGF1ZGlvQ2xpcHNgXG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBUaHJvdyBlcnJvclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBhdWRpb0NsaXAgd2l0aCB0aGUgbmFtZSBcXGAke25hbWV9XFxgIGV4aXN0c2ApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiBzdG9wXG4gICAgc3RvcCAobmFtZSkge1xuXG4gICAgICAgIGlmICh0aGlzLmF1ZGlvQ2xpcHNbbmFtZV0uZWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5hdWRpb0NsaXBzW25hbWVdLmVsZW1lbnQuZGlzY29ubmVjdCh0aGlzLmNvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuYXVkaW9DbGlwc1tuYW1lXS5lbGVtZW50O1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBFeHBvcnQgYEF1ZGlvTWFuYWdlcmBcbmV4cG9ydCBkZWZhdWx0IEF1ZGlvTWFuYWdlcjtcbiIsIi8qKlxuICogRXZlbnRFbWl0dGVyXG4gKlxuICogQGRlc2MgQW4gZXZlbnQgZW1pdHRlclxuICovXG5cbi8vIENsYXNzOiBFdmVudEVtaXR0ZXJcbmNsYXNzIEV2ZW50RW1pdHRlciB7XG5cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIGNvbnN0cnVjdG9yICgpIHtcblxuICAgICAgICAvLyBTZXQgYGxpc3RlbmVyc01hcGBcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IGFkZExpc3RlbmVyXG4gICAgYWRkTGlzdGVuZXIgKG5hbWUsIGNhbGxiYWNrLCBjb3VudCA9IEluZmluaXR5KSB7XG5cbiAgICAgICAgLy8gYG5hbWVgIGRvZXNuJ3QgZXhpc3QgaW4gYGxpc3RlbmVyc2BcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmxpc3RlbmVyc1tuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIGFycmF5XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tuYW1lXSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIGByZWZlcmVuY2VgXG4gICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHtcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICBjYWxsYmFjayxcbiAgICAgICAgICAgIGNvdW50XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUHVzaCBgcmVmZXJlbmNlYCB0byBgbGlzdGVuZXJzW25hbWVdYFxuICAgICAgICB0aGlzLmxpc3RlbmVyc1tuYW1lXS5wdXNoKHJlZmVyZW5jZSk7XG5cbiAgICAgICAgLy8gUmV0dXJuIGByZWZlcmVuY2VgIHNvIHdlIGNhbiByZW1vdmUgaXQgbGF0ZXJcbiAgICAgICAgcmV0dXJuIHJlZmVyZW5jZTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IHJlbW92ZUxpc3RlbmVyXG4gICAgcmVtb3ZlTGlzdGVuZXIgKHJlZmVyZW5jZSkge1xuXG4gICAgICAgIC8vIGBuYW1lYCBleGlzdHMgaW4gYGxpc3RlbmVyc2BcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmxpc3RlbmVyc1tyZWZlcmVuY2UubmFtZV0gIT09ICd1bmRlZmluZWQnKSB7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSBgcmVmZXJlbmNlYCBmcm9tIGBsaXN0ZW5lcnNbcmVmZXJlbmNlLm5hbWVdYFxuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbcmVmZXJlbmNlLm5hbWVdID0gdGhpcy5saXN0ZW5lcnNbcmVmZXJlbmNlLm5hbWVdLmZpbHRlcigoZXZlbnRMaXN0ZW5lcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2UgIT09IGV2ZW50TGlzdGVuZXI7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUmVtb3ZlIGByZWZlcmVuY2UubmFtZWAgaWYgYGxlbmd0aGAgaXMgYDBgXG4gICAgICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbcmVmZXJlbmNlLm5hbWVdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmxpc3RlbmVyc1tyZWZlcmVuY2UubmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IGVtaXRcbiAgICBlbWl0IChuYW1lLCAuLi5hcmdzKSB7XG5cbiAgICAgICAgLy8gYG5hbWVgIGV4aXN0cyBpbiBgbGlzdGVuZXJzYFxuICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnMpLmluY2x1ZGVzKG5hbWUpKSB7XG5cbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBlYWNoIGBsaXN0ZW5lcmBcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW25hbWVdLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxsIGBjYWxsYmFja2BcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5jYWxsYmFjayguLi5hcmdzKTtcblxuICAgICAgICAgICAgICAgIC8vIERlY3JlbWVudCBgY291bnRgXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIuY291bnQgLT0gMTtcblxuICAgICAgICAgICAgICAgIC8vIGBjb3VudGAgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGAwYFxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5jb3VudCA8PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGBsaXN0ZW5lcmAgZnJvbSBgbGlzdGVuZXJzW25hbWVdYFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tuYW1lXSA9IHRoaXMubGlzdGVuZXJzW25hbWVdLmZpbHRlcigoZXZlbnRMaXN0ZW5lcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RlbmVyICE9PSBldmVudExpc3RlbmVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gRXhwb3J0IGBFdmVudEVtaXR0ZXJgXG5leHBvcnQgZGVmYXVsdCBFdmVudEVtaXR0ZXI7XG4iLCIvKipcbiAqIE1vZHVsZXM6IEV2ZW50IEhhbmRsZXJcbiAqL1xuXG4vLyBDb25zdHJ1Y3RvcjogRXZlbnRIYW5kbGVyXG5jbGFzcyBFdmVudEhhbmRsZXIge1xuXG4gICAgLy8gQ29uc3RydWN0b3JcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG5cbiAgICAgICAgLy8gT2JqZWN0IHRvIHN0b3JlIGBldmVudHNgXG4gICAgICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiBhZGRFdmVudFxuICAgIGFkZEV2ZW50IChuYW1lLCB0eXBlLCBlbCwgZm4pIHtcblxuICAgICAgICAvLyBgZXZ0YCB3aWxsIGhvbGQgdGhlIGZpbmFsIG9iamVjdFxuICAgICAgICBsZXQgZXZ0ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vIFBhc3NlZCBpbmRpdmlkdWFsIHBhcmFtcyBhbmQgbm90IGFuIG9iamVjdFxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3RcbiAgICAgICAgICAgIGV2dCA9IHtcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICdlbGVtZW50JzogZWwsXG4gICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICAnZnVuY3Rpb24nOiBmblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBhc3NlZCBvYmplY3QgYXMgZmlyc3QgcGFyYW1cbiAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIFNldCBgZXZ0YCB0byBgbmFtZWBcbiAgICAgICAgICAgIGV2dCA9IG5hbWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgbmV3IGBDdXN0b21FdmVudGBcbiAgICAgICAgY29uc3QgY3VzdG9tRXZlbnQgPSBPYmplY3QuYXNzaWduKHt9LCBldnQpO1xuXG4gICAgICAgIC8vIGBuYW1lYCBhbHJlYWR5IGV4aXN0c1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuZXZlbnRzLCBjdXN0b21FdmVudC5uYW1lKSkge1xuXG4gICAgICAgICAgICAvLyBUaHJvdyBlcnJvclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcXGBuYW1lXFxgIG9mIFxcYCR7Y3VzdG9tRXZlbnQubmFtZX1cXGAgaXMgYWxyZWFkeSBpbiB1c2VgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCB0aGUgbGlzdGVuZXIgdG8gdGhlIGVsZW1lbnRcbiAgICAgICAgY3VzdG9tRXZlbnQuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGN1c3RvbUV2ZW50LnR5cGUsIGN1c3RvbUV2ZW50LmZ1bmN0aW9uKTtcblxuICAgICAgICAvLyBBZGQgYGN1c3RvbUV2ZW50YCB0byBgZXZlbnRzYFxuICAgICAgICB0aGlzLmV2ZW50c1tjdXN0b21FdmVudC5uYW1lXSA9IGN1c3RvbUV2ZW50O1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogcmVtb3ZlRXZlbnRcbiAgICByZW1vdmVFdmVudCAoZXZlbnROYW1lKSB7XG5cbiAgICAgICAgLy8gYGV2ZW50TmFtZWAgaXMgdW5kZWZpbmVkXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcblxuICAgICAgICAgICAgLy8gVGhyb3cgZXJyb3JcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgaXMgbm8gZXZlbnQgbmFtZWQgXFxgJHtldmVudE5hbWV9XFxgYCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBgZXZlbnROYW1lYCBpcyBkZWZpbmVkXG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBTdG9yZSByZWZlcmVuY2UgdG8gYGN1c3RvbUV2ZW50YFxuICAgICAgICAgICAgY29uc3QgY3VzdG9tRXZlbnQgPSB0aGlzLmV2ZW50c1tldmVudE5hbWVdO1xuXG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGxpc3RlbmVyIGZyb20gdGhlIGVsZW1lbnRcbiAgICAgICAgICAgIGN1c3RvbUV2ZW50LmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihjdXN0b21FdmVudC50eXBlLCBjdXN0b21FdmVudC5mdW5jdGlvbik7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSBgY3VzdG9tRXZlbnRgIGZyb20gYGV2ZW50c2BcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1tjdXN0b21FdmVudC5uYW1lXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1ldGhvZDogcmVtb3ZlRXZlbnRzXG4gICAgcmVtb3ZlRXZlbnRzICgpIHtcblxuICAgICAgICAvLyBHZXQgYWxsIGV2ZW50IG5hbWVzIGZyb20gYGV2ZW50c2BcbiAgICAgICAgY29uc3QgZXZlbnROYW1lcyA9IE9iamVjdC5rZXlzKHRoaXMuZXZlbnRzKTtcblxuICAgICAgICAvLyBJdGVyYXRlIG92ZXIgYGV2ZW50TmFtZXNgXG4gICAgICAgIGV2ZW50TmFtZXMuZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIFN0b3JlIHJlZmVyZW5jZSB0byBgY3VycmVudEV2ZW50YFxuICAgICAgICAgICAgY29uc3QgY3VzdG9tRXZlbnQgPSB0aGlzLmV2ZW50c1tldmVudE5hbWVdO1xuXG4gICAgICAgICAgICAvLyBSZW1vdmUgYGN1c3RvbUV2ZW50YCBmcm9tIGBldmVudHNgXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUV2ZW50KGN1c3RvbUV2ZW50Lm5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8vIEV4cG9ydCBgRXZlbnRIYW5kbGVyYFxuZXhwb3J0IGRlZmF1bHQgRXZlbnRIYW5kbGVyO1xuIiwiLyoqXG4gKiBNb2R1bGVzOiBTY2VuZVxuICovXG5cbi8vIENsYXNzOiBTY2VuZVxuY2xhc3MgU2NlbmUge1xuXG4gICAgLy8gQ29uc3RydWN0b3JcbiAgICBjb25zdHJ1Y3RvciAobmFtZSA9ICdEZWZhdWx0Jykge1xuXG4gICAgICAgIC8vIFNldCBgbmFtZWBcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcblxuICAgICAgICAvLyBTZXQgYGVudGVyZWRDb3VudGAgYW5kIGBleGl0ZWRDb3VudGBcbiAgICAgICAgdGhpcy5lbnRlckNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5leGl0Q291bnQgPSAwO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGBJbml0OiAke3RoaXMubmFtZX1gKTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IHJlbmRlclxuICAgIHJlbmRlciAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBSZW5kZXI6ICR7dGhpcy5uYW1lfWApO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogc2NlbmVFbnRlclxuICAgIHNjZW5lRW50ZXIgKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhgU2NlbmUgRW50ZXI6ICR7dGhpcy5uYW1lfWApO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogc2NlbmVFeGl0XG4gICAgc2NlbmVFeGl0ICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coYFNjZW5lIEV4aXQ6ICR7dGhpcy5uYW1lfWApO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogdXBkYXRlXG4gICAgdXBkYXRlICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coYFVwZGF0ZTogJHt0aGlzLm5hbWV9YCk7XG4gICAgfVxufVxuXG4vLyBFeHBvcnQgYFNjZW5lYFxuZXhwb3J0IGRlZmF1bHQgU2NlbmU7XG4iLCIvKipcbiAqIFNjZW5lTWFuYWdlclxuICpcbiAqIEBkZXNjIEEgc2NlbmUgbWFuYWdlclxuICovXG5cbi8vIERlcGVuZGVuY2llc1xuaW1wb3J0IHtjeWNsaWNBcnJheX0gZnJvbSAnLi9VdGlscyc7XG5cbi8vIENsYXNzOiBTY2VuZU1hbmFnZXJcbmNsYXNzIFNjZW5lTWFuYWdlciB7XG5cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIGNvbnN0cnVjdG9yICgpIHtcblxuICAgICAgICAvLyBPYmplY3QgdG8gaG9sZCBzY2VuZXNcbiAgICAgICAgdGhpcy5zY2VuZXMgPSB7fTtcblxuICAgICAgICAvLyBBcnJheSB0byBob2xkIHRoZSBzY2VuZSBuYW1lc1xuICAgICAgICB0aGlzLnNjZW5lTmFtZXMgPSBbXTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IGFkZFxuICAgIGFkZCAoc2NlbmUpIHtcblxuICAgICAgICAvLyBBZGQgYG5hbWVgIHRvIGBzY2VuZXNgXG4gICAgICAgIHRoaXMuc2NlbmVzW3NjZW5lLm5hbWVdID0gc2NlbmU7XG5cbiAgICAgICAgLy8gVXBkYXRlIGBzY2VuZU5hbWVzYFxuICAgICAgICB0aGlzLnNjZW5lTmFtZXMgPSBPYmplY3Qua2V5cyh0aGlzLnNjZW5lcyk7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiBnb1RvXG4gICAgZ29UbyAobmFtZSkge1xuXG4gICAgICAgIC8vIENoZWNrIGBzY2VuZXNbbmFtZV1gIGV4aXN0c1xuICAgICAgICBpZiAodGhpcy5zY2VuZXNbbmFtZV0pIHtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgYGN1cnJlbnRTY2VuZWAgZXhpc3RzIGFuZCBpdCBoYXMgYHNjZW5lRXhpdGBcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRTY2VuZSAmJiB0aGlzLmN1cnJlbnRTY2VuZS5zY2VuZUV4aXQpIHtcblxuICAgICAgICAgICAgICAgIC8vIENhbGwgYHNjZW5lRXhpdGBcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTY2VuZS5zY2VuZUV4aXQoKTtcblxuICAgICAgICAgICAgICAgIC8vIEluY3JlbWVudCBgZXhpdENvdW50YFxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNjZW5lLmV4aXRDb3VudCArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZXQgYGN1cnJlbnRTY2VuZWBcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjZW5lID0gdGhpcy5zY2VuZXNbbmFtZV07XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGBzY2VuZUVudGVyYCBleGlzdHNcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRTY2VuZS5zY2VuZUVudGVyKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgYGN1cnJlbnRTY2VuZS5zY2VuZUVudGVyZWRgXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NlbmUuc2NlbmVFbnRlcmVkID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCBgc2NlbmVFbnRlcmBcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTY2VuZS5zY2VuZUVudGVyKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBJbmNyZW1lbnQgYGVudGVyQ291bnRgXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NlbmUuZW50ZXJDb3VudCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYHNjZW5lc1tuYW1lXWAgZG9lcyBub3QgZXhpc3RcbiAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIExvZyBlcnJvclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTY2VuZSAke25hbWV9IGRvZXMgbm90IGV4aXN0YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IG5leHRcbiAgICBuZXh0ICgpIHtcblxuICAgICAgICAvLyBHbyB0byBuZXh0IHNjZW5lXG4gICAgICAgIHRoaXMuZ29Ubyh0aGlzLnNjZW5lc1tjeWNsaWNBcnJheSh0aGlzLnNjZW5lTmFtZXMsIHRoaXMuc2NlbmVOYW1lcy5pbmRleE9mKHRoaXMuY3VycmVudFNjZW5lLm5hbWUpICsgMSkudmFsdWVdLm5hbWUpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogcHJldmlvdXNcbiAgICBwcmV2aW91cyAoKSB7XG5cbiAgICAgICAgLy8gR28gdG8gcHJldmlvdXMgc2NlbmVcbiAgICAgICAgdGhpcy5nb1RvKHRoaXMuc2NlbmVzW2N5Y2xpY0FycmF5KHRoaXMuc2NlbmVOYW1lcywgdGhpcy5zY2VuZU5hbWVzLmluZGV4T2YodGhpcy5jdXJyZW50U2NlbmUubmFtZSkgLSAxKS52YWx1ZV0ubmFtZSk7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiByZW1vdmVcbiAgICByZW1vdmUgKG5hbWUpIHtcblxuICAgICAgICAvLyBSZW1vdmUgYG5hbWVgIGZyb20gYHNjZW5lc2BcbiAgICAgICAgZGVsZXRlIHRoaXMuc2NlbmVzW25hbWVdO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBgc2NlbmVOYW1lc2BcbiAgICAgICAgdGhpcy5zY2VuZU5hbWVzID0gT2JqZWN0LmtleXModGhpcy5zY2VuZXMpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogcmVuZGVyXG4gICAgcmVuZGVyICgpIHtcblxuICAgICAgICAvLyBDaGVjayB0aGVyZSBpcyBhIGN1cnJlbnQgc2NlbmUgYW5kIGl0IGhhcyBgcmVuZGVyYFxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U2NlbmUgJiYgdGhpcy5jdXJyZW50U2NlbmUucmVuZGVyKSB7XG5cbiAgICAgICAgICAgIC8vIENhbGwgYHJlbmRlcmBcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjZW5lLnJlbmRlcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiB1cGRhdGVcbiAgICB1cGRhdGUgKGRlbHRhVGltZSkge1xuXG4gICAgICAgIC8vIENoZWNrIHRoZXJlIGlzIGEgY3VycmVudCBzY2VuZSBhbmQgaXQgaGFzIGB1cGRhdGVgXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTY2VuZSAmJiB0aGlzLmN1cnJlbnRTY2VuZS51cGRhdGUpIHtcblxuICAgICAgICAgICAgLy8gQ2FsbCBgdXBkYXRlYFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NlbmUudXBkYXRlKGRlbHRhVGltZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIEV4cG9ydCBgU2NlbmVNYW5hZ2VyYFxuZXhwb3J0IGRlZmF1bHQgU2NlbmVNYW5hZ2VyO1xuIiwiLyoqXG4gKiBVdGlsc1xuICovXG5cbi8vIENyZWF0ZSBBdWRpbyBDb250ZXh0XG5jb25zdCBjcmVhdGVBdWRpb0NvbnRleHQgPSAoZGVzaXJlZFNhbXBsZVJhdGUgPSA0NDEwMCkgPT4ge1xuXG4gICAgLy8gRGVhbCB3aXRoIGJyb3dzZXIgcHJlZml4ZXNcbiAgICBjb25zdCBBdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5cbiAgICAvLyBDcmVhdGUgbmV3IGF1ZGlvIGNvbnRleHRcbiAgICBsZXQgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuXG4gICAgLy8gUmVndWxhciBleHByZXNzaW9uIHRoYXQgbWF0Y2hlcyBpT1MgZGV2aWNlc1xuICAgIGNvbnN0IGlPU1JlZ2V4ID0gbmV3IFJlZ0V4cCgnaVBob25lfGlQYWR8aVBvZCcsICdpJyk7XG5cbiAgICAvLyBXYXJtIGEgYGNvbnRleHRgXG4gICAgY29uc3Qgd2FybUNvbnRleHQgPSAoY29udGV4dCwgc2FtcGxlUmF0ZSkgPT4ge1xuXG4gICAgICAgIC8vIENyZWF0ZSBidWZmZXIgYW5kIHdhcm1lciBzb3VyY2VcbiAgICAgICAgY29uc3QgYnVmZmVyID0gY29udGV4dC5jcmVhdGVCdWZmZXIoMSwgMSwgc2FtcGxlUmF0ZSk7XG4gICAgICAgIGNvbnN0IHdhcm1lciA9IGNvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG5cbiAgICAgICAgLy8gU2V0IGB3YXJtZXIuYnVmZmVyYCB0byBgYnVmZmVyYFxuICAgICAgICB3YXJtZXIuYnVmZmVyID0gYnVmZmVyO1xuXG4gICAgICAgIC8vIENvbm5lY3QgYHdhcm1lcmBcbiAgICAgICAgd2FybWVyLmNvbm5lY3QoY29udGV4dC5kZXN0aW5hdGlvbik7XG5cbiAgICAgICAgLy8gUGxheSBgd2FybWVyYFxuICAgICAgICBpZiAod2FybWVyLnN0YXJ0KSB7XG4gICAgICAgICAgICB3YXJtZXIuc3RhcnQoMCk7XG4gICAgICAgIH1cblxuICAgICAgICBlbHNlIGlmICh3YXJtZXIubm90ZU9uKSB7XG4gICAgICAgICAgICB3YXJtZXIubm90ZU9uKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGlzY29ubmVjdCBgd2FybWVyYFxuICAgICAgICB3YXJtZXIuZGlzY29ubmVjdCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGVyZSBpcyBhIGJ1ZyB3aXRoIGlPUyA2KyB3aGVyZSB5b3Ugd2lsbCBnZXQgYW4gaW5jb3JyZWN0IHNhbXBsZSByYXRlXG4gICAgICogd2hpY2ggY2F1c2VzIGRpc3RvcnRpb24uIFRoZSBiZWxvdyBjaGVja3MgZm9yIHRoYXQgYW5kIGZpeGVzIGl0IGZvciB5b3VcbiAgICAgKiBieSBjcmVhdGluZyBhbiBhdWRpbyBjb250ZXh0LCBkZXN0cm95aW5nIGl0LCB0aGVuIGNyZWF0aW5nIGEgbmV3IG9uZVxuICAgICAqL1xuXG4gICAgLy8gQ2hlY2sgaWYgaU9TXG4gICAgaWYgKGlPU1JlZ2V4LnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgIXdpbmRvdy5NU1N0cmVhbSkge1xuXG4gICAgICAgIC8vIFdhcm0gdGhlIGNvbnRleHRcbiAgICAgICAgd2FybUNvbnRleHQoYXVkaW9Db250ZXh0LCBkZXNpcmVkU2FtcGxlUmF0ZSk7XG5cbiAgICAgICAgLy8gYHNhbXBsZVJhdGVgIGRvZXMgbm90IG1hdGNoIGBkZXNpcmVkU2FtcGxlUmF0ZWBcbiAgICAgICAgaWYgKGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlICE9PSBkZXNpcmVkU2FtcGxlUmF0ZSkge1xuXG4gICAgICAgICAgICAvLyBDbG9zZSBgYXVkaW9Db250ZXh0YFxuICAgICAgICAgICAgYXVkaW9Db250ZXh0LmNsb3NlKCk7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgYEF1ZGlvQ29udGV4dGBcbiAgICAgICAgICAgIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcblxuICAgICAgICAgICAgLy8gV2FybSB0aGUgbmV3IGNvbnRleHRcbiAgICAgICAgICAgIHdhcm1Db250ZXh0KGF1ZGlvQ29udGV4dCwgZGVzaXJlZFNhbXBsZVJhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGBhdWRpb0NvbnRleHRgXG4gICAgcmV0dXJuIGF1ZGlvQ29udGV4dDtcbn07XG5cbi8vIEN5Y2xpYyBBcnJheVxuY29uc3QgY3ljbGljQXJyYXkgPSAoYXJyLCBpbmRleCkgPT4ge1xuXG4gICAgY29uc3QgaXRlbSA9IChpbmRleCAlIGFyci5sZW5ndGggKyBhcnIubGVuZ3RoKSAlIGFyci5sZW5ndGg7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICAnaW5kZXgnOiBpdGVtLFxuICAgICAgICAndmFsdWUnOiBhcnJbaXRlbV1cbiAgICB9O1xufTtcblxuLy8gR2V0IFZpZGVvIEJsb2JcbmNvbnN0IGdldFZpZGVvQmxvYiA9IChzb3VyY2VzLCBjYWxsYmFjaykgPT4ge1xuXG4gICAgLy8gQ3JlYXRlIGB0ZXN0VmlkZW9gXG4gICAgY29uc3QgdGVzdFZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcblxuICAgIC8vIFZhcmlhYmxlIHRvIGhvbGQgdGhlIHN1cHBvcnRlZCB2aWRlbyB0eXBlXG4gICAgbGV0IHN1cHBvcnRlZFZpZGVvVHlwZSA9IHVuZGVmaW5lZDtcblxuICAgIC8vIEFycmF5IG9mIHZpZGVvIHR5cGVzIGluIG9yZGVyIG9mIHByZWZlcmVuY2VcbiAgICBjb25zdCBzdXBwb3J0ZWRWaWRlb1R5cGVzID0gW1xuICAgICAgICAndmlkZW8vb2dnOyBjb2RlY3M9XCJ0aGVvcmFcIicsXG4gICAgICAgICd2aWRlby93ZWJtOyBjb2RlY3M9XCJ2cDgsIHZvcmJpc1wiJyxcbiAgICAgICAgJ3ZpZGVvL21wNDsgY29kZWNzPVwiYXZjMS40MkUwMUVcIidcbiAgICBdO1xuXG4gICAgLy8gSXRlcmF0ZSBvdmVyIGBzdXBwb3J0ZWRWaWRlb1R5cGVzYFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3VwcG9ydGVkVmlkZW9UeXBlcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIC8vIEJyb3dzZXIgY2FuIHBsYXkgYHN1cHBvcnRlZFZpZGVvVHlwZXNbaV1gXG4gICAgICAgIGlmICh0ZXN0VmlkZW8uY2FuUGxheVR5cGUoc3VwcG9ydGVkVmlkZW9UeXBlc1tpXSkpIHtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBzb3VyY2UgZnJvbSBgc291cmNlc2BcbiAgICAgICAgICAgIFtzdXBwb3J0ZWRWaWRlb1R5cGVdID0gc291cmNlcy5maWx0ZXIoKHZpZGVvU291cmNlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpZGVvU291cmNlLnR5cGUgPT09IHN1cHBvcnRlZFZpZGVvVHlwZXNbaV0ubWF0Y2goL1teO10qL2dpKVswXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYHJlcWBcbiAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIC8vIE9uIGxvYWRcbiAgICByZXEub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBzb3VyY2UgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHJlcS5yZXNwb25zZSk7XG5cbiAgICAgICAgLy8gQ2FsbCBgY2FsbGJhY2tgIGFuZCBwYXNzIGBzb3VyY2VgXG4gICAgICAgIHJldHVybiBjYWxsYmFjayhzb3VyY2UsIHN1cHBvcnRlZFZpZGVvVHlwZSk7XG4gICAgfTtcblxuICAgIC8vIE9uIEVycm9yXG4gICAgcmVxLm9uZXJyb3IgPSAoZSkgPT4ge1xuXG4gICAgICAgIC8vIFRocm93IGVycm9yXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlKTtcbiAgICB9O1xuXG4gICAgLy8gT3BlbiBgcmVxYFxuICAgIHJlcS5vcGVuKCdnZXQnLCBzdXBwb3J0ZWRWaWRlb1R5cGUucGF0aCk7XG5cbiAgICAvLyBTZXQgYHJlc3BvbnNlVHlwZWAgdG8gYGJsb2JgXG4gICAgcmVxLnJlc3BvbnNlVHlwZSA9ICdibG9iJztcblxuICAgIC8vIFNlbmQgYHJlcWBcbiAgICByZXEuc2VuZCgpO1xufTtcblxuLy8gR2V0IEF1ZGlvIEFycmF5IEJ1ZmZlclxuY29uc3QgZ2V0QXVkaW9BcnJheUJ1ZmZlciA9IChzb3VyY2VzLCBjYWxsYmFjaykgPT4ge1xuXG4gICAgLy8gQ3JlYXRlIGB0ZXN0QXVkaW9gXG4gICAgY29uc3QgdGVzdEF1ZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcblxuICAgIC8vIFZhcmlhYmxlIHRvIGhvbGQgdGhlIHN1cHBvcnRlZCBhdWRpbyB0eXBlXG4gICAgbGV0IHN1cHBvcnRlZEF1ZGlvVHlwZSA9IHVuZGVmaW5lZDtcblxuICAgIC8vIEFycmF5IG9mIGF1ZGlvIHR5cGVzIGluIG9yZGVyIG9mIHByZWZlcmVuY2VcbiAgICBjb25zdCBzdXBwb3J0ZWRBdWRpb1R5cGVzID0gW1xuICAgICAgICAnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicsXG4gICAgICAgICdhdWRpby9tcGVnOyBjb2RlYz1cIm1wM1wiJ1xuICAgIF07XG5cbiAgICAvLyBJdGVyYXRlIG92ZXIgYHN1cHBvcnRlZEF1ZGlvVHlwZXNgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdXBwb3J0ZWRBdWRpb1R5cGVzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgLy8gQnJvd3NlciBjYW4gcGxheSBgc3VwcG9ydGVkQXVkaW9UeXBlc1tpXWBcbiAgICAgICAgaWYgKHRlc3RBdWRpby5jYW5QbGF5VHlwZShzdXBwb3J0ZWRBdWRpb1R5cGVzW2ldKSkge1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHNvdXJjZSBmcm9tIGBzb3VyY2VzYFxuICAgICAgICAgICAgW3N1cHBvcnRlZEF1ZGlvVHlwZV0gPSBzb3VyY2VzLmZpbHRlcigoYXVkaW9Tb3VyY2UpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXVkaW9Tb3VyY2UudHlwZSA9PT0gc3VwcG9ydGVkQXVkaW9UeXBlc1tpXS5tYXRjaCgvW147XSovZ2kpWzBdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNvcnQgb3V0IHByZWZpeFxuICAgIHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5cbiAgICAvLyBDcmVhdGUgYGF1ZGlvQ29udGV4dGBcbiAgICBjb25zdCBhdWRpb0NvbnRleHQgPSBjcmVhdGVBdWRpb0NvbnRleHQoKTtcblxuICAgIC8vIENsb3NlIGBhdWRpb0NvbnRleHRgXG4gICAgYXVkaW9Db250ZXh0LmNsb3NlKCk7XG5cbiAgICAvLyBDcmVhdGUgYHJlcXVlc3RgXG4gICAgY29uc3QgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgLy8gT3BlbiBgcmVxdWVzdGBcbiAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHN1cHBvcnRlZEF1ZGlvVHlwZS5wYXRoLCB0cnVlKTtcblxuICAgIC8vIFNldCBgcmVzcG9uc2VUeXBlYCB0byBgYXJyYXlidWZmZXJgXG4gICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgLy8gTG9hZGVkXG4gICAgcmVxdWVzdC5vbmxvYWQgPSAoKSA9PiB7XG5cbiAgICAgICAgLy8gRGVjb2RlIGJ1ZmZlclxuICAgICAgICBhdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsXG5cbiAgICAgICAgICAgIC8vIERlY29kZWQgc3VjY2Vzc2Z1bGx5XG4gICAgICAgICAgICAoYnVmZmVyKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxsIGBjYWxsYmFja2AgYW5kIHBhc3MgYGJ1ZmZlcmBcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhidWZmZXIpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gRXJyb3IgZGVjb2RpbmdcbiAgICAgICAgICAgIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICAvLyBFcnJvclxuICAgIHJlcXVlc3Qub25lcnJvciA9IChlKSA9PiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlKTtcbiAgICB9O1xuXG4gICAgLy8gU2VuZCBgcmVxdWVzdGBcbiAgICByZXF1ZXN0LnNlbmQoKTtcbn07XG5cbi8vIE5vIE9wXG5jb25zdCBub09wID0gKCkgPT4ge307XG5cbi8vIEV4cG9ydCBVdGlsaXRpZXNcbmV4cG9ydCB7Y3JlYXRlQXVkaW9Db250ZXh0LCBjeWNsaWNBcnJheSwgZ2V0QXVkaW9BcnJheUJ1ZmZlciwgZ2V0VmlkZW9CbG9iLCBub09wfTtcbiIsIi8qKlxuICogUGFnZTogYWcyZFBhZ2VcbiAqL1xuXG4vLyBEZXBlbmRlbmNpZXNcbmltcG9ydCBleHBlcmllbmNlIGZyb20gJy4vZXhwZXJpZW5jZSc7XG5pbXBvcnQge2Fzc2V0TG9hZGVyLCBhdWRpb01hbmFnZXIsIHNjZW5lTWFuYWdlcn0gZnJvbSAnLi9saWJzL2FnMmQnO1xuXG4vLyBTY2VuZXNcbmltcG9ydCBTY2VuZU1vYmlsZUludGVyYWN0aW9uIGZyb20gJy4vc2NlbmVzL1NjZW5lTW9iaWxlSW50ZXJhY3Rpb24nO1xuaW1wb3J0IFNjZW5lTG9hZGluZyBmcm9tICcuL3NjZW5lcy9TY2VuZUxvYWRpbmcnO1xuXG4vKipcbiAqIEFzc2V0IExvYWRlciBzZXR1cFxuICovXG5hc3NldExvYWRlci5hZGRBc3NldHMoW1xuICAgIHtcbiAgICAgICAgJ3R5cGUnOiAnYXVkaW8nLFxuICAgICAgICAnbmFtZSc6ICdUZXN0QXVkaW8nLFxuICAgICAgICAnc291cmNlcyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdhdWRpby9vZ2cnLFxuICAgICAgICAgICAgICAgICdwYXRoJzogJy9hdWRpby9UZXN0QXVkaW8ub2dnJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdhdWRpby9tcGVnJyxcbiAgICAgICAgICAgICAgICAncGF0aCc6ICcvYXVkaW8vVGVzdEF1ZGlvLm1wMydcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgICAndHlwZSc6ICd2aWRlbycsXG4gICAgICAgICduYW1lJzogJ1Rlc3RWaWRlbycsXG4gICAgICAgICdzb3VyY2VzJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ3ZpZGVvL29nZycsXG4gICAgICAgICAgICAgICAgJ3BhdGgnOiAnL3ZpZGVvL1Rlc3RWaWRlby5vZ2cnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ3ZpZGVvL3dlYm0nLFxuICAgICAgICAgICAgICAgICdwYXRoJzogJy92aWRlby9UZXN0VmlkZW8ud2VibSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAndmlkZW8vbXA0JyxcbiAgICAgICAgICAgICAgICAncGF0aCc6ICcvdmlkZW8vVGVzdFZpZGVvLm1wNCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH1cbl0pO1xuXG4vKipcbiAqIFNjZW5lIE1hbmFnZXIgc2V0dXBcbiAqL1xuXG4vLyBBZGQgYFNjZW5lTW9iaWxlSW50ZXJhY3Rpb25gIHRvIGBzY2VuZU1hbmFnZXJgXG5zY2VuZU1hbmFnZXIuYWRkKG5ldyBTY2VuZU1vYmlsZUludGVyYWN0aW9uKCkpO1xuXG4vLyBBZGQgYFNjZW5lTG9hZGluZ2AgdG8gYHNjZW5lTWFuYWdlcmBcbnNjZW5lTWFuYWdlci5hZGQobmV3IFNjZW5lTG9hZGluZygpKTtcblxuLyoqXG4gKiBTdGFydCBleHBlcmllbmNlXG4gKi9cblxuLy8gUmVzaXplIGV4cGVyaWVuY2UgdG8gd2luZG93XG5leHBlcmllbmNlLnJlc2l6ZUNhbnZhcyh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcblxuLy8gQWRkIGV2ZW50IGxpc3RlbmVyIHRvIHJlc2l6ZSBleHBlcmllbmNlIHdoZW4gd2luZG93IHJlc2l6ZXNcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgZXhwZXJpZW5jZS5yZXNpemVDYW52YXMod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG59KTtcblxuLy8gR28gdG8gYFNjZW5lTW9iaWxlSW50ZXJhY3Rpb25gXG5zY2VuZU1hbmFnZXIuZ29UbygnU2NlbmVNb2JpbGVJbnRlcmFjdGlvbicpO1xuXG53aW5kb3cuYXVkaW9NYW5hZ2VyID0gYXVkaW9NYW5hZ2VyO1xuXG4vLyBDYWxsIGBzdGFydGBcbmV4cGVyaWVuY2Uuc3RhcnQoKTtcbiIsIi8qKlxuICogU2NlbmVMb2FkaW5nXG4gKi9cblxuLy8gRGVwZW5kZW5jaWVzXG5pbXBvcnQgZXhwZXJpZW5jZSBmcm9tICcuLi9leHBlcmllbmNlJztcbmltcG9ydCB7YXNzZXRMb2FkZXIsIGF1ZGlvTWFuYWdlciwgZXZlbnRFbWl0dGVyLCBTY2VuZSwgc2NlbmVNYW5hZ2VyfSBmcm9tICcuLi9saWJzL2FnMmQnO1xuXG4vLyBTY2VuZXNcbmltcG9ydCBTY2VuZVN0YXJ0IGZyb20gJy4vU2NlbmVTdGFydCc7XG5pbXBvcnQgU2NlbmVPbmUgZnJvbSAnLi9TY2VuZU9uZSc7XG5pbXBvcnQgU2NlbmVUd28gZnJvbSAnLi9TY2VuZVR3byc7XG5pbXBvcnQgU2NlbmVUaHJlZSBmcm9tICcuL1NjZW5lVGhyZWUnO1xuXG4vLyBDbGFzczogU2NlbmVMb2FkaW5nXG5jbGFzcyBTY2VuZUxvYWRpbmcgZXh0ZW5kcyBTY2VuZSB7XG5cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIGNvbnN0cnVjdG9yICgpIHtcblxuICAgICAgICAvLyBTZXQgbmFtZSBvZiBzY2VuZVxuICAgICAgICBzdXBlcignU2NlbmVMb2FkaW5nJyk7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiByZW5kZXJcbiAgICByZW5kZXIgKCkge1xuXG4gICAgICAgIC8vIFllbGxvdyBiYWNrZ3JvdW5kXG4gICAgICAgIGV4cGVyaWVuY2UuY29udGV4dC5maWxsU3R5bGUgPSAnI0ZGRkYwMCc7XG4gICAgICAgIGV4cGVyaWVuY2UuY29udGV4dC5maWxsUmVjdCgwLCAwLCBleHBlcmllbmNlLnNpemUud2lkdGgsIGV4cGVyaWVuY2Uuc2l6ZS5oZWlnaHQpO1xuXG4gICAgICAgIC8vIFNjZW5lIG5hbWVcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICBleHBlcmllbmNlLmNvbnRleHQudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gICAgICAgIGV4cGVyaWVuY2UuY29udGV4dC5maWxsU3R5bGUgPSAnIzAwMDAwMCc7XG4gICAgICAgIGV4cGVyaWVuY2UuY29udGV4dC5maWxsVGV4dCh0aGlzLm5hbWUsIGV4cGVyaWVuY2Uuc2l6ZS53aWR0aCAvIDIsIGV4cGVyaWVuY2Uuc2l6ZS5oZWlnaHQgLyAyKTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IHNjZW5lRW50ZXJcbiAgICBzY2VuZUVudGVyICgpIHtcblxuICAgICAgICAvLyBTY2VuZSBoYXNuJ3QgYmVlbiBlbnRlcmVkIGJlZm9yZVxuICAgICAgICBpZiAodGhpcy5lbnRlckNvdW50ID09PSAwKSB7XG5cbiAgICAgICAgICAgIC8vIExpc3RlbmVyIGZvciBgYXNzZXRMb2FkZXJgIGxvYWRlZFxuICAgICAgICAgICAgZXZlbnRFbWl0dGVyLmFkZExpc3RlbmVyKCdhc3NldExvYWRlcjpsb2FkZWQnLCAoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBBdWRpbyBNYW5hZ2VyIHNldHVwXG4gICAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgYFRlc3RBdWRpb2AgdG8gYGF1ZGlvTWFuYWdlcmBcbiAgICAgICAgICAgICAgICBhdWRpb01hbmFnZXIuYWRkKGFzc2V0TG9hZGVyLmFzc2V0cy5UZXN0QXVkaW8pO1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogU2NlbmUgTWFuYWdlciBzZXR1cFxuICAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkIGBTY2VuZVN0YXJ0YCB0byBgc2NlbmVNYW5hZ2VyYFxuICAgICAgICAgICAgICAgIHNjZW5lTWFuYWdlci5hZGQobmV3IFNjZW5lU3RhcnQoKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgYFNjZW5lT25lYCB0byBgc2NlbmVNYW5hZ2VyYFxuICAgICAgICAgICAgICAgIHNjZW5lTWFuYWdlci5hZGQobmV3IFNjZW5lT25lKCkpO1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkIGBTY2VuZVR3b2AgdG8gYHNjZW5lTWFuYWdlcmBcbiAgICAgICAgICAgICAgICBzY2VuZU1hbmFnZXIuYWRkKG5ldyBTY2VuZVR3bygpKTtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBgU2NlbmVUaHJlZWAgdG8gYHNjZW5lTWFuYWdlcmBcbiAgICAgICAgICAgICAgICBzY2VuZU1hbmFnZXIuYWRkKG5ldyBTY2VuZVRocmVlKCkpO1xuXG4gICAgICAgICAgICAgICAgLy8gR28gdG8gYFNjZW5lU3RhcnRgXG4gICAgICAgICAgICAgICAgc2NlbmVNYW5hZ2VyLmdvVG8oJ1NjZW5lU3RhcnQnKTtcbiAgICAgICAgICAgIH0sIDEpO1xuXG4gICAgICAgICAgICAvLyBDYWxsIGBsb2FkQXNzZXRzYFxuICAgICAgICAgICAgYXNzZXRMb2FkZXIubG9hZEFzc2V0cygoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAvLyBFbWl0IGxvYWRlZFxuICAgICAgICAgICAgICAgIGV2ZW50RW1pdHRlci5lbWl0KCdhc3NldExvYWRlcjpsb2FkZWQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBFeHBvcnQgYFNjZW5lTG9hZGluZ2BcbmV4cG9ydCBkZWZhdWx0IFNjZW5lTG9hZGluZztcbiIsIi8qKlxuICogU2NlbmVNb2JpbGVJbnRlcmFjdGlvblxuICovXG5cbi8vIERlcGVuZGVuY2llc1xuaW1wb3J0IGV4cGVyaWVuY2UgZnJvbSAnLi4vZXhwZXJpZW5jZSc7XG5pbXBvcnQge2F1ZGlvTWFuYWdlciwgZXZlbnRFbWl0dGVyLCBTY2VuZSwgc2NlbmVNYW5hZ2VyfSBmcm9tICcuLi9saWJzL2FnMmQnO1xuXG4vLyBDcmVhdGUgdGhlIE1vYmlsZSBJbnRlcmFjdGlvbiBTY2VuZVxuY2xhc3MgU2NlbmVNb2JpbGVJbnRlcmFjdGlvbiBleHRlbmRzIFNjZW5lIHtcblxuICAgIC8vIENvbnN0cnVjdG9yXG4gICAgY29uc3RydWN0b3IgKCkge1xuXG4gICAgICAgIC8vIFNldCBuYW1lIG9mIHNjZW5lXG4gICAgICAgIHN1cGVyKCdTY2VuZU1vYmlsZUludGVyYWN0aW9uJyk7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiByZW5kZXJcbiAgICByZW5kZXIgKCkge1xuXG4gICAgICAgIC8vIFJlZCBiYWNrZ3JvdW5kXG4gICAgICAgIGV4cGVyaWVuY2UuY29udGV4dC5maWxsU3R5bGUgPSAnI0ZGMDAwMCc7XG4gICAgICAgIGV4cGVyaWVuY2UuY29udGV4dC5maWxsUmVjdCgwLCAwLCBleHBlcmllbmNlLnNpemUud2lkdGgsIGV4cGVyaWVuY2Uuc2l6ZS5oZWlnaHQpO1xuXG4gICAgICAgIC8vIFNjZW5lIG5hbWVcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICBleHBlcmllbmNlLmNvbnRleHQudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gICAgICAgIGV4cGVyaWVuY2UuY29udGV4dC5maWxsU3R5bGUgPSAnIzAwMDAwMCc7XG4gICAgICAgIGV4cGVyaWVuY2UuY29udGV4dC5maWxsVGV4dCh0aGlzLm5hbWUsIGV4cGVyaWVuY2Uuc2l6ZS53aWR0aCAvIDIsIGV4cGVyaWVuY2Uuc2l6ZS5oZWlnaHQgLyAyKTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IHNjZW5lRW50ZXJcbiAgICBzY2VuZUVudGVyICgpIHtcblxuICAgICAgICAvLyBTY2VuZSBoYXNuJ3QgYmVlbiBlbnRlcmVkIGJlZm9yZVxuICAgICAgICBpZiAodGhpcy5lbnRlckNvdW50ID09PSAwKSB7XG5cbiAgICAgICAgICAgIC8vIExpc3RlbmVyIGZvciBgYXVkaW9NYW5hZ2VyYCBjb250ZXh0IHJlYWR5XG4gICAgICAgICAgICBldmVudEVtaXR0ZXIuYWRkTGlzdGVuZXIoJ2F1ZGlvTWFuYWdlcjpjb250ZXh0IHJlYWR5JywgKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgLy8gR28gdG8gYFNjZW5lTG9hZGluZ2BcbiAgICAgICAgICAgICAgICBzY2VuZU1hbmFnZXIuZ29UbygnU2NlbmVMb2FkaW5nJyk7XG4gICAgICAgICAgICB9LCAxKTtcblxuICAgICAgICAgICAgLy8gQ2FsbCBgaW5pdGAgb24gYGF1ZGlvTWFuYWdlcmBcbiAgICAgICAgICAgIGF1ZGlvTWFuYWdlci5pbml0KCgpID0+IHtcblxuICAgICAgICAgICAgICAgIC8vIEVtaXQgd2hlbiBjb250ZXh0IGlzIHJlYWR5XG4gICAgICAgICAgICAgICAgZXZlbnRFbWl0dGVyLmVtaXQoJ2F1ZGlvTWFuYWdlcjpjb250ZXh0IHJlYWR5Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gRXhwb3J0IGBTY2VuZU1vYmlsZUludGVyYWN0aW9uYFxuZXhwb3J0IGRlZmF1bHQgU2NlbmVNb2JpbGVJbnRlcmFjdGlvbjtcbiIsIi8qKlxuICogU2NlbmVzOiBTY2VuZU9uZVxuICovXG5cbi8vIERlcGVuZGVuY2llc1xuaW1wb3J0IGV4cGVyaWVuY2UgZnJvbSAnLi4vZXhwZXJpZW5jZSc7XG5pbXBvcnQge2Fzc2V0TG9hZGVyLCBhdWRpb01hbmFnZXIsIFNjZW5lLCBzY2VuZU1hbmFnZXJ9IGZyb20gJy4uL2xpYnMvYWcyZCc7XG5cbi8vIENsYXNzOiBTY2VuZU9uZVxuY2xhc3MgU2NlbmVPbmUgZXh0ZW5kcyBTY2VuZSB7XG5cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIGNvbnN0cnVjdG9yICgpIHtcblxuICAgICAgICAvLyBTZXQgbmFtZSBvZiBzY2VuZVxuICAgICAgICBzdXBlcignU2NlbmVPbmUnKTtcblxuICAgICAgICAvLyBTZXQgYHZpZGVvYFxuICAgICAgICB0aGlzLnZpZGVvID0gYXNzZXRMb2FkZXIuYXNzZXRzLlRlc3RWaWRlbztcbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IHJlbmRlclxuICAgIHJlbmRlciAoKSB7XG5cbiAgICAgICAgLy8gUmVkIGJhY2tncm91bmRcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LmZpbGxTdHlsZSA9ICcjRkYwMDAwJztcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIGV4cGVyaWVuY2Uuc2l6ZS53aWR0aCwgZXhwZXJpZW5jZS5zaXplLmhlaWdodCk7XG5cbiAgICAgICAgLy8gUmVuZGVyIGB2aWRlb2BcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LmRyYXdJbWFnZSh0aGlzLnZpZGVvLmVsZW1lbnQsIDAsIDApO1xuXG4gICAgICAgIC8vIFNjZW5lIG5hbWVcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICBleHBlcmllbmNlLmNvbnRleHQudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gICAgICAgIGV4cGVyaWVuY2UuY29udGV4dC5maWxsU3R5bGUgPSAnIzAwMDAwMCc7XG4gICAgICAgIGV4cGVyaWVuY2UuY29udGV4dC5maWxsVGV4dCh0aGlzLm5hbWUsIGV4cGVyaWVuY2Uuc2l6ZS53aWR0aCAvIDIsIGV4cGVyaWVuY2Uuc2l6ZS5oZWlnaHQgLyAyKTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IHNjZW5lRW50ZXJcbiAgICBzY2VuZUVudGVyICgpIHtcblxuICAgICAgICAvLyBTZXQgYGN1cnJlbnRUaW1lYCB0byBgMGBcbiAgICAgICAgdGhpcy52aWRlby5lbGVtZW50LmN1cnJlbnRUaW1lID0gMDtcblxuICAgICAgICAvLyBQbGF5IGB2aWRlb2BcbiAgICAgICAgdGhpcy52aWRlby5lbGVtZW50LnBsYXkoKTtcblxuICAgICAgICAvLyBTdG9yZSByZWZlcmVuY2UgdG8gYHRoaXNgXG4gICAgICAgIGNvbnN0IF90aGlzID0gdGhpcztcblxuICAgICAgICAvLyBPbmNlIHRoZSB2aWRlbyBpcyBjb21wbGV0ZWRcbiAgICAgICAgdGhpcy52aWRlby5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgZnVuY3Rpb24gbmV4dFNjZW5lICgpIHtcbiAgICAgICAgICAgIF90aGlzLnZpZGVvLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZW5kZWQnLCBuZXh0U2NlbmUsIGZhbHNlKTtcbiAgICAgICAgICAgIHNjZW5lTWFuYWdlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFBsYXkgYFRlc3RBdWRpb2BcbiAgICAgICAgYXVkaW9NYW5hZ2VyLnBsYXkoJ1Rlc3RBdWRpbycpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogc2NlbmVFeGl0XG4gICAgc2NlbmVFeGl0ICgpIHtcblxuICAgICAgICAvLyBQYXVzZSBgdmlkZW9gXG4gICAgICAgIHRoaXMudmlkZW8uZWxlbWVudC5wYXVzZSgpO1xuXG4gICAgICAgIC8vIFNldCBgY3VycmVudFRpbWVgIHRvIGAwYFxuICAgICAgICB0aGlzLnZpZGVvLmVsZW1lbnQuY3VycmVudFRpbWUgPSAwO1xuXG4gICAgICAgIC8vIFN0b3AgYFRlc3RBdWRpb2BcbiAgICAgICAgYXVkaW9NYW5hZ2VyLnN0b3AoJ1Rlc3RBdWRpbycpO1xuICAgIH1cbn1cblxuLy8gRXhwb3J0IGBTY2VuZU9uZWBcbmV4cG9ydCBkZWZhdWx0IFNjZW5lT25lO1xuIiwiLyoqXG4gKiBTY2VuZVN0YXJ0XG4gKi9cblxuLy8gRGVwZW5kZW5jaWVzXG5pbXBvcnQgZXhwZXJpZW5jZSBmcm9tICcuLi9leHBlcmllbmNlJztcbmltcG9ydCB7ZXZlbnRIYW5kbGVyLCBTY2VuZSwgc2NlbmVNYW5hZ2VyfSBmcm9tICcuLi9saWJzL2FnMmQnO1xuXG4vLyBDcmVhdGUgdGhlIHN0YXJ0IFNjZW5lXG5jbGFzcyBTY2VuZVN0YXJ0IGV4dGVuZHMgU2NlbmUge1xuXG4gICAgLy8gQ29uc3RydWN0b3JcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG5cbiAgICAgICAgLy8gU2V0IG5hbWUgb2Ygc2NlbmVcbiAgICAgICAgc3VwZXIoJ1NjZW5lU3RhcnQnKTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IHJlbmRlclxuICAgIHJlbmRlciAoKSB7XG5cbiAgICAgICAgLy8gUmVkIGJhY2tncm91bmRcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LmZpbGxTdHlsZSA9ICcjRkYwMDAwJztcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIGV4cGVyaWVuY2Uuc2l6ZS53aWR0aCwgZXhwZXJpZW5jZS5zaXplLmhlaWdodCk7XG5cbiAgICAgICAgLy8gU2NlbmUgbmFtZVxuICAgICAgICBleHBlcmllbmNlLmNvbnRleHQudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIGV4cGVyaWVuY2UuY29udGV4dC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwMDAwJztcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LmZpbGxUZXh0KHRoaXMubmFtZSwgZXhwZXJpZW5jZS5zaXplLndpZHRoIC8gMiwgZXhwZXJpZW5jZS5zaXplLmhlaWdodCAvIDIpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogc2NlbmVFbnRlclxuICAgIHNjZW5lRW50ZXIgKCkge1xuXG4gICAgICAgIC8vIEJpbmQgYGNsaWNrYCBpbnRlcmFjdGlvblxuICAgICAgICBldmVudEhhbmRsZXIuYWRkRXZlbnQoe1xuICAgICAgICAgICAgJ25hbWUnOiAnU2NlbmVTdGFydEludGVyYWN0aW9uJyxcbiAgICAgICAgICAgICdlbGVtZW50JzogZXhwZXJpZW5jZS5jYW52YXMsXG4gICAgICAgICAgICAndHlwZSc6ICdjbGljaycsXG4gICAgICAgICAgICAnZnVuY3Rpb24nOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2NlbmVNYW5hZ2VyLm5leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gTWV0aG9kOiBzY2VuZUV4aXRcbiAgICBzY2VuZUV4aXQgKCkge1xuXG4gICAgICAgIC8vIFVuYmluZCBgY2xpY2tgIGludGVyYWN0aW9uXG4gICAgICAgIGV2ZW50SGFuZGxlci5yZW1vdmVFdmVudCgnU2NlbmVTdGFydEludGVyYWN0aW9uJyk7XG4gICAgfVxufVxuXG4vLyBFeHBvcnQgYFNjZW5lU3RhcnRgXG5leHBvcnQgZGVmYXVsdCBTY2VuZVN0YXJ0O1xuIiwiLyoqXG4gKiBTY2VuZXM6IFNjZW5lVGhyZWVcbiAqL1xuXG4vLyBEZXBlbmRlbmNpZXNcbmltcG9ydCBleHBlcmllbmNlIGZyb20gJy4uL2V4cGVyaWVuY2UnO1xuaW1wb3J0IHthc3NldExvYWRlciwgYXVkaW9NYW5hZ2VyLCBTY2VuZX0gZnJvbSAnLi4vbGlicy9hZzJkJztcblxuLy8gQ2xhc3M6IFNjZW5lVGhyZWVcbmNsYXNzIFNjZW5lVGhyZWUgZXh0ZW5kcyBTY2VuZSB7XG5cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIGNvbnN0cnVjdG9yICgpIHtcblxuICAgICAgICAvLyBTZXQgbmFtZSBvZiBzY2VuZVxuICAgICAgICBzdXBlcignU2NlbmVUaHJlZScpO1xuXG4gICAgICAgIC8vIFNldCBgdmlkZW9gXG4gICAgICAgIHRoaXMudmlkZW8gPSBhc3NldExvYWRlci5hc3NldHMuVGVzdFZpZGVvO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogcmVuZGVyXG4gICAgcmVuZGVyICgpIHtcblxuICAgICAgICAvLyBSZWQgYmFja2dyb3VuZFxuICAgICAgICBleHBlcmllbmNlLmNvbnRleHQuZmlsbFN0eWxlID0gJyNGRjAwMDAnO1xuICAgICAgICBleHBlcmllbmNlLmNvbnRleHQuZmlsbFJlY3QoMCwgMCwgZXhwZXJpZW5jZS5zaXplLndpZHRoLCBleHBlcmllbmNlLnNpemUuaGVpZ2h0KTtcblxuICAgICAgICAvLyBSZW5kZXIgYHZpZGVvYFxuICAgICAgICBleHBlcmllbmNlLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMudmlkZW8uZWxlbWVudCwgMCwgMCk7XG5cbiAgICAgICAgLy8gU2NlbmUgbmFtZVxuICAgICAgICBleHBlcmllbmNlLmNvbnRleHQudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIGV4cGVyaWVuY2UuY29udGV4dC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwMDAwJztcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LmZpbGxUZXh0KHRoaXMubmFtZSwgZXhwZXJpZW5jZS5zaXplLndpZHRoIC8gMiwgZXhwZXJpZW5jZS5zaXplLmhlaWdodCAvIDIpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogc2NlbmVFbnRlclxuICAgIHNjZW5lRW50ZXIgKCkge1xuXG4gICAgICAgIC8vIFNldCBgY3VycmVudFRpbWVgIHRvIGAwYFxuICAgICAgICB0aGlzLnZpZGVvLmVsZW1lbnQuY3VycmVudFRpbWUgPSAwO1xuXG4gICAgICAgIC8vIFBsYXkgYHZpZGVvYFxuICAgICAgICB0aGlzLnZpZGVvLmVsZW1lbnQucGxheSgpO1xuXG4gICAgICAgIC8vIFBsYXkgYFRlc3RBdWRpb2BcbiAgICAgICAgYXVkaW9NYW5hZ2VyLnBsYXkoJ1Rlc3RBdWRpbycpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogc2NlbmVFeGl0XG4gICAgc2NlbmVFeGl0ICgpIHtcblxuICAgICAgICAvLyBQYXVzZSBgdmlkZW9gXG4gICAgICAgIHRoaXMudmlkZW8uZWxlbWVudC5wYXVzZSgpO1xuXG4gICAgICAgIC8vIFNldCBgY3VycmVudFRpbWVgIHRvIGAwYFxuICAgICAgICB0aGlzLnZpZGVvLmVsZW1lbnQuY3VycmVudFRpbWUgPSAwO1xuXG4gICAgICAgIC8vIFN0b3AgYFRlc3RBdWRpb2BcbiAgICAgICAgYXVkaW9NYW5hZ2VyLnN0b3AoJ1Rlc3RBdWRpbycpO1xuICAgIH1cbn1cblxuLy8gRXhwb3J0IGBTY2VuZVRocmVlYFxuZXhwb3J0IGRlZmF1bHQgU2NlbmVUaHJlZTtcbiIsIi8qKlxuICogU2NlbmVzOiBTY2VuZVR3b1xuICovXG5cbi8vIERlcGVuZGVuY2llc1xuaW1wb3J0IGV4cGVyaWVuY2UgZnJvbSAnLi4vZXhwZXJpZW5jZSc7XG5pbXBvcnQge2Fzc2V0TG9hZGVyLCBhdWRpb01hbmFnZXIsIFNjZW5lLCBzY2VuZU1hbmFnZXJ9IGZyb20gJy4uL2xpYnMvYWcyZCc7XG5cbi8vIENsYXNzOiBTY2VuZVR3b1xuY2xhc3MgU2NlbmVUd28gZXh0ZW5kcyBTY2VuZSB7XG5cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIGNvbnN0cnVjdG9yICgpIHtcblxuICAgICAgICAvLyBTZXQgbmFtZSBvZiBzY2VuZVxuICAgICAgICBzdXBlcignU2NlbmVUd28nKTtcblxuICAgICAgICAvLyBTZXQgYHZpZGVvYFxuICAgICAgICB0aGlzLnZpZGVvID0gYXNzZXRMb2FkZXIuYXNzZXRzLlRlc3RWaWRlbztcbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IHJlbmRlclxuICAgIHJlbmRlciAoKSB7XG5cbiAgICAgICAgLy8gUmVkIGJhY2tncm91bmRcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LmZpbGxTdHlsZSA9ICcjRkYwMDAwJztcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIGV4cGVyaWVuY2Uuc2l6ZS53aWR0aCwgZXhwZXJpZW5jZS5zaXplLmhlaWdodCk7XG5cbiAgICAgICAgLy8gUmVuZGVyIGB2aWRlb2BcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LmRyYXdJbWFnZSh0aGlzLnZpZGVvLmVsZW1lbnQsIDAsIDApO1xuXG4gICAgICAgIC8vIFNjZW5lIG5hbWVcbiAgICAgICAgZXhwZXJpZW5jZS5jb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICBleHBlcmllbmNlLmNvbnRleHQudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gICAgICAgIGV4cGVyaWVuY2UuY29udGV4dC5maWxsU3R5bGUgPSAnIzAwMDAwMCc7XG4gICAgICAgIGV4cGVyaWVuY2UuY29udGV4dC5maWxsVGV4dCh0aGlzLm5hbWUsIGV4cGVyaWVuY2Uuc2l6ZS53aWR0aCAvIDIsIGV4cGVyaWVuY2Uuc2l6ZS5oZWlnaHQgLyAyKTtcbiAgICB9XG5cbiAgICAvLyBNZXRob2Q6IHNjZW5lRW50ZXJcbiAgICBzY2VuZUVudGVyICgpIHtcblxuICAgICAgICAvLyBTZXQgYGN1cnJlbnRUaW1lYCB0byBgMGBcbiAgICAgICAgdGhpcy52aWRlby5lbGVtZW50LmN1cnJlbnRUaW1lID0gMDtcblxuICAgICAgICAvLyBQbGF5IGB2aWRlb2BcbiAgICAgICAgdGhpcy52aWRlby5lbGVtZW50LnBsYXkoKTtcblxuICAgICAgICAvLyBTdG9yZSByZWZlcmVuY2UgdG8gYHRoaXNgXG4gICAgICAgIGNvbnN0IF90aGlzID0gdGhpcztcblxuICAgICAgICAvLyBPbmNlIHRoZSB2aWRlbyBpcyBjb21wbGV0ZWRcbiAgICAgICAgdGhpcy52aWRlby5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgZnVuY3Rpb24gbmV4dFNjZW5lICgpIHtcbiAgICAgICAgICAgIF90aGlzLnZpZGVvLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZW5kZWQnLCBuZXh0U2NlbmUsIGZhbHNlKTtcbiAgICAgICAgICAgIHNjZW5lTWFuYWdlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFBsYXkgYFRlc3RBdWRpb2BcbiAgICAgICAgYXVkaW9NYW5hZ2VyLnBsYXkoJ1Rlc3RBdWRpbycpO1xuICAgIH1cblxuICAgIC8vIE1ldGhvZDogc2NlbmVFeGl0XG4gICAgc2NlbmVFeGl0ICgpIHtcblxuICAgICAgICAvLyBQYXVzZSBgdmlkZW9gXG4gICAgICAgIHRoaXMudmlkZW8uZWxlbWVudC5wYXVzZSgpO1xuXG4gICAgICAgIC8vIFNldCBgY3VycmVudFRpbWVgIHRvIGAwYFxuICAgICAgICB0aGlzLnZpZGVvLmVsZW1lbnQuY3VycmVudFRpbWUgPSAwO1xuXG4gICAgICAgIC8vIFN0b3AgYFRlc3RBdWRpb2BcbiAgICAgICAgYXVkaW9NYW5hZ2VyLnN0b3AoJ1Rlc3RBdWRpbycpO1xuICAgIH1cbn1cblxuLy8gRXhwb3J0IGBTY2VuZVR3b2BcbmV4cG9ydCBkZWZhdWx0IFNjZW5lVHdvO1xuIl19
