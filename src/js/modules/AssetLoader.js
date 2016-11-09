/**
 * Asset loader
 *
 * @desc An asset loader
 */

// Constructor: AssetLoader
var AssetLoader = function () {
    'use strict';

    this.assets = {};
    this.assetsToLoad = [];
    this.assetsLoaded = false;
};

// Method: addAssets
AssetLoader.prototype.addAssets = function (assets) {
    'use strict';

    // `assets` is not an array
    if (Object.prototype.toString.call(assets) !== '[object Array]') {

        // Throw error
        throw new Error('`addAssets` must be passed an array');
    }

    // `assets` is an array
    else {

        // Iterate over `assets`
        for (var i = 0; i < assets.length; i++) {

            // Asset doesn't have a type
            if (!assets[i].type) {

                // Throw error
                throw new Error('Asset does not have a type', assets[i]);
            }

            // Asset does have a type
            else {

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

                    // Invalid type
                    default: {

                        // Throw error
                        throw new Error('Asset is not a valid type');
                    }
                }
            }
        }
    }
};

// Method: loadAssets
AssetLoader.prototype.loadAssets = function (callback) {
    'use strict';

    // Store reference to `this`
    var _this = this;

    // Make sure there are still assets to load
    if (this.assetsToLoad.length > 0) {

        // Set `assetsLoaded` to `false`
        this.assetsLoaded = false;

        // Load the asset
        this.loadAsset(this.assetsToLoad[0], function () {

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

        // Call `callback`
        callback();
    }
};

// Method: loadAsset
AssetLoader.prototype.loadAsset = function (asset, callback) {
    'use strict';

    // Switch on `type`
    switch (asset.type) {

        // Image
        case 'image': {

            // Call `loadImage`
            this.loadImage(asset, callback);

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
    'use strict';

    // Create new image
    var img = new Image();

    // On load of image
    img.addEventListener('load', function () {

        // Add element
        asset.element = this;

        // Call `callback`
        callback();
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
};

// Export `AssetLoader`
module.exports = AssetLoader;
