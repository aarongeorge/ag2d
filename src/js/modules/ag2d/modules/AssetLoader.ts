/**
 * AssetLoader
 *
 * @desc An asset loader
 */

import {
	getAudioArrayBuffer,
	getFilesize,
	getSupportedAudioSource,
	getSupportedVideoSource,
	getVideoBlob,
	noOp
} from './Utils';

export default class AssetLoader {

	constructor () {
		this.assets = {};
		this.assetsToLoad = [];
		this.assetsLoaded = false;
		this.assetsWaitingForFilesize = 0;
		this.customAssetTypes = {};
		this.filesize = {
			'loaded': 0,
			'toLoad': 0
		};

		// Call `setUpHooks`
		this.setUpHooks();
	}

	setUpHooks () {
		this.hooks = {
			'bind': (name, func) => {
				this.hooks[name] = func;
			},
			'progress': noOp,
			'unbind': name => {
				delete this.hooks[name];
			}
		};
	}

	addAsset (asset) {

		// Asset has a type
		if (asset.type) {

			// Switch over `type`
			switch (asset.type) {

				// Audio
				case 'audio': {

					// Asset doesn't have sources
					if (!asset.sources) {

						// Throw error
						console.log(asset);
						throw new Error('Asset does not have sources.');
					}

					// Asset doesn't have a name
					if (!asset.name) {

						// Throw error
						console.log(asset);
						throw new Error('Asset does not have a name.');
					}

					// Call `getSupportedAudioSource`
					getSupportedAudioSource(asset.sources, supportedAudioSource => {

						// Increment `assetsWaitingForFilesize`
						this.assetsWaitingForFilesize += 1;

						// Call `getFilesize`
						getFilesize(supportedAudioSource.path, filesize => {

							// Decrement `assetsWaitingForFilesize`
							this.assetsWaitingForFilesize -= 1;

							// Set `filesize`
							supportedAudioSource.filesize = filesize;

							// Add `filesize` to `toLoad`
							this.filesize.toLoad += filesize;

							// Set source
							asset.source = supportedAudioSource;

							// Delete `sources`
							delete asset.sources;

							// Add asset to `assetsToLoad`
							this.assetsToLoad.push(asset);
						});
					});

					break;
				}

				// Video
				case 'video': {

					// Asset doesn't have sources
					if (!asset.sources) {

						// Throw error
						console.log(asset);
						throw new Error('Asset does not have sources.');
					}

					// Asset doesn't have a name
					if (!asset.name) {

						// Throw error
						console.log(asset);
						throw new Error('Asset does not have a name.');
					}

					// Call `getSupportedVideoSource`
					getSupportedVideoSource(asset.sources, supportedVideoSource => {

						// Increment `assetsWaitingForFilesize`
						this.assetsWaitingForFilesize += 1;

						// Call `getFilesize`
						getFilesize(supportedVideoSource.path, filesize => {

							// Decrement `assetsWaitingForFilesize`
							this.assetsWaitingForFilesize -= 1;

							// Set `filesize`
							supportedVideoSource.filesize = filesize;

							// Add `filesize` to `toLoad`
							this.filesize.toLoad += filesize;

							// Set source
							asset.source = supportedVideoSource;

							// Delete `sources`
							delete asset.sources;

							// Add asset to `assetsToLoad`
							this.assetsToLoad.push(asset);
						});
					});

					break;
				}

				// Image
				case 'image':

				// Font
				case 'font': {

					// Asset doesn't have a path
					if (!asset.path) {

						// Throw error
						console.log(asset);
						throw new Error('Asset does not have a path.');
					}

					// Asset doesn't have a name
					if (!asset.name) {

						// Throw error
						console.log(asset);
						throw new Error('Asset does not have a name.');
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
						console.log(asset);
						throw new Error('Asset is not a valid type.');
					}
				}
			}
		}

		// Asset doesn't have a type
		else {

			// Throw error
			console.log(asset);
			throw new Error('Asset does not have a type.');
		}
	}

	addAssets (assets) {

		// `assets` is not an array
		if (!Object.prototype.toString.call(assets) === '[object Array]') {

			// Throw error
			console.log(assets);
			throw new Error('`addAssets` must be passed an array.');
		}

		else {

			// Iterate over `assets`
			assets.forEach(asset => {

				// Call `addAsset`
				this.addAsset(asset);
			});
		}
	}

