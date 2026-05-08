<!-- PushupCounter.vue – Anti-Cheat Edition -->
<template>
  <div class="counter-wrap">
    <!-- ── Camera ──────────────────────────────────────────────────────────── -->
    <div class="camera-box">
      <video
        ref="videoRef"
        playsinline
        muted
        class="camera-feed"
        :class="cameraStatus === 'active' ? 'visible' : 'hidden'"
      />
      <canvas ref="canvasRef" class="camera-canvas" />

      <!-- Pre-start / error overlay -->
      <div v-if="cameraStatus !== 'active'" class="camera-overlay">
        <div class="overlay-inner">
          <div class="camera-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.3"
            >
              <path
                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
              />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <p class="overlay-text">{{ overlayMessage }}</p>
        </div>
      </div>

      <!-- Model loading (camera active, model not yet ready) -->
      <div v-else-if="!isDetecting" class="camera-overlay">
        <div class="spinner" />
        <span class="empty-text">Loading model…</span>
      </div>

      <!-- Tracking badge -->
      <div
        v-if="isDetecting"
        class="tracking-badge"
        :class="poseResult.confidence === 'high' ? 'tracking-on' : 'tracking-search'"
      >
        <span class="tracking-dot" />
        {{ poseResult.confidence === 'high' ? 'Tracking' : 'Searching…' }}
      </div>
    </div>

    <!-- ── Stats row ────────────────────────────────────────────────────────── -->
    <div class="stats-row">
      <div class="stat-card">
        <p class="stat-label">Reps</p>
        <p class="stat-value" :class="countPulse ? 'stat-pulse' : ''">{{ poseResult.count }}</p>
      </div>

      <div class="stat-divider" />

      <div class="stat-card">
        <p class="stat-label">Invalid</p>
        <p class="stat-value stat-invalid">{{ poseResult.invalidCount }}</p>
      </div>

      <div class="stat-divider" />

      <div class="stat-card">
        <p class="stat-label">Position</p>
        <p class="stat-position" :class="stateClass">{{ stateLabel }}</p>
      </div>
    </div>

    <!-- ── Form score bar ───────────────────────────────────────────────────── -->
    <div v-if="isDetecting" class="form-bar-wrap">
      <div class="form-bar-header">
        <span class="form-bar-label">Last rep form</span>
        <span class="form-bar-score" :class="formScoreClass"
          >{{ poseResult.lastRepFormScore }}%</span
        >
      </div>
      <div class="form-bar-track">
        <div
          class="form-bar-fill"
          :class="formScoreClass"
          :style="{ width: poseResult.lastRepFormScore + '%' }"
        />
      </div>
    </div>

    <!-- ── Last rep verdict ─────────────────────────────────────────────────── -->
    <Transition name="verdict-fade">
      <div
        v-if="showVerdict && isDetecting"
        class="verdict-banner"
        :class="poseResult.lastRepValid ? 'verdict-valid' : 'verdict-invalid'"
      >
        <span class="verdict-icon">{{ poseResult.lastRepValid ? '✓' : '✗' }}</span>
        <span class="verdict-text">{{
          poseResult.lastRepValid ? 'Good rep!' : 'Invalid rep'
        }}</span>
        <span v-if="!poseResult.lastRepValid" class="verdict-sub">
          {{ poseResult.lastRepViolations.map((v) => VIOLATION_MSG[v]).join(' · ') }}
        </span>
      </div>
    </Transition>

    <!-- ── Live form coaching panel ─────────────────────────────────────────── -->
    <div v-if="isDetecting && liveCoachItems.length" class="coaching-panel">
      <div
        v-for="item in liveCoachItems"
        :key="item.code"
        class="coaching-item"
        :class="item.severity === 'error' ? 'coaching-error' : 'coaching-warn'"
      >
        <span class="coaching-icon">{{ item.severity === 'error' ? '⚠' : '○' }}</span>
        <span class="coaching-msg">{{ item.msg }}</span>
      </div>
    </div>

    <!-- ── Guidance when IDLE ───────────────────────────────────────────────── -->
    <div v-if="isDetecting && poseResult.state === 'IDLE'" class="guidance-strip">
      <span class="guidance-icon">🧘</span>
      <span>Get into a side-view plank position to begin</span>
    </div>
    <div
      v-else-if="isDetecting && poseResult.state === 'READY'"
      class="guidance-strip guidance-ready"
    >
      <span class="guidance-icon">💪</span>
      <span>Arms extended — lower yourself to start rep</span>
    </div>

    <!-- ── Buttons ──────────────────────────────────────────────────────────── -->
    <div class="counter-actions">
      <button v-if="cameraStatus !== 'active'" @click="handleStart" class="btn-start">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        Start Session
      </button>
      <button v-if="cameraStatus === 'active'" @click="handleStop" class="btn-stop">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
        End Session
      </button>
      <button @click="resetAll" class="btn-reset">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 .49-3.1" />
        </svg>
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCamera } from '@/composables/useCamera'
import { usePoseDetection } from '@/composables/usePoseDetection'
import { VIOLATION_MSG, VIOLATION_SEVERITY } from '@/utils/pushupLogic'

