/**
 * AssetLoader
 *
 * @desc An asset loader
 */

// Depencencies
import {getAudioArrayBuffer, getVideoBlob, noOp} from './Utils';

// Class: AssetLoader
class AssetLoader {

    // Constructor
    constructor () {
        this.assets = {};
        this.assetsToLoad = [];
        this.assetsLoaded = false;
        this.customAssetTypes = {};
    }

    // Method: addAsset
    addAsset (asset) {

        // Asset has a type
        if (asset.type) {

            // Switch over `type`
            switch (asset.type) {

                // Audio
                case 'audio':

                // Video
                case 'video': {

                    // Asset doesn't have sources
                    if (!asset.sources) {

                        // Throw error
                        throw new Error(`Asset does not have sources ${asset}`);
                    }

                    // Asset doesn't have a name
                    if (!asset.name) {

                        // Throw error
                        throw new Error(`Asset does not have a name ${asset}`);
                    }

                    // Add asset to `assetsToLoad`
                    this.assetsToLoad.push(asset);

                    break;
                }

                // Image
                case 'image':

                // Font
                case 'font': {

                    // Asset doesn't have a path
                    if (!asset.path) {

                        // Throw error
                        throw new Error(`Asset does not have a path ${asset}`);
                    }

                    // Asset doesn't have a name
                    if (!asset.name) {

                        // Throw error
                        throw new Error(`Asset does not have a name ${asset}`);
                    }

                    // Add asset to `assetsToLoad`
                    this.assetsToLoad.push(asset);

                    break;
                }

                // Type is not a default
                default: {

                    // Type has been defined in `customAssetTypes`
                    if (this.customAssetTypes[asset.type]) {

                        // Asset passed validation
                        if (this.customAssetTypes[asset.type].validationFn(asset)) {

                            // Add `asset` to `assetsToLoad`
                            this.assetsToLoad.push(asset);
                        }
                    }

                    // Type does not exist in `customAssetTypes`
                    else {

                        // Throw error
                        throw new Error('Asset is not a valid type');
                    }
                }
            }
        }

        // Asset doesn't have a type
        else {

            // Throw error
            throw new Error('Asset does not have a type', asset);
        }
    }

    // Method: addAssets
    addAssets (assets) {

        // `assets` is not an array
        if (!Object.prototype.toString.call(assets) === '[object Array]') {

            // Throw error
            throw new Error('`addAssets` must be passed an array');
        }

        // `assets` is an array
        else {

            // Iterate over `assets`
            assets.forEach((asset) => {

                // Call `addAsset`
                this.addAsset(asset);
            });
        }
    }

    // Method: addAssetType
    addAssetType (type, validationFn, loadFn) {

        // `type` doesn't exist in `customAssetTypes`
        if (type in this.customAssetTypes === false) {

            this.customAssetTypes[type] = {};
            this.customAssetTypes[type].validationFn = validationFn;
            this.customAssetTypes[type].loadFn = loadFn;
        }

        // `type` does exist in `customAssetTypes`
        else {

            // Throw error
            throw new Error(`An asset type with the type of ${type} already exists`);
        }
    }

    // Method: loadAssets
    loadAssets (callback = noOp) {

        // Make sure there are still assets to load
        if (this.assetsToLoad.length > 0) {

            // Set `assetsLoaded` to `false`
            this.assetsLoaded = false;

            // Load the asset
            this.loadAsset(this.assetsToLoad[0], () => {

                // Add the asset to `assets`
                [this.assets[this.assetsToLoad[0].name]] = this.assetsToLoad;

                // Move to next asset
                this.assetsToLoad.shift();

                // Start loading next asset
                this.loadAssets(callback);
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
    loadAsset (asset, callback) {

        // Switch on `type`
        switch (asset.type) {

            // Audio
            case 'audio': {

                // Call `loadAudio`
                this.loadAudio(asset, callback);

                break;
            }

            // Image
            case 'image': {

                // Call `loadImage`
                this.loadImage(asset, callback);

                break;
            }

            // Video
            case 'video': {

                // Call `loadVideo`
                this.loadVideo(asset, callback);

                break;
            }

            // Font
            case 'font': {

                // Call `loadFont`
                this.loadFont(asset, callback);
            }

            // Type is not a default
            default: {

                // Type has been defined in `customAssetTypes`
                if (this.customAssetTypes[asset.type]) {

                    // Call `loadFn`
                    this.customAssetTypes[asset.type].loadFn(asset, callback);
                }

                // Type does not exist in `customAssetTypes`
                else {

                    // Throw error
                    throw new Error('Asset has no type');
                }
            }
        }
    }

    // Method: loadAudio
    loadAudio (asset, callback) {

        // Call `getAudioArrayBuffer`
        getAudioArrayBuffer(asset.sources, (buffer) => {

            // Set buffer
            asset.buffer = buffer;

            // Call `callback`
            callback();
        });
    }

    // Method: loadImage
    loadImage (asset, callback) {

        // Create new image
        const img = new Image();

        // On load of image
        img.addEventListener('load', () => {

            asset.loaded = true;

            // Add element
            asset.element = img;

            // Call `callback`
            return callback();
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
    }

    // Method: loadVideo
    loadVideo (asset, callback) {

        // Create new video
        const video = document.createElement('video');

        // Set `element`
        asset.element = video;

        // On error of video
        video.addEventListener('error', (e) => {

            // Throw error
            throw new Error(e);
        });

        // Call `getVideoBlob`
        getVideoBlob(asset.sources, (blob, supportedVideoType) => {

            // Create source element
            const sourceEl = document.createElement('source');

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

    // Method: loadFont
    loadFont (asset, callback) {

        // Load font and call `callback`
        document.fonts.load(`16px "${asset.name}"`).then(callback);
    }
}

// Export `AssetLoader`
export default AssetLoader;
