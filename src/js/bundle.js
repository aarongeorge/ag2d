(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./modules/AnimationManager":2,"./modules/AssetLoader":3,"./modules/AudioManager":4,"./modules/EventEmitter":5,"./modules/EventHandler":6,"./modules/Scene":7,"./modules/SceneManager":8,"./modules/Utils":9}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

                // Video
                case 'video':
                    {

                        // Call `loadVideo`
                        this.loadVideo(asset, callback);

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

},{"./Utils":9}],4:[function(require,module,exports){
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

        // Method: resume

    }, {
        key: 'resume',
        value: function resume() {
            this.context.resume();
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

        // Method: suspend

    }, {
        key: 'suspend',
        value: function suspend() {
            this.context.suspend();
        }
    }]);

    return AudioManager;
}();

// Export `AudioManager`


exports.default = AudioManager;

},{"./EventHandler":6,"./Utils":9}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"./Utils":9}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ag2d = require('ag2d');

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
    _ag2d.audioManager.suspend();
};

// Start
var start = function start() {
    _ag2d.audioManager.resume();
};

// Bind the hooks
experience.hooks.bind('update', update);
experience.hooks.bind('render', render);
experience.hooks.bind('stop', stop);
experience.hooks.bind('start', start);

// Export `experience`
exports.default = experience;

},{"ag2d":1}],11:[function(require,module,exports){
'use strict';

var _experience = require('./experience');

var _experience2 = _interopRequireDefault(_experience);

var _ag2d = require('ag2d');

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

// Call `start`
_experience2.default.start();

},{"./experience":10,"./scenes/SceneLoading":12,"./scenes/SceneMobileInteraction":13,"ag2d":1}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _experience = require('../experience');

var _experience2 = _interopRequireDefault(_experience);

var _ag2d = require('ag2d');

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
                     * Set videos to play inline
                     */

                    // Iterate over `assetLoader.assets`
                    Object.keys(_ag2d.assetLoader.assets).forEach(function (asset) {

                        // Store reference to `currentAsset`
                        var currentAsset = _ag2d.assetLoader.assets[asset];

                        // `type` is `video`
                        if (currentAsset.type === 'video') {

                            // Add playsinline
                            currentAsset.element.setAttribute('playsinline', true);

                            // Add webkit-playsinline
                            currentAsset.element.setAttribute('webkit-playsinline', true);
                        }
                    });

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

},{"../experience":10,"./SceneOne":14,"./SceneStart":15,"./SceneThree":16,"./SceneTwo":17,"ag2d":1}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _experience = require('../experience');

var _experience2 = _interopRequireDefault(_experience);

var _ag2d = require('ag2d');

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

                    document.querySelector('#start').addEventListener('click', function () {
                        _experience2.default.start();
                    });

                    document.querySelector('#stop').addEventListener('click', function () {
                        _experience2.default.stop();
                    });

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

},{"../experience":10,"ag2d":1}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _experience = require('../experience');

var _experience2 = _interopRequireDefault(_experience);

var _ag2d = require('ag2d');

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

},{"../experience":10,"ag2d":1}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _experience = require('../experience');

var _experience2 = _interopRequireDefault(_experience);

var _ag2d = require('ag2d');

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

},{"../experience":10,"ag2d":1}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _experience = require('../experience');

var _experience2 = _interopRequireDefault(_experience);

var _ag2d = require('ag2d');

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

},{"../experience":10,"ag2d":1}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _experience = require('../experience');

var _experience2 = _interopRequireDefault(_experience);

var _ag2d = require('ag2d');

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

},{"../experience":10,"ag2d":1}]},{},[11]);