const emit = defineEmits(['count-updated', 'session-ended'])
const props = defineProps({
  modelVariant: { type: String, default: 'lightning' },
})

const { videoRef, status: cameraStatus, error: cameraError, startCamera, stopCamera } = useCamera()
const { canvasRef, poseResult, isDetecting, startDetection, stopDetection, resetCounter } =
  usePoseDetection(videoRef, { variant: props.modelVariant })

const countPulse = ref(false)
const showVerdict = ref(false)
let verdictTimer = null

// ── Computed ──────────────────────────────────────────────────────────────────
const overlayMessage = computed(() => {
  if (cameraStatus.value === 'requesting') return 'Allow camera permission…'
  if (cameraStatus.value === 'stopped') return 'Camera stopped'
  if (cameraStatus.value === 'error') return cameraError.value
  return 'Press Start to begin'
})

const stateLabel = computed(
  () =>
    ({
      IDLE: '— Idle',
      READY: '▲ Ready',
      DOWN: '▼ Down',
    })[poseResult.value.state] ?? poseResult.value.state,
)

const stateClass = computed(
  () =>
    ({
      IDLE: '',
      READY: 'state-up',
      DOWN: 'state-down',
    })[poseResult.value.state] ?? '',
)

/** Live violations rendered as coaching cues (excludes NOT_IN_PLANK – handled by guidance-strip) */
const liveCoachItems = computed(() =>
  (poseResult.value.liveViolations ?? [])
    .filter((v) => v !== 'NOT_IN_PLANK')
    .map((v) => ({ code: v, msg: VIOLATION_MSG[v], severity: VIOLATION_SEVERITY[v] })),
)

const formScoreClass = computed(() => {
  const s = poseResult.value.lastRepFormScore
  if (s >= 90) return 'score-great'
  if (s >= 65) return 'score-ok'
  return 'score-bad'
})

// ── Watchers ──────────────────────────────────────────────────────────────────
watch(
  () => poseResult.value.count,
  (n) => {
    countPulse.value = true
    emit('count-updated', n)
    setTimeout(() => {
      countPulse.value = false
    }, 220)
  },
)

// Show verdict banner for 2.5 s after each rep attempt (valid or invalid)
watch(
  () => [poseResult.value.count, poseResult.value.invalidCount],
  () => {
    showVerdict.value = true
    clearTimeout(verdictTimer)
    verdictTimer = setTimeout(() => {
      showVerdict.value = false
    }, 2500)
  },
)

// ── Handlers ──────────────────────────────────────────────────────────────────
async function handleStart() {
  const ok = await startCamera()
  if (ok) {
    await new Promise((r) => setTimeout(r, 200))
    await startDetection()
  }
}

function handleStop() {
  stopDetection()
  stopCamera()
  emit('session-ended', { pushups: poseResult.value.count, invalid: poseResult.value.invalidCount })
}

