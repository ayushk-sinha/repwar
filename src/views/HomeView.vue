<!-- HomeView.vue -->
<template>
  <div class="app-shell">
    <SideNavBar />
    <div class="ad-banner mt-15" ref="adContainer"></div>
    <!-- <div v-if="showPopup" class="popup">
      <div class="popup-content">Read Disclaimer</div>
    </div> -->

    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-inner">
        <div class="hero-badge">
          <span class="badge-dot" />
          Live Rankings Active
        </div>
        <img src="@/components/icons/pushuplogow.png" alt="logo" class="hero-logo" />
        <h1 class="hero-title">{{ title }}</h1>
        <p class="hero-sub">Push your limits. Track your reps. Dominate the board.</p>
      </div>
    </section>

    <!-- Action Buttons -->
    <section class="actions-section">
      <div class="actions-grid">
        <button v-for="i in 2" :key="i" @click="handleAction(i)" class="action-btn">
          <span class="action-icon">
            <svg
              v-if="i === 1"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <svg
              v-else
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
          </span>
          <span class="action-label">{{ i === 1 ? 'Start Pushups' : 'BMI Calculator' }}</span>
          <span class="action-arrow">→</span>
        </button>
      </div>

      <router-link to="/blog" class="blog-link-btn" rel="noopener noreferrer">
        <span class="action-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </span>
        <span class="action-label">The Journal</span>
        <span class="blog-badge">Anonymous</span>
        <span class="action-arrow">→</span>
      </router-link>
    </section>

    <!-- Rank List -->
    <section class="ranklist-section">
      <Ranklist :players="players" />
    </section>

    <!-- Pushup Counter Modal -->
    <transition name="modal-fade">
      <div v-if="showCounter" class="modal-backdrop" @click.self="closeCounter">
        <div class="modal-box animate-up">
          <button @click="closeCounter" class="modal-close">✕</button>
          <div class="modal-head">
            <h2 class="modal-title">
              Pushup Counter
              <span class="text-xs opacity-30">(Click start -> allow camera permission)</span>
            </h2>
            <p class="modal-sub">Live AI rep tracking</p>
          </div>
          <PushupCounter
            model-variant="lightning"
            @count-updated="updatePushupCount"
            @session-ended="handleSessionEnd"
          />
        </div>
      </div>
    </transition>

    <!-- Player Form Modal -->
    <transition name="modal-fade">
      <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
        <div class="modal-box animate-up">
          <PlayerSubmissionForm :initialPushups="totalPushups" @submit="savePlayer" />
        </div>
      </div>
    </transition>

    <!-- Story Modal -->
    <transition name="modal-fade">
      <div v-if="showStory" class="modal-backdrop" @click.self="showStory = false">
        <div class="modal-box-bare animate-up">
          <button @click="showStory = false" class="modal-close-bare">✕</button>
          <StoryCard
            v-if="showStory"
            :pushups="storyData.pushups"
            :percentile="storyData.percentile"
          />
        </div>
      </div>
    </transition>

    <!-- BMI Modal -->
    <transition name="modal-fade">
      <div v-if="showBMI" class="modal-backdrop" @click.self="showBMI = false">
        <div class="modal-box animate-up modal-wide">
          <button @click="showBMI = false" class="modal-close">✕</button>
          <BmiCalulator />
        </div>
      </div>
    </transition>
    <footer class="app-footer"><span class="footer-dot" />&copy; 2026 repWar.live</footer>
  </div>
  <router-view />
</template>

<script setup>
import { ref, onMounted, onActivated, onDeactivated } from 'vue'
// import { useDeviceId } from '@/composables/useDeviceId'
import { nextTick } from 'vue'

import PushupCounter from '@/components/PushupCounter.vue'
import PlayerSubmissionForm from '@/components/PlayerSubmissionForm.vue'
import SideNavBar from '@/components/SideNavBar.vue'
import Ranklist from '@/components/icons/Ranklist.vue'
import BmiCalulator from '@/components/BmiCalulator.vue'
import StoryCard from '@/components/StoryCard.vue'
import { fetchLeaderboard } from '@/utils/fetchdata'
import { useHead } from '@vueuse/head'
import { supabase } from '@/utils/supabase'

const count = ref(0)
const title = 'repWar.live'
// const { initDeviceId } = useDeviceId()

const showStory = ref(false)
const showCounter = ref(false)
const showForm = ref(false)
const showBMI = ref(false)

const totalPushups = ref(0)
const players = ref([])
const showPopup = ref(false)
// const homeStore = useHomeStore()
const storyData = ref({ pushups: 0, percentile: 0 })
const adContainer = ref(null)
// const update = function () {
//   fetchLeaderboard() // More new logic
// }

defineOptions({
  name: 'HomeView',
})
onMounted(() => {
  showPopup.value = true

  // Inject ad
  if (adContainer.value) {
    window.atOptions = {
      key: 'f7efffede6b20cfc598664a6620cba53',
      format: 'iframe',
      height: 50,
      width: 320,
      params: {},
    }
    console.log('atOptions set:', window.atOptions)

    const script = document.createElement('script')
    script.src = 'https://www.highperformanceformat.com/f7efffede6b20cfc598664a6620cba53/invoke.js'
    script.async = true
    adContainer.value.appendChild(script)
  }
})
// onActivated(() => console.log('activated'))
// onDeactivated(() => console.log('deactivated'))

// useingvue head

