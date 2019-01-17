/**
 * AudioManager
 *
 * @desc An audio manager
 */

// Dependencies
import {
    createAudioContext,
    noOp
} from './Utils';
import EventHandler from './EventHandler';

// Class: AudioManager
class AudioManager {

    // Constructor
    constructor () {

        // Create `eventHandler`
        this.eventHandler = new EventHandler();

        // Object to hold audioClips
        this.audioClips = {};

        // Array to hold audioClip names
        this.audioClipNames = [];
    }

    // Method: add
    add (audioClip) {

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
            throw new Error(`An audioClip with the name \`${audioClip.name}\` already exists`);
        }
    }

    // Method: init
    init (cb = noOp) {

        // Function to create an audio context
        const createContext = () => {

            // Create `context`
            this.context = createAudioContext();

            // Create `streamDestination`
            this.streamDestination = this.context.createMediaStreamDestination();

            // Remove event handlers
            this.eventHandler.removeEvent('iOSTouchStartAudioContext');
            this.eventHandler.removeEvent('iOSTouchEndAudioContext');

            // Call `cb`
            return cb();
        };

        // Regular expression that matches iOS devices
        const iOSRegex = new RegExp('iPhone|iPad|iPod', 'i');

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
            this.context = createAudioContext();

            // Create `streamDestination`
            this.streamDestination = this.context.createMediaStreamDestination();

            // Call `cb`
            return cb();
        }
    }

    // Method: play
    play (name) {

        if (!this.audioClips[name].element) {
            this.audioClips[name].element = this.context.createBufferSource();
            this.audioClips[name].element.buffer = this.audioClips[name].buffer;
            this.audioClips[name].gainNode = this.context.createGain();
            this.audioClips[name].element.connect(this.audioClips[name].gainNode)
            this.audioClips[name].gainNode.connect(this.context.destination);
            this.audioClips[name].gainNode.connect(this.streamDestination);
        }

        this.audioClips[name].element.start(0);
    }

    // Method: remove
    remove (name) {

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
            throw new Error(`No audioClip with the name \`${name}\` exists`);
        }
    }

    // Method: resume
    resume () {

        // `context` exists
        if (this.context) {

            // Call `resume`
            this.context.resume();
        }
    }

    // Method: stop
    stop (name) {

        if (this.audioClips[name].gainNode) {
            this.audioClips[name].gainNode.disconnect(this.context.destination);
            this.audioClips[name].gainNode.disconnect(this.streamDestination);
            this.audioClips[name].element.disconnect(this.audioClips[name].gainNode);
            delete this.audioClips[name].gainNode;
            delete this.audioClips[name].element;
        }
    }

    // Method: fadeout over X milliseconds then stop the audio
    fadeOut (name, milli) {
        if (this.audioClips[name].element) {
            this.audioClips[name].gainNode.gain.linearRampToValueAtTime(0.01, this.context.currentTime + (milli / 1000));
            setTimeout(() => {
                    this.stop(name)
                }, milli);
        }
    }

    // Method: suspend
    suspend () {

        // `context` exists
        if (this.context) {

            // Call `suspend`
            this.context.suspend();
        }
    }
}

// Export `AudioManager`
export default AudioManager;
