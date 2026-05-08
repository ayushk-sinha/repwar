/**
 * usePoseDetection.js  – Anti-Cheat Edition
 * ─────────────────────────────────────────────────────────────────────────────
 * Changes from the base version:
 *  • Skeleton color-coding: arms turn red when no lockout / insufficient depth;
 *    the hip–knee segment turns red on body sag or pike.
 *  • Plank guide bar – a horizontal reference line appears until plank is detected.
 *  • Phase timer arc – a thin arc around the elbow joint shows how long the
 *    current phase has been held (helps pace awareness).
 *  • All anti-cheat fields from pushupLogic are forwarded in poseResult.
 *
 * ⚠ CDN NOTE: TF.js and pose-detection are loaded via <script> tags in
 *   index.html (window.tf / window.poseDetection).  Do NOT npm-import them.
 */

import { ref, readonly, onUnmounted } from 'vue'
import {
  createPushupCounter,
  KP,
  MIN_CONFIDENCE,
  STATE,
  VIOLATION,
  checkPlank,
  computeElbowAngles,
  checkHorizontalBody,
} from '@/utils/pushupLogic'

// ─── CDN global accessor ──────────────────────────────────────────────────────
function getCDNGlobals() {
  const tf = window.tf
  const poseDetection = window.poseDetection
  if (!tf)
    throw new Error(
      '[usePoseDetection] window.tf is undefined. Add TF.js CDN <script> tags to index.html.',
    )
  if (!poseDetection)
    throw new Error(
      '[usePoseDetection] window.poseDetection is undefined. Add pose-detection CDN <script> tag to index.html.',
    )
  return { tf, poseDetection }
}

// ─── Model singleton ──────────────────────────────────────────────────────────
let _detector = null
let _loadPromise = null

async function loadDetector(variant = 'lightning') {
  if (_detector) return _detector
  if (_loadPromise) return _loadPromise

  _loadPromise = (async () => {
    const { tf, poseDetection } = getCDNGlobals()
    try {
      await tf.setBackend('webgl')
      await tf.ready()
    } catch {
      await tf.setBackend('wasm')
      await tf.ready()
    }
    const modelType =
      variant === 'thunder'
        ? poseDetection.movenet.modelType.SINGLEPOSE_THUNDER
        : poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
    _detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
      modelType,
    })
    _loadPromise = null
    return _detector
  })()
  return _loadPromise
}

// ─── Skeleton definition ──────────────────────────────────────────────────────
const SKELETON_PAIRS = [
  [KP.LEFT_SHOULDER, KP.RIGHT_SHOULDER],
  [KP.LEFT_SHOULDER, KP.LEFT_ELBOW],
  [KP.LEFT_ELBOW, KP.LEFT_WRIST],
  [KP.RIGHT_SHOULDER, KP.RIGHT_ELBOW],
  [KP.RIGHT_ELBOW, KP.RIGHT_WRIST],
  [KP.LEFT_SHOULDER, KP.LEFT_HIP],
  [KP.RIGHT_SHOULDER, KP.RIGHT_HIP],
  [KP.LEFT_HIP, KP.RIGHT_HIP],
  [KP.LEFT_HIP, KP.LEFT_KNEE],
  [KP.RIGHT_HIP, KP.RIGHT_KNEE],
]

const ARM_KPS = new Set([
  KP.LEFT_SHOULDER,
  KP.RIGHT_SHOULDER,
  KP.LEFT_ELBOW,
  KP.RIGHT_ELBOW,
  KP.LEFT_WRIST,
  KP.RIGHT_WRIST,
])
const CORE_KPS = new Set([KP.LEFT_HIP, KP.RIGHT_HIP, KP.LEFT_KNEE, KP.RIGHT_KNEE])

// ─── Drawing ──────────────────────────────────────────────────────────────────

/**
 * Determine colors per segment based on current violations.
 * @param {string[]} violations
 * @param {{ angle, violation }} bodyCheck
 * @returns {{ armColor, coreColor, jointColor }}
 */
function segmentColors(violations, hasLockout) {
  const vSet = new Set(violations)

  const armBad =
    vSet.has(VIOLATION.NO_LOCKOUT) ||
    vSet.has(VIOLATION.INSUFFICIENT_DEPTH) ||
    vSet.has(VIOLATION.SHOULDER_HIGH) ||
    vSet.has(VIOLATION.TOO_FAST)

  const coreBad = vSet.has(VIOLATION.BODY_SAG) || vSet.has(VIOLATION.BODY_PIKE)

  return {
    armBone: armBad ? 'rgba(239,68,68,0.85)' : 'rgba(110,231,183,0.7)',
    armJoint: armBad ? '#ef4444' : '#6ee7b7',
    coreBone: coreBad ? 'rgba(251,191,36,0.85)' : 'rgba(148,163,184,0.5)',
    coreJoint: coreBad ? '#fbbf24' : 'rgba(148,163,184,0.7)',
  }
}

