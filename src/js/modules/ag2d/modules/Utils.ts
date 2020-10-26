/**
 * Utils
 */

// Create Audio Context
export const createAudioContext = (desiredSampleRate = 44100) => {
	const AudioContext = window.AudioContext || window.webkitAudioContext || false
	if (!AudioContext) throw new Error('Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox')

	const iOSRegex = new RegExp('iPhone|iPad|iPod', 'i')
	const warmContext = (context: AudioContext, sampleRate: number) => {
		const buffer = context.createBuffer(1, 1, sampleRate)
		const warmer = context.createBufferSource()
		warmer.buffer = buffer
		warmer.connect(context.destination)
		warmer.start(0)
		warmer.disconnect()
	}
	let audioContext = new AudioContext()
	/**
	 * There is a bug with iOS 6+ where you will get an incorrect sample rate
	 * which causes distortion. The below checks for that and fixes it for you
	 * by creating an audio context, destroying it, then creating a new one
	 */
	if (iOSRegex.test(navigator.userAgent) && !window.MSStream) {
		warmContext(audioContext, desiredSampleRate)
		if (audioContext.sampleRate !== desiredSampleRate) {
			audioContext.close()
			audioContext = new AudioContext()
			warmContext(audioContext, desiredSampleRate)
		}
	}
	return audioContext
}

// Cyclic Array
export const cyclicArray = (arr: any[], i: number) => {
	const index = ((i % arr.length) + arr.length) % arr.length
	return { index, value: arr[index] }
}

// Get Supported Video Source
export const getSupportedVideoSource = (sources, callback: () => {}) => {
	let supportedVideoSource = void 0
	const testVideo = document.createElement('video')
	const supportedVideoTypes = [
		'video/ogg; codecs="theora"',
		'video/webm; codecs="vp8, vorbis"',
		'video/mp4; codecs="avc1.42E01E"'
	]
	for (let i = 0; i < supportedVideoTypes.length; i++) {
		const currentVideoType = supportedVideoTypes[i]
		if (testVideo.canPlayType(currentVideoType)) {
			const matchedSource = sources.find(source => source.type === currentVideoType.match(/[^;]*/gi)[0])
			if (matchedSource) {
				supportedVideoSource = matchedSource
				break
			}
		}
	}
	if (supportedVideoSource) { return callback(supportedVideoSource) }
	throw new Error(`This browser does not support any of the sources provided in ${JSON.stringify(sources)}`)
}

// Get Video Blob
export const getVideoBlob = (url, callback, progressCallback) => {
	const request = new XMLHttpRequest()
	request.onprogress = e => e.lengthComputable && progressCallback(e.loaded)
	request.onload = () => callback(URL.createObjectURL(request.response))
	request.onerror = e => { throw new Error(e) }
	request.open('get', url, true)
	request.responseType = 'blob'
	request.send()
}

// Get Supported Audio Source
export const getSupportedAudioSource = (sources, callback) => {
	let supportedAudioSource = void 0
	const testAudio = document.createElement('audio')
	const supportedAudioTypes = [
		'audio/ogg; codecs="vorbis"',
		'audio/mpeg; codec="mp3"'
	]
	for (let i = 0; i < supportedAudioTypes.length; i++) {
		const currentAudioType = supportedAudioTypes[i]
		if (testAudio.canPlayType(currentAudioType)) {
			const matchedSource = sources.find(source => source.type === currentAudioType.match(/[^;]*/gi)[0])
			if (matchedSource) {
				supportedAudioSource = matchedSource
				break
			}
			break
		}
	}
	if (supportedAudioSource) return callback(supportedAudioSource)
	throw new Error(`This browser does not support any of the sources provided in ${JSON.stringify(sources)}`)
}

// Get Audio Array Buffer
export const getAudioArrayBuffer = (url, callback, progressCallback) => {
	window.AudioContext = window.AudioContext || window.webkitAudioContext
	const audioContext = createAudioContext()
	audioContext.close()
	const request = new XMLHttpRequest()
	request.open('GET', url, true)
	request.responseType = 'arraybuffer'
	request.onprogress = e => e.lengthComputable && progressCallback(e.loaded)
	request.onload = () => {
		audioContext.decodeAudioData(
			request.response,
			buffer => { callback(buffer) },
			e => { throw new Error(e) }
		)
	}
	request.onerror = e => { throw new Error(e) }
	request.send()
}

// Get Filesize
export const getFilesize = (url, callback) => {
	const request = new XMLHttpRequest()
	request.open('HEAD', url, true)
	request.onreadystatechange = () => request.readyState === 4 && callback(parseInt(request.getResponseHeader('Content-Length'), 10))
	request.onerror = e => { throw new Error(e) }
	request.send()
}

// No Op
export const noOp = () => {}

// Get context
export const getContext = (canvas: HTMLCanvasElement) => {
	const context = canvas.getContext('2d')
	if (!context) throw new Error(`Couldn't create a context for ${canvas}`)
	return context
}