	addAssetType (assetType, validationFn, loadFn) {

		// `assetType` doesn't exist in `customAssetTypes`
		if (assetType in this.customAssetTypes === false) {

			this.customAssetTypes[assetType] = {};
			this.customAssetTypes[assetType].validationFn = validationFn;
			this.customAssetTypes[assetType].loadFn = loadFn;
		}

		// `assetType` does exist in `customAssetTypes`
		else {

			// Throw error
			throw new Error(`An asset type with the type of ${assetType} already exists.`);
		}
	}

	loadAssets (callback = noOp) {

		// We're still waiting for filesizes to be obtained
		if (this.assetsWaitingForFilesize > 0) {

			// Call `loadAssets` on next animation frame
			window.requestAnimationFrame(() => {

				// Call `loadAssets`
				this.loadAssets(callback);
			});

			// Return
			return;
		}

		// Make sure there are still assets to load
		if (this.assetsToLoad.length > 0) {

			// Set `assetsLoaded` to `false`
			this.assetsLoaded = false;

			const filesizeLoaded = this.filesize.loaded;

			// Load the asset
			this.loadAsset(this.assetsToLoad[0], asset => {

				// Add the asset to `assets`
				this.assets[asset.name] = asset;

				// Move to next asset
				this.assetsToLoad.shift();

				// Start loading next asset
				this.loadAssets(callback);
			},

			// Progress callback
			progress => {

				// Update `filesize.loaded`
				this.filesize.loaded = filesizeLoaded + progress;

				// Call `progress`
				this.hooks.progress(this.filesize.loaded / this.filesize.toLoad);
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

	loadAsset (asset, callback, progressCallback) {

		// Switch on `type`
		switch (asset.type) {

			// Audio
			case 'audio': {

				// Call `loadAudio`
				this.loadAudio(asset, callback, progressCallback);

				break;
			}

			// Image
			case 'image': {

				// Call `loadImage`
				this.loadImage(asset, callback, progressCallback);

				break;
			}

			// Video
			case 'video': {

				// Call `loadVideo`
				this.loadVideo(asset, callback, progressCallback);

				break;
			}

			// Font
			case 'font': {

				// Call `loadFont`
				this.loadFont(asset, callback, progressCallback);

				break;
			}

			// Type is not a default
			default: {

				// Type has been defined in `customAssetTypes`
				if (this.customAssetTypes[asset.type]) {

					// Call `loadFn`
					this.customAssetTypes[asset.type].loadFn(asset, callback, progressCallback);
				}

				// Type does not exist in `customAssetTypes`
				else {

					// Throw error
					console.log(asset);
					throw new Error('Asset has no type.');
				}
			}
		}
	}

	loadAudio (asset, callback, progressCallback) {

		// Call `getAudioArrayBuffer`
		getAudioArrayBuffer(asset.source.path, buffer => {

			// Set `buffer`
			asset.buffer = buffer;

			// Call `callback`
			callback(asset);

		}, progressCallback);
	}

	loadImage (asset, callback, progressCallback) {

		// Create new image
		const img = new Image();

		// On load of image
		img.addEventListener('load', () => {

			// Set `element`
			asset.element = img;

			// Call `callback`
			return callback(asset);
		});

		// On progress of image
		img.addEventListener('progress', e => {

			// Filesize can be determined
			if (e.lengthComputable) {

				// Call `progressCallback` and pass the progress
				return progressCallback(e.loaded);
			}
		});

		// On error of image
		img.addEventListener('error', e => {

			// Throw error
			throw new Error(e);
		});

		// Set `crossOrigin` to `anonymous`
		img.crossOrigin = 'anonymous';

		// Set `img.src`
		img.src = asset.path;
	}

	loadVideo (asset, callback, progressCallback) {

		// Create new video
		const video = document.createElement('video');

		// Set `element`
		asset.element = video;

		// On error of video
		video.addEventListener('error', e => {

			// Throw error
			throw new Error(e);
		});

		// Call `getVideoBlob`
		getVideoBlob(asset.source.path, blob => {

			// Create source element
			const sourceEl = document.createElement('source');

			// Set `type`
			sourceEl.type = asset.source.type;

			// Set `crossOrigin` to `anonymous`
			sourceEl.crossOrigin = 'anonymous';

			// Set `src`
			sourceEl.src = blob;

			// Append `sourceEl` to `video`
			video.appendChild(sourceEl);

			// Call `callback`
			return callback(asset);

		}, progressCallback);
	}

	loadFont (asset, callback) {

		// Load font and call `callback`
		document.fonts.load(`16px "${asset.name}"`).then(() =>

			// Call `callback`
			callback(asset));
	}
}
