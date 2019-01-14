/**
 * Utils
 */

// Create Audio Context
export const createAudioContext = (desiredSampleRate = 44100) => {

    // Deal with browser prefixes
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    // Create new audio context
    let audioContext = new AudioContext();

    // Regular expression that matches iOS devices
    const iOSRegex = new RegExp('iPhone|iPad|iPod', 'i');

    // Warm a `context`
    const warmContext = (context, sampleRate) => {

        // Create buffer and warmer source
        const buffer = context.createBuffer(1, 1, sampleRate);
        const warmer = context.createBufferSource();

        // Set `warmer.buffer` to `buffer`
        warmer.buffer = buffer;

        // Connect `warmer`
        warmer.connect(context.destination);

        // Play `warmer`
        if (warmer.start) {
            warmer.start(0);
        }

        else if (warmer.noteOn) {
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
export const cyclicArray = (arr, index) => {

    const item = ((index % arr.length) + arr.length) % arr.length;

    return {
        'index': item,
        'value': arr[item]
    };
};

// Get Supported Video Source
export const getSupportedVideoSource = (sources, callback) => {

    // Create `testVideo`
    const testVideo = document.createElement('video');

    // Supported video source
    let supportedVideoSource = void 0;

    // Array of video types in order of preference
    const supportedVideoTypes = [
        'video/ogg; codecs="theora"',
        'video/webm; codecs="vp8, vorbis"',
        'video/mp4; codecs="avc1.42E01E"'
    ];

    // Iterate over `supportedVideoTypes`
    for (let i = 0; i < supportedVideoTypes.length; i++) {

        // Store reference to `currentVideoType`
        const currentVideoType = supportedVideoTypes[i];

        // Browser can play `currentVideoType`
        if (testVideo.canPlayType(currentVideoType)) {

            // Check to see if `source.type` is `currentVideoType`
            const matchedSource = sources.find((source) => {
                return source.type === currentVideoType.match(/[^;]*/gi)[0];
            });

            // `matchedSource` exists
            if (matchedSource) {

                // Set `supportedVideoSource`
                supportedVideoSource = matchedSource;
                break;
            }
        }
    }

    // There is a supported video source
    if (supportedVideoSource) {

        // Return the supported source
        return callback(supportedVideoSource);
    }

    // There is no supported video source, Throw error
    throw new Error(`This browser does not support any of the sources provided in ${JSON.stringify(sources)}`);
};

// Get Video Blob
export const getVideoBlob = (url, callback, progressCallback) => {

    // Create `request`
    const request = new XMLHttpRequest();

    // Progress
    request.onprogress = (e) => {

        // Filesize can be determined
        if (e.lengthComputable) {

            // Call `progressCallback` and pass the progress
            return progressCallback(e.loaded);
        }
    };

    // Loaded
    request.onload = () => {

        // Create `blob`
        const blob = URL.createObjectURL(request.response);

        // Call `callback` and pass `blob`
        return callback(blob);
    };

    // Error
    request.onerror = (e) => {

        // Throw error
        throw new Error(e);
    };

    // Open `request`
    request.open('get', url, true);

    // Set `responseType` to `blob`
    request.responseType = 'blob';

    // Send `request`
    request.send();
};

// Get Supported Audio Source
export const getSupportedAudioSource = (sources, callback) => {

    // Create `testAudio`
    const testAudio = document.createElement('audio');

    // Variable to hold the supported audio type
    let supportedAudioSource = void 0;

    // Array of audio types in order of preference
    const supportedAudioTypes = [
        'audio/ogg; codecs="vorbis"',
        'audio/mpeg; codec="mp3"'
    ];

    // Iterate over `supportedAudioTypes`
    for (let i = 0; i < supportedAudioTypes.length; i++) {

        // Store reference to `currentAudioType`
        const currentAudioType = supportedAudioTypes[i];

        // Browser can play `currentAudioType`
        if (testAudio.canPlayType(currentAudioType)) {

            // Check to see if `source.type` is `currentAudioType`
            const matchedSource = sources.find((source) => {
                return source.type === currentAudioType.match(/[^;]*/gi)[0];
            });

            // `matchedSource` exists
            if (matchedSource) {

                // Set `supportedVideoSource`
                supportedAudioSource = matchedSource;
                break;
            }
            break;
        }
    }

    // There is a supported audio source
    if (supportedAudioSource) {

        // Return the supported source
        return callback(supportedAudioSource);
    }

    // There is no supported audio source. Throw error
    throw new Error(`This browser does not support any of the sources provided in ${JSON.stringify(sources)}`);
};

// Get Audio Array Buffer
export const getAudioArrayBuffer = (url, callback, progressCallback) => {

    // Sort out prefix
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // Create `audioContext`
    const audioContext = createAudioContext();

    // Close `audioContext`
    audioContext.close();

    // Create `request`
    const request = new XMLHttpRequest();

    // Open `request`
    request.open('GET', url, true);

    // Set `responseType` to `arraybuffer`
    request.responseType = 'arraybuffer';

    // Progress
    request.onprogress = (e) => {

        // Filesize can be determined
        if (e.lengthComputable) {

            // Call `progressCallback` and pass the progress
            return progressCallback(e.loaded);
        }
    };

    // Loaded
    request.onload = () => {

        // Decode buffer
        audioContext.decodeAudioData(request.response,

            // Decoded successfully
            (buffer) => {

                // Call `callback` and pass `buffer`
                callback(buffer);
            },

            // Error decoding
            (e) => {
                throw new Error(e);
            }
        );
    };

    // Error
    request.onerror = (e) => {
        throw new Error(e);
    };

    // Send `request`
    request.send();
};

// Get Filesize
export const getFilesize = (url, callback) => {

    // Create `request`
    const request = new XMLHttpRequest();

    // Open `request`
    request.open('HEAD', url, true);

    // State change
    request.onreadystatechange = () => {

        // Request is done
        if (request.readyState === 4) {

            // Call `callback` and return `filesize`
            return callback(parseInt(request.getResponseHeader('Content-Length'), 10));
        }
    };

    // Error
    request.onerror = (e) => {
        throw new Error(e);
    };

    // Send `request`
    request.send();
};

// No Op
export const noOp = () => {};