function resetAll() {
  resetCounter()
  showVerdict.value = false
  emit('count-updated', 0)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

/* ── Tokens ──────────────────────────────────────────────────────────────────── */
.counter-wrap {
  --green: #6ee7b7;
  --yellow: #fbbf24;
  --red: #f87171;
  --bg: #060810;
  --surface: rgba(255, 255, 255, 0.03);
  --border: rgba(255, 255, 255, 0.06);
  --text: rgba(230, 225, 214, 0.85);
  --muted: rgba(230, 225, 214, 0.3);

  width: 100%;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

/* ── Camera ──────────────────────────────────────────────────────────────────── */
.camera-box {
  position: relative;
  aspect-ratio: 16/9;
  background: var(--bg);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.camera-feed {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
}
.camera-feed.visible {
  opacity: 1;
}
.camera-feed.hidden {
  opacity: 0;
}
.camera-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.camera-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.overlay-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  text-align: center;
  padding: 1rem;
}
.camera-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(110, 231, 183, 0.06);
  border: 1px solid rgba(110, 231, 183, 0.15);
  color: rgba(110, 231, 183, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.overlay-text {
  font-size: 0.8rem;
  color: var(--muted);
  margin: 0;
}
.empty-text {
  font-size: 0.9rem;
  color: var(--muted);
}

.tracking-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  backdrop-filter: blur(8px);
}
.tracking-on {
  background: rgba(110, 231, 183, 0.12);
  border: 1px solid rgba(110, 231, 183, 0.25);
  color: var(--green);
}
.tracking-search {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  color: var(--yellow);
}
.tracking-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: blink 1.5s ease infinite;
}

/* ── Stats row ───────────────────────────────────────────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: 1fr 1px 1fr 1px 1fr;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.stat-card {
  padding: 0.9rem;
  text-align: center;
}
.stat-divider {
  background: var(--border);
}
.stat-label {
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 0.3rem;
}
.stat-value {
  font-size: 2.2rem;
  font-weight: 600;
  color: #f0ece3;
  margin: 0;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  transition: all 0.15s;
}
.stat-value.stat-pulse {
  transform: scale(1.12);
  color: var(--green);
}
.stat-invalid {
  font-size: 2.2rem;
  font-weight: 600;
  color: rgba(248, 113, 113, 0.6);
  margin: 0;
  line-height: 1;
}
.stat-position {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--muted);
  margin: 0.3rem 0 0;
}
.state-up {
  color: var(--green);
}
.state-down {
  color: var(--yellow);
}

/* ── Form score bar ──────────────────────────────────────────────────────────── */
.form-bar-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.75rem 1rem;
}
.form-bar-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.45rem;
}
.form-bar-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}
.form-bar-score {
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.form-bar-track {
  height: 5px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 99px;
  overflow: hidden;
}
.form-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition:
    width 0.5s ease,
    background-color 0.5s ease;
}
.score-great .form-bar-fill,
.score-great {
  background: var(--green);
  color: var(--green);
}
.score-ok .form-bar-fill,
.score-ok {
  background: var(--yellow);
  color: var(--yellow);
}
.score-bad .form-bar-fill,
.score-bad {
  background: var(--red);
  color: var(--red);
}

/* ── Verdict banner ──────────────────────────────────────────────────────────── */
.verdict-banner {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  font-size: 0.82rem;
  flex-wrap: wrap;
}
.verdict-valid {
  background: rgba(110, 231, 183, 0.08);
  border: 1px solid rgba(110, 231, 183, 0.2);
  color: var(--green);
}
.verdict-invalid {
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.2);
  color: var(--red);
}
.verdict-icon {
  font-weight: 700;
  font-size: 1rem;
}
.verdict-text {
  font-weight: 500;
}
.verdict-sub {
  font-size: 0.73rem;
  opacity: 0.8;
  width: 100%;
  margin-top: 0.1rem;
  line-height: 1.4;
}

.verdict-fade-enter-active,
.verdict-fade-leave-active {
  transition:
    opacity 0.25s,
    transform 0.25s;
}
.verdict-fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.verdict-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ── Coaching panel ──────────────────────────────────────────────────────────── */
.coaching-panel {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.coaching-item {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  animation: slideIn 0.2s ease;
}
.coaching-error {
  background: rgba(248, 113, 113, 0.07);
  border: 1px solid rgba(248, 113, 113, 0.18);
  color: var(--red);
}
.coaching-warn {
  background: rgba(251, 191, 36, 0.07);
  border: 1px solid rgba(251, 191, 36, 0.18);
  color: var(--yellow);
}
.coaching-icon {
  font-size: 0.85rem;
}

/* ── Guidance strip ──────────────────────────────────────────────────────────── */
.guidance-strip {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  background: rgba(251, 191, 36, 0.05);
  border: 1px solid rgba(251, 191, 36, 0.12);
  color: rgba(251, 191, 36, 0.75);
  font-size: 0.78rem;
}
.guidance-ready {
  background: rgba(110, 231, 183, 0.05);
  border-color: rgba(110, 231, 183, 0.12);
  color: rgba(110, 231, 183, 0.75);
}
.guidance-icon {
  font-size: 1rem;
}

/* ── Buttons ─────────────────────────────────────────────────────────────────── */
.counter-actions {
  display: flex;
  gap: 0.6rem;
}
.btn-start,
.btn-stop,
.btn-reset {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.2rem;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}
.btn-start {
  flex: 1;
  background: rgba(110, 231, 183, 0.12);
  border: 1px solid rgba(110, 231, 183, 0.25);
  color: var(--green);
}
.btn-start:hover {
  background: rgba(110, 231, 183, 0.2);
  border-color: rgba(110, 231, 183, 0.4);
}
.btn-stop {
  flex: 1;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--red);
}
.btn-stop:hover {
  background: rgba(239, 68, 68, 0.18);
  border-color: rgba(239, 68, 68, 0.35);
}
.btn-reset {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  color: var(--muted);
}
.btn-reset:hover {
  background: rgba(255, 255, 255, 0.07);
  color: var(--text);
}

/* ── Spinner ─────────────────────────────────────────────────────────────────── */
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(110, 231, 183, 0.15);
  border-top-color: var(--green);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* ── Keyframes ───────────────────────────────────────────────────────────────── */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
