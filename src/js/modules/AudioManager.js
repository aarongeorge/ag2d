/**
 * AudioManager
 *
 * @desc An audio manager
 */

// Dependencies
import {createAudioContext} from './Utils';
import EventHandler from './EventHandler';

// Constructor: AudioManager
const AudioManager = class {

    // Constructor
    constructor () {

        // Create `eventHandler`
        this.eventHandler = new EventHandler();

        // Function to create an audio context
        const createContext = () => {

            // Create new `audioContextPatch`
            this.context = createAudioContext();

            // Remove event handlers
            this.eventHandler.removeEvent('iOSTouchStartAudioContext');
            this.eventHandler.removeEvent('iOSTouchEndAudioContext');
        };

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

        // Create `context`
        this.context = createAudioContext();

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

    // Method: play
    play (name) {

        if (!this.audioClips[name].element) {
            this.audioClips[name].element = this.context.createBufferSource();
            this.audioClips[name].element.buffer = this.audioClips[name].buffer;
            this.audioClips[name].element.connect(this.context.destination);
        }

        this.audioClips[name].element.start(0);
    }

    // Method: stop
    stop (name) {

        if (this.audioClips[name].element) {
            this.audioClips[name].element.disconnect(this.context.destination);
            delete this.audioClips[name].element;
        }
    }
};

// Export `AudioManager`
export default AudioManager;