/**
 * Draw the skeleton with color-coded segments.
 */
function drawSkeleton(ctx, keypoints, scaleX, scaleY, violations) {
  const colors = segmentColors(violations)

  for (const [a, b] of SKELETON_PAIRS) {
    const kpA = keypoints[a],
      kpB = keypoints[b]
    if (!kpA || !kpB || kpA.score < MIN_CONFIDENCE || kpB.score < MIN_CONFIDENCE) continue

    const isArm = ARM_KPS.has(a) && ARM_KPS.has(b)
    const isCore = CORE_KPS.has(a) || CORE_KPS.has(b)

    ctx.beginPath()
    ctx.moveTo(kpA.x * scaleX, kpA.y * scaleY)
    ctx.lineTo(kpB.x * scaleX, kpB.y * scaleY)
    ctx.strokeStyle = isArm ? colors.armBone : isCore ? colors.coreBone : 'rgba(148,163,184,0.4)'
    ctx.lineWidth = isArm ? 4 : 2.5
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  for (let i = 0; i < keypoints.length; i++) {
    const kp = keypoints[i]
    if (!kp || kp.score < MIN_CONFIDENCE) continue
    const isArm = ARM_KPS.has(i)
    const isCore = CORE_KPS.has(i)
    const r = isArm ? 6 : 4
    const cx = kp.x * scaleX
    const cy = kp.y * scaleY

    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    ctx.fillStyle = isArm ? colors.armJoint : isCore ? colors.coreJoint : 'rgba(148,163,184,0.6)'
    ctx.fill()
  }
}

/**
 * Draw elbow angle label near the more-visible elbow.
 */
function drawAngleLabel(ctx, angle, keypoints, scaleX, scaleY) {
  if (angle === null) return
  const lE = keypoints[KP.LEFT_ELBOW]
  const rE = keypoints[KP.RIGHT_ELBOW]
  const kp = (lE?.score ?? 0) >= (rE?.score ?? 0) ? lE : rE
  if (!kp || kp.score < MIN_CONFIDENCE) return
  const x = kp.x * scaleX + 14
  const y = kp.y * scaleY - 10
  ctx.font = 'bold 13px monospace'
  ctx.fillStyle = '#fbbf24'
  ctx.shadowColor = 'rgba(0,0,0,0.8)'
  ctx.shadowBlur = 4
  ctx.fillText(`${angle}°`, x, y)
  ctx.shadowBlur = 0
}

/**
 * Draw body angle label near the hip.
 */
function drawBodyAngleLabel(ctx, bodyAngle, keypoints, scaleX, scaleY) {
  if (bodyAngle === null) return
  const lH = keypoints[KP.LEFT_HIP]
  const rH = keypoints[KP.RIGHT_HIP]
  const kp = (lH?.score ?? 0) >= (rH?.score ?? 0) ? lH : rH
  if (!kp || kp.score < MIN_CONFIDENCE) return
  const x = kp.x * scaleX + 14
  const y = kp.y * scaleY + 18
  ctx.font = '12px monospace'
  ctx.fillStyle = bodyAngle <= 32 ? 'rgba(110,231,183,0.8)' : '#ef4444'
  ctx.shadowColor = 'rgba(0,0,0,0.8)'
  ctx.shadowBlur = 3
  ctx.fillText(`body ${bodyAngle}°`, x, y)
  ctx.shadowBlur = 0
}

/**
 * Draw a horizontal plank-guide line when not yet in plank.
 * Helps users understand they need to be horizontal.
 */
function drawPlankGuide(ctx, cw, ch, inPlank) {
  if (inPlank) return
  const midY = ch * 0.5
  ctx.save()
  ctx.setLineDash([8, 6])
  ctx.strokeStyle = 'rgba(251,191,36,0.45)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, midY)
  ctx.lineTo(cw, midY)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.font = '11px sans-serif'
  ctx.fillStyle = 'rgba(251,191,36,0.6)'
  ctx.fillText('↔  Get parallel to floor', cw * 0.02, midY - 6)
  ctx.restore()
}

/**
 * Draw the current state label in the top-left corner.
 */
function drawStateLabel(ctx, state, cw) {
  const labels = {
    [STATE.IDLE]: { text: 'GET INTO PLANK', color: 'rgba(251,191,36,0.9)' },
    [STATE.READY]: { text: 'READY — GO DOWN', color: 'rgba(110,231,183,0.9)' },
    [STATE.DOWN]: { text: 'PUSH UP!', color: 'rgba(239,68,68,0.9)' },
  }
  const l = labels[state]
  if (!l) return
  ctx.font = 'bold 12px sans-serif'
  ctx.fillStyle = l.color
  ctx.shadowColor = 'rgba(0,0,0,0.9)'
  ctx.shadowBlur = 6
  ctx.fillText(l.text, 12, 22)
  ctx.shadowBlur = 0
}

// ─── Composable ───────────────────────────────────────────────────────────────
export function usePoseDetection(videoRef, { variant = 'lightning' } = {}) {
  const canvasRef = ref(null)
  const isModelLoaded = ref(false)
  const isDetecting = ref(false)
  const modelError = ref(null)

  const poseResult = ref({
    count: 0,
    invalidCount: 0,
    state: STATE.IDLE,
    angle: null,
    leftAngle: null,
    rightAngle: null,
    bodyAngle: null,
    confidence: 'low',
    liveViolations: [],
    lastRepValid: true,
    lastRepViolations: [],
    lastRepFormScore: 100,
  })

  let rafId = null
  let counter = createPushupCounter()

  // ── Inference loop ──────────────────────────────────────────────────────────
  async function inferenceLoop(detector) {
    const video = videoRef.value
    const canvas = canvasRef.value
    if (!video || !canvas || !isDetecting.value) return
    if (video.readyState < 2) {
      rafId = requestAnimationFrame(() => inferenceLoop(detector))
      return
    }

    const ctx = canvas.getContext('2d')
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    }

    const scaleX = canvas.width / video.videoWidth
    const scaleY = canvas.height / video.videoHeight

    try {
      const poses = await detector.estimatePoses(video, { flipHorizontal: false })
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (poses.length > 0) {
        const { keypoints } = poses[0]
        const cheatWarnings = []
        const posture = checkHorizontalBody(keypoints)

        const elbowAngles = computeElbowAngles(keypoints)

        const avgElbow = ((elbowAngles.left || 0) + (elbowAngles.right || 0)) / 2

        if (!posture.valid) {
          cheatWarnings.push('Fix posture')
        }

        if (avgElbow > 120 && poseResult.value.state === 'DOWN') {
          cheatWarnings.push('Go lower')
        }
        if (elbowAngles.left && elbowAngles.right) {
          const diff = Math.abs(elbowAngles.left - elbowAngles.right)

          if (diff > 35) {
            cheatWarnings.push('Uneven arm movement')
          }
        }
        if (poseResult.value.state === 'DOWN' && avgElbow > 150) {
          cheatWarnings.push('Slow down')
        }

        const result = counter.update(keypoints)
        poseResult.value = result

        const { inPlank } = checkPlank(keypoints)

        drawPlankGuide(ctx, canvas.width, canvas.height, inPlank)
        drawSkeleton(ctx, keypoints, scaleX, scaleY, result.liveViolations)
        drawAngleLabel(ctx, result.angle, keypoints, scaleX, scaleY)
        drawBodyAngleLabel(ctx, result.bodyAngle, keypoints, scaleX, scaleY)
        drawStateLabel(ctx, result.state, canvas.width)
        if (result.postureMessage) {
          ctx.font = 'bold 18px sans-serif'
          ctx.fillStyle = '#ef4444'
          ctx.fillText(result.postureMessage, 20, 50)
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawPlankGuide(ctx, canvas.width, canvas.height, false)
      }
    } catch (err) {
      console.error('[usePoseDetection] inference error:', err)
    }

    rafId = requestAnimationFrame(() => inferenceLoop(detector))
  }

  // ── Public API ──────────────────────────────────────────────────────────────
  async function startDetection() {
    if (isDetecting.value) return
    modelError.value = null
    try {
      const detector = await loadDetector(variant)
      isModelLoaded.value = true
      isDetecting.value = true
      inferenceLoop(detector)
    } catch (err) {
      modelError.value = `Failed to load pose model: ${err.message}`
    }
  }

  function stopDetection() {
    isDetecting.value = false
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    const canvas = canvasRef.value
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  }

  function resetCounter() {
    counter.reset()
    poseResult.value = {
      count: 0,
      invalidCount: 0,
      state: STATE.IDLE,
      angle: null,
      leftAngle: null,
      rightAngle: null,
      bodyAngle: null,
      postureMessage: null,
      confidence: 'low',
      liveViolations: [],
      lastRepValid: true,
      lastRepViolations: [],
      lastRepFormScore: 100,
    }
  }

  onUnmounted(stopDetection)

  return {
    canvasRef,
    isModelLoaded: readonly(isModelLoaded),
    isDetecting: readonly(isDetecting),
    modelError: readonly(modelError),
    poseResult: readonly(poseResult),
    startDetection,
    stopDetection,
    resetCounter,
  }
}
