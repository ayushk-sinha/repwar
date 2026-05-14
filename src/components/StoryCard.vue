<!-- StoryCard.vue -->
<template>
  <div class="story-wrapper">
    <!-- Header -->
    <div class="story-header">
      <div>
        <p class="story-eyebrow">Your Result</p>
        <h2 class="story-title">Story Card</h2>
      </div>
      <button @click="downloadImage" class="download-btn" :disabled="downloading">
        <span v-if="downloading" class="spinner" />
        <svg
          v-else
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {{ downloading ? 'Saving…' : 'Download(AD)' }}
      </button>
    </div>

    <!-- Card -->
    <div ref="cardRef" class="card-capture">
      <div class="story-card" :class="bgStyle">
        <!-- Overlay -->
        <div class="card-overlay" />

        <!-- Content -->
        <div class="card-content">
          <!-- Top -->
          <div class="card-top">
            <div class="card-logo-wrap">
              <img src="@/components/icons/pushuplogow.png" alt="logo" class="card-logo" />
            </div>
            <h1 class="card-app-name">repWar.live</h1>
            <p class="card-tagline">Push Your Limits</p>
          </div>

          <!-- Center -->
          <div class="card-center">
            <p class="card-did">I just did</p>
            <div class="card-reps">{{ pushups }}</div>
            <p class="card-reps-label">Push-ups 💪</p>
            <div class="card-outperformed">I outperformed</div>
            <div class="card-percentile">{{ percentile }}%</div>
            <div class="card-of-users">of users 🔥</div>
            <div class="card-challenge">What are your excuses, Weakling?</div>
          </div>

          <!-- Bottom -->
          <div class="card-bottom">
            <p class="card-cta-sub">Can you beat me?</p>
            <p class="card-cta">Join now 🚀</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import * as htmlToImage from 'html-to-image'
import { fetchLeaderboard } from '@/utils/fetchdata'

const props = defineProps({
  pushups: Number,
  percentile: Number,
})

const cardRef = ref(null)
const downloading = ref(false)

const gradients = [
  'bg-gradient-to-r from-slate-900 to-slate-700',
  'bg-gradient-to-r from-zinc-900 to-fuchsia-900',
  'bg-gradient-to-r from-zinc-900 to-green-900',
  'bg-gradient-to-r from-zinc-900 to-red-900',
  'bg-gradient-to-r from-black to-zinc-900',
  'bg-gradient-to-r from-black to-indigo-950',
  'bg-gradient-to-r from-black via-neutral-900 to-emerald-950',
  'bg-gradient-to-r from-black via-zinc-900 to-rose-950',
  'bg-gradient-to-r from-zinc-950 to-purple-950',
]

const bgStyle = computed(() => gradients[Math.floor(Math.random() * gradients.length)])

const downloadImage = async () => {
  fetchLeaderboard()

  if (!cardRef.value || downloading.value) return

  downloading.value = true

  try {
    const dataUrl = await htmlToImage.toPng(cardRef.value, {
      pixelRatio: 7,
      backgroundColor: null,
    })

    const link = document.createElement('a')

    const now = new Date()

    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getTime()).padStart(2, '0')}`

    link.download = `repwar-story-${props.pushups}pushups-${formattedDate}.png`

    link.href = dataUrl

    link.click()
  } catch (err) {
    console.error('Download failed:', err)
  } finally {
    downloading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

.story-wrapper {
  font-family: 'DM Sans', sans-serif;
  color: #e6e1d6;
}

/* ── Header ───────────────────────────── */
.story-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.story-eyebrow {
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6ee7b7;
  font-weight: 500;
  margin: 0 0 0.25rem;
}

.story-title {
  font-family: 'Lora', serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: #f0ece3;
  margin: 0;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 1.1rem;
  border-radius: 9px;
  background: rgba(110, 231, 183, 0.1);
  border: 1px solid rgba(110, 231, 183, 0.22);
  color: #6ee7b7;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.download-btn:hover:not(:disabled) {
  background: rgba(110, 231, 183, 0.18);
  border-color: rgba(110, 231, 183, 0.38);
}

.download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 12px;
  height: 12px;
  border: 1.5px solid rgba(110, 231, 183, 0.3);
  border-top-color: #6ee7b7;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Card ─────────────────────────────── */
.card-capture {
  display: flex;
  justify-content: center;
}

.story-card {
  width: 300px;
  height: 520px;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  color: white;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.6);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
}

.card-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 1.5rem 1.25rem;
}

/* Top */
.card-top {
  text-align: center;
}

.card-logo-wrap {
  width: 56px;
  height: 56px;
  margin: 0 auto 0.4rem;
}

.card-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-app-name {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0 0 0.15rem;
}

.card-tagline {
  font-size: 0.65rem;
  opacity: 0.7;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0;
}

/* Center */
.card-center {
  text-align: center;
}

.card-did {
  font-size: 0.78rem;
  opacity: 0.75;
  margin: 0 0 0.25rem;
}

.card-reps {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1;
  margin: 0 0 0.1rem;
}

.card-reps-label {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
}

.card-outperformed {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-bottom: 0.15rem;
}

.card-percentile {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.card-of-users {
  font-size: 0.75rem;
  opacity: 0.75;
  margin-bottom: 0.6rem;
}

.card-challenge {
  font-size: 0.72rem;
  opacity: 0.85;
  font-style: italic;
}

/* Bottom */
.card-bottom {
  text-align: center;
}

.card-cta-sub {
  font-size: 0.65rem;
  opacity: 0.7;
  margin: 0 0 0.2rem;
}

.card-cta {
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
}
</style>
