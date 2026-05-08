/**
 * useCamera.js
 * Vue 3 composable
 * Default camera = FRONT camera on phone
 * switchCamera() toggles front/back
 */

import { ref, onUnmounted } from 'vue'

export const CAMERA_STATUS = {
  IDLE: 'idle',
  REQUESTING: 'requesting',
  ACTIVE: 'active',
  STOPPED: 'stopped',
  ERROR: 'error',
}

export function useCamera() {
  const videoRef = ref(null)
  const status = ref(CAMERA_STATUS.IDLE)
  const error = ref(null)

  let stream = null

  // FRONT camera by default
  let facingMode = 'user'

  function isSecureEnough() {
    const host = window.location.hostname

    return window.location.protocol === 'https:' || host === 'localhost' || host === '127.0.0.1'
  }

  function hasCameraSupport() {
    return !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function')
  }

  async function attachStream(mediaStream) {
    const video = videoRef.value

    if (!video) {
      throw new Error('Video element not found')
    }

    video.srcObject = mediaStream
    video.autoplay = true
    video.muted = true
    video.playsInline = true

    video.setAttribute('autoplay', '')
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')

    await new Promise((resolve) => {
      video.onloadedmetadata = () => resolve()
    })

    await video.play().catch(() => {})
  }

  function stopTracks() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      stream = null
    }

    if (videoRef.value) {
      videoRef.value.srcObject = null
    }
  }

  async function requestStream() {
    try {
      // Use selected camera first
      return await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      })
    } catch (err) {
      // fallback any camera
      return await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })
    }
  }

  async function startCamera() {
    if (status.value === CAMERA_STATUS.ACTIVE) {
      return true
    }

    status.value = CAMERA_STATUS.REQUESTING
    error.value = null

    try {
      if (!isSecureEnough()) {
        throw new Error('Camera requires HTTPS.')
      }

      if (!hasCameraSupport()) {
        throw new Error('Camera not supported.')
      }

      stream = await requestStream()

      await attachStream(stream)

      status.value = CAMERA_STATUS.ACTIVE
      return true
    } catch (err) {
      stopTracks()

      status.value = CAMERA_STATUS.ERROR
      error.value = err.message || 'Unable to start camera.'

      return false
    }
  }

  function stopCamera() {
    stopTracks()
    status.value = CAMERA_STATUS.STOPPED
  }

  async function switchCamera() {
    facingMode = facingMode === 'user' ? 'environment' : 'user'

    stopTracks()

    return await startCamera()
  }

  onUnmounted(() => {
    stopTracks()
  })

  return {
    videoRef,
    status,
    error,
    startCamera,
    stopCamera,
    switchCamera,
  }
}
