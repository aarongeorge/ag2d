/**
 * Asset loader
 *
 * @desc An asset loader
 */

// Constructor: AssetLoader
const AssetLoader = function () {

    this.assets = {};
    this.assetsToLoad = [];
    this.assetsLoaded = false;
};

// Method: addAssets
AssetLoader.prototype.addAssets = function (assets) {

    // `assets` is not an array
    if (Object.prototype.toString.call(assets) !== '[object Array]') {

        // Throw error
        throw new Error('`addAssets` must be passed an array');
    }

    // `assets` is an array
    else {

        // Iterate over `assets`
        for (let i = 0; i < assets.length; i++) {

            // Asset doesn't have a type
            if (assets[i].type) {

                // Switch over `type`
                switch (assets[i].type) {

                    // Image
                case 'image': {

                    // Asset doesn't have a path
                    if (!assets[i].path) {

                        // Throw error
                        throw new Error('Asset does not have a path', assets[i]);
                    }

                    // Asset does have a path
                    else {

                        // Asset doesn't have a name
                        if (!assets[i].name) {

                            // Throw error
                            throw new Error('Asset does not have a name', assets[i]);
                        }

                        // Asset has everything we need
                        else {

                            // Add asset to `assetsToLoad`
                            this.assetsToLoad.push(assets[i]);
                        }
                    }

                    break;
                }

                case 'video': {

                    // Asset doesn't have a path
                    if (!assets[i].path) {

                        // Throw error
                        throw new Error('Asset does not have a path', assets[i]);
                    }

                    // Asset does have a path
                    else {

                        // Asset doesn't have a name
                        if (!assets[i].name) {

                            // Throw error
                            throw new Error('Asset does not have a name', assets[i]);
                        }

                        // Asset has everything we need
                        else {

                            // Add asset to `assetsToLoad`
                            this.assetsToLoad.push(assets[i]);
                        }
                    }

                    break;
                }

                // Invalid type
                default: {

                            // Throw error
                    throw new Error('Asset is not a valid type');
                }
                }
            }

            // Asset doesn have a type
            else {

                // Throw error
                throw new Error('Asset does not have a type', assets[i]);
            }
        }
    }
};

// Method: loadAssets
AssetLoader.prototype.loadAssets = function (callback) {


    // Store reference to `this`
    const _this = this;

    // Make sure there are still assets to load
    if (this.assetsToLoad.length > 0) {

        // Set `assetsLoaded` to `false`
        this.assetsLoaded = false;

        // Load the asset
        this.loadAsset(this.assetsToLoad[0], () => {

            // Add the asset to `assets`
            _this.assets[_this.assetsToLoad[0].name] = _this.assetsToLoad[0];

            // Move to next asset
            _this.assetsToLoad.shift();

            // Start loading next asset
            _this.loadAssets(callback);
        });
    }

    // There are no more assets
    else {

        // Set `assetsLoaded` to `true`
        this.assetsLoaded = true;

        // Call `callback`
        callback();
    }
};

// Method: loadAsset
AssetLoader.prototype.loadAsset = function (asset, callback) {


    // Switch on `type`
    switch (asset.type) {

        // Image
    case 'image': {

        // Call `loadImage`
        this.loadImage(asset, callback);

        break;
    }

    case 'video': {

        // Call `loadVideo`
        this.loadVideo(asset, callback);

        break;
    }

    // Default
    default: {
        throw new Error('Asset has no type');
    }
    }
};

// Method: loadImage
AssetLoader.prototype.loadImage = function (asset, callback) {


    // Create new image
    const img = new Image();

    // On load of image
    img.addEventListener('load', () => {

        // Add element
        asset.element = this;

        // Call `callback`
        callback();
    });

    // On error of image
    img.addEventListener('error', (e) => {

        // Throw error
        throw new Error(e);
    });

    // Set `crossOrigin` to `anonymous`
    img.crossOrigin = 'anonymous';

    // Set `img.src`
    img.src = asset.path;
};

// Method: createVideo
AssetLoader.prototype.loadVideo = function (asset, callback) {

    // Create new video
    const video = document.createElement('video');

    // Create source
    const sourceEl = document.createElement('source');

    asset.element = video;
    asset.volume = typeof asset.volume === 'undefined' ? 1 : asset.volume;
    asset.loaded = 0;

    video.autoplay = typeof asset.autoplay === 'undefined' ? true : asset.autoplay;
    video.loop = typeof asset.loop === 'undefined' ? true : asset.loop;
    video.muted = typeof asset.muted === 'undefined' ? false : asset.muted;

    asset.play = function (currentTime) {
        if (typeof currentTime !== 'undefined') {
            video.currentTime = currentTime;
        }
        video.play();
        if (asset.onStart) {
            asset.onStart();
        }
    };

    asset.pause = function () {
        video.pause();
    };

    asset.resume = function () {
        video.play();
    };

    asset.stop = function () {
        video.pause();
        video.currentTime = 0;
    };

    video.addEventListener('canplaythrough', () => {
        if (!asset.ready) {
            asset.ready = true;
            return callback();
        }
    });

    video.addEventListener('loadeddata', () => {

        // First frame loaded
        asset.width = this.videoWidth;
        asset.height = this.videoHeight;
        asset.duration = this.duration;
    });

    video.addEventListener('ended', () => {
        if (asset.onEnd) {
            asset.onEnd();
        }
    });

    // On error of video
    video.addEventListener('error', (e) => {

        // Throw error
        throw new Error(e);
    });

    // Add type
    sourceEl.type = `video/${asset.path.match(/\.[0-9a-z]+$/i)[0].substring(1)}`;

    // Add source
    sourceEl.src = asset.path;

    // Append `sourceEl` to `video`
    video.appendChild(sourceEl);
};

// Export `AssetLoader`
module.exports = AssetLoader;
