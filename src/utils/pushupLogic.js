/**
 * pushupLogic.js
 * ---------------------------------------------------------
 * Relaxed + Stable Push-up Counter
 *
 * Goals:
 * - Smooth counting
 * - UI compatible
 * - Less strict
 * - Minimal false negatives
 * - Works better with MoveNet jitter
 */

export const CONFIG = {
  LOCKOUT_ANGLE: 145,
  DOWN_ANGLE: 115,

  MIN_PHASE_MS: 180,

  MIN_CONFIDENCE: 0.22,

  SMOOTH_N: 6,
}

export const STATE = {
  IDLE: 'IDLE',
  READY: 'READY',
  DOWN: 'DOWN',
}

export const VIOLATION = {
  TOO_FAST: 'TOO_FAST',
}

export const VIOLATION_MSG = {
  TOO_FAST: 'Slow down slightly',
}

export const VIOLATION_SEVERITY = {
  TOO_FAST: 'warning',
}

export const KP = {
  LEFT_SHOULDER: 5,
  RIGHT_SHOULDER: 6,

  LEFT_ELBOW: 7,
  RIGHT_ELBOW: 8,

  LEFT_WRIST: 9,
  RIGHT_WRIST: 10,

  LEFT_HIP: 11,
  RIGHT_HIP: 12,

  LEFT_KNEE: 13,
  RIGHT_KNEE: 14,
}

export const MIN_CONFIDENCE = CONFIG.MIN_CONFIDENCE

/* ------------------------------------------------ */
/* Geometry */
/* ------------------------------------------------ */

export function angleBetween(a, b, c) {
  const abX = a.x - b.x
  const abY = a.y - b.y

  const cbX = c.x - b.x
  const cbY = c.y - b.y

  const dot = abX * cbX + abY * cbY

  const mag = Math.hypot(abX, abY) * Math.hypot(cbX, cbY)

  if (mag === 0) return 0

  return (Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180) / Math.PI
}

export function getKeypoint(keypoints, idx) {
  const kp = keypoints[idx]

  if (!kp) return null

  if (kp.score < CONFIG.MIN_CONFIDENCE) {
    return null
  }

  return {
    x: kp.x,
    y: kp.y,
    score: kp.score,
  }
}
/* ------------------------------------------------ */
/* Horizontal Body Check */
/* ------------------------------------------------ */

/**
 * Computes body tilt angle relative to horizontal floor.
 *
 * 0°  = perfectly horizontal plank
 * 90° = standing upright
 */

export function computeBodyAngleFromHorizontal(keypoints) {
  const lS = getKeypoint(keypoints, KP.LEFT_SHOULDER)
  const rS = getKeypoint(keypoints, KP.RIGHT_SHOULDER)

  const lH = getKeypoint(keypoints, KP.LEFT_HIP)
  const rH = getKeypoint(keypoints, KP.RIGHT_HIP)

  if (!(lS && rS && lH && rH)) {
    return null
  }

  // midpoint shoulder
  const shoulder = {
    x: (lS.x + rS.x) / 2,
    y: (lS.y + rS.y) / 2,
  }

  // midpoint hip
  const hip = {
    x: (lH.x + rH.x) / 2,
    y: (lH.y + rH.y) / 2,
  }

  const dx = hip.x - shoulder.x
  const dy = hip.y - shoulder.y

  const angleRad = Math.atan2(Math.abs(dy), Math.abs(dx))

  const angleDeg = (angleRad * 180) / Math.PI

  return angleDeg
}

/* ------------------------------------------------ */
/* Strict Horizontal Validation */
/* ------------------------------------------------ */

export function checkHorizontalBody(keypoints) {
  const angle = computeBodyAngleFromHorizontal(keypoints)

  if (angle === null) {
    return {
      valid: false,
      angle: null,
      message: 'Body not detected',
    }
  }

  /**
   * 0°   = perfect plank
   * 90°  = standing
   *
   * Allow slight incline during pushups
   */

  const MAX_HORIZONTAL_ANGLE = 32

  const valid = angle <= MAX_HORIZONTAL_ANGLE

  return {
    valid,
    angle: Math.round(angle),

    message: valid ? null : 'Fix posture',
  }
}
/* ------------------------------------------------ */
/* Elbow Angles */
/* ------------------------------------------------ */

