/**
 * Utils
 */

// Create Audio Context
const createAudioContext = (desiredSampleRate = 44100) => {

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
const cyclicArray = (arr, index) => {

    const item = (index % arr.length + arr.length) % arr.length;

    return {
        'index': item,
        'value': arr[item]
    };
};

// Get Video Blob
const getVideoBlob = (sources, callback) => {

    // Create `testVideo`
    const testVideo = document.createElement('video');

    // Variable to hold the supported video type
    let supportedVideoType = undefined;

    // Array of video types in order of preference
    const supportedVideoTypes = [
        'video/ogg; codecs="theora"',
        'video/webm; codecs="vp8, vorbis"',
        'video/mp4; codecs="avc1.42E01E"'
    ];

    // Iterate over `supportedVideoTypes`
    for (let i = 0; i < supportedVideoTypes.length; i++) {

        // Browser can play `supportedVideoTypes[i]`
        if (testVideo.canPlayType(supportedVideoTypes[i])) {

            // Get the source from `sources`
            [supportedVideoType] = sources.filter((videoSource) => {
                return videoSource.type === supportedVideoTypes[i].match(/[^;]*/gi)[0];
            });
            break;
        }
    }

    // Create `req`
    const req = new XMLHttpRequest();

    // On load
    req.onload = () => {
        const source = URL.createObjectURL(req.response);

        // Call `callback` and pass `source`
        return callback(source, supportedVideoType);
    };

    // On Error
    req.onerror = (e) => {

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
const getAudioArrayBuffer = (sources, callback) => {

    // Create `testAudio`
    const testAudio = document.createElement('audio');

    // Variable to hold the supported audio type
    let supportedAudioType = undefined;

    // Array of audio types in order of preference
    const supportedAudioTypes = [
        'audio/ogg; codecs="vorbis"',
        'audio/mpeg; codec="mp3"',
        'audio/mp4; codecs="mp4a.40.5"'
    ];

    // Iterate over `supportedAudioTypes`
    for (let i = 0; i < supportedAudioTypes.length; i++) {

        // Browser can play `supportedAudioTypes[i]`
        if (testAudio.canPlayType(supportedAudioTypes[i])) {

            // Get the source from `sources`
            [supportedAudioType] = sources.filter((audioSource) => {
                return audioSource.type === supportedAudioTypes[i].match(/[^;]*/gi)[0];
            });
            break;
        }
    }

    // Sort out prefix
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // Create `audioContext`
    const audioContext = new AudioContext();

    // Close `audioContext`
    audioContext.close();

    // Create `request`
    const request = new XMLHttpRequest();

    // Open `request`
    request.open('GET', supportedAudioType.path, true);

    // Set `responseType` to `arraybuffer`
    request.responseType = 'arraybuffer';

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

// No Op
const noOp = () => {};

// Export Utilities
export {createAudioContext, cyclicArray, getAudioArrayBuffer, getVideoBlob, noOp};