useHead({
  title: 'RepWar.live - AI Pushup Counter & Workout Tracker',

  meta: [
    /* ------------------------------------------------ */
    /* Basic SEO */
    /* ------------------------------------------------ */

    {
      name: 'description',
      content:
        'RepWar.live is an AI-powered pushup tracker and workout leaderboard platform where users can count reps, track fitness progress, compete globally, and generate workout stories.',
    },

    {
      name: 'keywords',
      content:
        'pushup counter, AI workout tracker, fitness leaderboard, pushup tracker, workout app, bodyweight training, rep counter, fitness AI, online pushup competition, BMI calculator',
    },

    {
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },

    {
      name: 'author',
      content: 'RepWar.live',
    },

    {
      name: 'theme-color',
      content: '#0d1117',
    },

    {
      name: 'application-name',
      content: 'RepWar.live',
    },

    /* ------------------------------------------------ */
    /* Open Graph */
    /* ------------------------------------------------ */

    {
      property: 'og:type',
      content: 'website',
    },

    {
      property: 'og:site_name',
      content: 'RepWar.live',
    },

    {
      property: 'og:title',
      content: 'RepWar.live - AI Pushup Counter & Workout Tracker',
    },

    {
      property: 'og:description',
      content:
        'Track pushups using AI, compete on global leaderboards, monitor workouts, calculate BMI, and level up your fitness journey.',
    },

    {
      property: 'og:url',
      content: 'https://repwar.live',
    },

    {
      property: 'og:image',
      content: 'https://www.repwar.live/assets/pushuplogow-CI1Ovahn.png',
    },

    {
      property: 'og:image:width',
      content: '1200',
    },

    {
      property: 'og:image:height',
      content: '630',
    },

    {
      property: 'og:image:type',
      content: 'image/png',
    },

    {
      property: 'og:image:alt',
      content: 'RepWar AI Pushup Counter App',
    },

    {
      property: 'og:locale',
      content: 'en_US',
    },

    /* ------------------------------------------------ */
    /* Twitter / X */
    /* ------------------------------------------------ */

    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },

    {
      name: 'twitter:title',
      content: 'RepWar.live - AI Pushup Counter',
    },

    {
      name: 'twitter:description',
      content:
        'Compete globally, count pushups with AI, track workouts, and dominate the leaderboard.',
    },

    {
      name: 'twitter:image',
      content: 'https://www.repwar.live/assets/pushuplogow-CI1Ovahn.png',
    },

    /* ------------------------------------------------ */
    /* Mobile / PWA */
    /* ------------------------------------------------ */

    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },

    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black-translucent',
    },

    {
      name: 'apple-mobile-web-app-title',
      content: 'RepWar',
    },

    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
  ],

  /* ------------------------------------------------ */
  /* Canonical */
  /* ------------------------------------------------ */

  link: [
    {
      rel: 'canonical',
      href: 'https://repwar.live',
    },
  ],

  /* ------------------------------------------------ */
  /* JSON-LD Structured Data */
  /* ------------------------------------------------ */

  script: [
    {
      type: 'application/ld+json',

      children: JSON.stringify({
        '@context': 'https://schema.org',

        '@type': 'SoftwareApplication',

        name: 'RepWar.live',

        applicationCategory: 'HealthApplication',

        operatingSystem: 'Web',

        url: 'https://repwar.live',

        description:
          'AI-powered pushup tracking platform with workout analytics, leaderboards, BMI calculator, and competitive fitness features.',

        image: 'https://www.repwar.live/assets/pushuplogow-CI1Ovahn.png',

        screenshot: 'https://www.repwar.live/assets/pushuplogow-CI1Ovahn.png',

        creator: {
          '@type': 'Organization',
          name: 'RepWar.live',
        },

        publisher: {
          '@type': 'Organization',
          name: 'RepWar.live',
        },

        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },

        featureList: [
          'AI Pushup Counter',
          'Workout Tracking',
          'Global Leaderboards',
          'BMI Calculator',
          'Fitness Stories',
          'Pose Detection',
          'Realtime Rep Counting',
        ],
      }),
    },
  ],
})

function handleAction(index) {
  if (index === 1) showCounter.value = true
  else if (index === 2) showBMI.value = true
}

function closeCounter() {
  showCounter.value = false
}
function updatePushupCount(count) {
  totalPushups.value = count
}

function handleSessionEnd(data) {
  showCounter.value = false
  totalPushups.value = data.pushups
  showForm.value = true
}

async function savePlayer(player) {
  if (!player) {
    console.error('No player data received')
    return
  }
  players.value.unshift(player)
  players.value.sort((a, b) => b.pushups - a.pushups)
  storyData.value = { pushups: player.pushups, percentile: await calculatePercentile(player.email) }
  showForm.value = false
  await nextTick()
  showStory.value = true
}

async function calculatePercentile(email) {
  const { data, error } = await supabase.rpc('get_percentile', {
    p_key: email,
  })

  if (error) {
    console.error('Error fetching percentile:', error)
    return 0
  }

  return data
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
@import '@/assets/homeview.css';
.ad-banner {
  display: flex;
  justify-content: center;
  padding: 8px 0;
  background: transparent;
}
/* Desktop side ads */
.desktop-ads {
  position: fixed;
  top: 120px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 5;
}

.left-ads {
  left: 18px;
}

.right-ads {
  right: 18px;
}

.ad-slot {
  width: 475px;
  min-height: 70px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Hide on mobile/tablet */
@media (max-width: 1400px) {
  .desktop-ads {
    display: none;
  }
}
</style>
