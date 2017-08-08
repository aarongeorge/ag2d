/**
 * AssetLoader
 *
 * @desc An asset loader
 */

// Depencencies
import {getAudioArrayBuffer, getVideoBlob, noOp} from './Utils';

// Class: AssetLoader
const AssetLoader = class {

    // Constructor
    constructor () {
        this.assets = {};
        this.assetsToLoad = [];
        this.assetsLoaded = false;
    }

    // Method: addAssets
    addAssets (assets) {

        // `assets` is not an array
        if (Object.prototype.toString.call(assets) !== '[object Array]') {

            // Throw error
            throw new Error('`addAssets` must be passed an array');
        }

        // `assets` is an array
        else {

            // Iterate over `assets`
            assets.forEach((asset) => {

                // Asset has a type
                if (asset.type) {

                    // Switch over `type`
                    switch (asset.type) {

                        // Audio
                        case 'audio': {

                            // Asset doesn't have a path
                            if (!asset.path) {

                                // Throw error
                                throw new Error(`Asset does not have a path ${asset}`);
                            }

                            // Asset doesn't have a name
                            else if (!asset.name) {

                                // Throw error
                                throw new Error(`Asset does not have a name ${asset}`);
                            }

                            // Asset has everything we need
                            else {

                                // Add asset to `assetsToLoad`
                                this.assetsToLoad.push(asset);
                            }

                            break;
                        }

                        // Image
                        case 'image': {

                            // Asset doesn't have a path
                            if (!asset.path) {

                                // Throw error
                                throw new Error(`Asset does not have a path ${asset}`);
                            }

                            // Asset doesn't have a name
                            else if (!asset.name) {

                                // Throw error
                                throw new Error(`Asset does not have a name ${asset}`);
                            }

                            // Asset has everything we need
                            else {

                                // Add asset to `assetsToLoad`
                                this.assetsToLoad.push(asset);
                            }

                            break;
                        }

                        // Video
                        case 'video': {

                            // Asset doesn't have sources
                            if (!asset.sources) {

                                // Throw error
                                throw new Error(`Asset does not have sources ${asset}`);
                            }

                            // Asset doesn't have a name
                            else if (!asset.name) {

                                // Throw error
                                throw new Error(`Asset does not have a name ${assets}`);
                            }

                            // Asset has everything we need
                            else {

                                // Add asset to `assetsToLoad`
                                this.assetsToLoad.push(asset);
                            }

                            break;
                        }

                        // Subtitle
                        case 'subtitle': {

                            // Asset doesn't have a path
                            if (!asset.path) {

                                // Throw error
                                throw new Error(`Asset does not have a path ${asset}`);
                            }

                            // Asset doesn't have a name
                            else if (!asset.name) {

                                // Throw error
                                throw new Error(`Asset does not have a name ${assets}`);
                            }

                            // Asset has everything we need
                            else {

                                // Add asset to `assetsToLoad`
                                this.assetsToLoad.push(asset);
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
                    throw new Error('Asset does not have a type', asset);
                }
            });
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

            case 'video': {

                // Call `loadVideo`
                this.loadVideo(asset, callback);

                break;
            }

            case 'subtitle': {

                // Call `loadSubtitle`
                this.loadSubtitle(asset, callback);

                break;
            }

            // Default
            default: {
                throw new Error('Asset has no type');
            }
        }
    }

    // Method: loadAudio
    loadAudio (asset, callback) {

        // Call `getAudioArrayBuffer`
        getAudioArrayBuffer(asset.path, (buffer) => {

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

    // Method: loadSubtitle
    loadSubtitle (asset, callback) {

        // Promise for XHR to get the subtitles
        const subPromise = new Promise((resolve, reject) => {

            // Initialize XHR
            const xhr = new XMLHttpRequest();

            // Get request for the subtitle
            xhr.open('GET', asset.path);

            // Process string received into JSON
            xhr.onload = () => {
                resolve(xhr.responseText);
            };

            // Uh oh
            xhr.onerror = () => {
                reject(xhr.statusText);
            };

            xhr.send();
        });

        // Once resolved
        subPromise.then((jsonfile) => {

            // Put loaded JSON into the asset
            asset.content = jsonfile;
            asset.loaded = true;
            return callback();

        }).catch((reason) => {
            throw new Error(`Request for asset ${asset.name} failed, server returned code ${reason}`);
        });
    }
};

// Export `AssetLoader`
export default AssetLoader;