export function computeElbowAngles(keypoints) {
  const lS = getKeypoint(keypoints, KP.LEFT_SHOULDER)

  const lE = getKeypoint(keypoints, KP.LEFT_ELBOW)

  const lW = getKeypoint(keypoints, KP.LEFT_WRIST)

  const rS = getKeypoint(keypoints, KP.RIGHT_SHOULDER)

  const rE = getKeypoint(keypoints, KP.RIGHT_ELBOW)

  const rW = getKeypoint(keypoints, KP.RIGHT_WRIST)

  return {
    left: lS && lE && lW ? angleBetween(lS, lE, lW) : null,

    right: rS && rE && rW ? angleBetween(rS, rE, rW) : null,
  }
}

export function averageAngle({ left, right }) {
  if (left !== null && right !== null) {
    return (left + right) / 2
  }

  return left ?? right ?? null
}

/* ------------------------------------------------ */
/* Compatibility Helpers */
/* ------------------------------------------------ */

export function checkPlank() {
  return {
    inPlank: true,
    slope: 0,
  }
}

export function checkBodyStraight() {
  return {
    angle: 170,
    violation: null,
  }
}

/* ------------------------------------------------ */
/* Push-up Counter */
/* ------------------------------------------------ */

export function createPushupCounter() {
  let count = 0

  let invalidCount = 0

  let state = STATE.READY

  let lastRepValid = true

  let lastRepViolations = []

  let lastRepFormScore = 100

  let stateEntryTime = performance.now()

  const smoothBuffer = []

  function smooth(v) {
    smoothBuffer.push(v)

    if (smoothBuffer.length > CONFIG.SMOOTH_N) {
      smoothBuffer.shift()
    }

    return smoothBuffer.reduce((a, b) => a + b, 0) / smoothBuffer.length
  }

  function enterState(newState) {
    state = newState
    stateEntryTime = performance.now()
  }

  function msInState() {
    return performance.now() - stateEntryTime
  }

  function update(keypoints) {
    const rawAngles = computeElbowAngles(keypoints)

    const rawElbow = averageAngle(rawAngles)
    const posture = checkHorizontalBody(keypoints)

    if (rawElbow === null) {
      return buildResult(rawAngles, null, 'low')
    }

    const elbow = smooth(rawElbow)

    let liveViolations = []

    if (!posture.valid) {
      return {
        ...buildResult(rawAngles, null, 'high'),
        postureMessage: 'Fix posture',
        bodyAngle: posture.angle,
      }
    }

    /* -------------------------------- */
    /* READY → DOWN */
    /* -------------------------------- */

    if (state === STATE.READY && elbow <= CONFIG.DOWN_ANGLE) {
      if (msInState() >= CONFIG.MIN_PHASE_MS) {
        enterState(STATE.DOWN)
      }
    } else if (state === STATE.DOWN && elbow >= CONFIG.LOCKOUT_ANGLE) {
      /* -------------------------------- */
      /* DOWN → READY = COUNT REP */
      /* -------------------------------- */
      if (msInState() >= CONFIG.MIN_PHASE_MS) {
        count++

        lastRepValid = true
        lastRepViolations = []
        lastRepFormScore = 100

        enterState(STATE.READY)
      } else {
        liveViolations.push(VIOLATION.TOO_FAST)
      }
    }

    return buildResult(rawAngles, elbow, 'high', liveViolations)
  }

  function buildResult(rawAngles, elbow, confidence, liveViolations = []) {
    return {
      count,

      invalidCount,

      state,

      angle: elbow !== null ? Math.round(elbow) : null,

      leftAngle: rawAngles.left !== null ? Math.round(rawAngles.left) : null,

      rightAngle: rawAngles.right !== null ? Math.round(rawAngles.right) : null,

      bodyAngle: 170,

      confidence,

      liveViolations,

      lastRepValid,

      lastRepViolations,

      lastRepFormScore,
    }
  }

  function reset() {
    count = 0

    invalidCount = 0

    state = STATE.READY

    lastRepValid = true

    lastRepViolations = []

    lastRepFormScore = 100

    smoothBuffer.length = 0

    stateEntryTime = performance.now()
  }

  return {
    update,
    reset,

    getState: () => ({
      count,
      invalidCount,
      state,
    }),
  }
}
