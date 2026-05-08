<!-- Ranklist.vue -->
<template>
  <section class="ranklist">
    <!-- Header -->
    <div class="ranklist-header">
      <div>
        <p class="ranklist-eyebrow">Your Monthly Best(PR)</p>
        <h2 class="ranklist-title">Top Personal Records</h2>
      </div>
      <span class="ranklist-badge">Top 25</span>
    </div>

    <!-- Loading state -->
    <div v-if="!performers.length" class="ranklist-empty">
      <div class="spinner" />
      <span class="empty-text">Loading rankings…</span>
    </div>

    <!-- Scroll Box -->
    <div
      v-else
      ref="scrollBox"
      class="scroll-box"
      @mouseenter="pauseAutoScroll"
      @mouseleave="resumeAutoScroll"
      @touchstart="pauseAutoScroll"
      @touchend="resumeAutoScroll"
      @wheel="pauseTemporary"
    >
      <div v-for="(user, index) in infiniteList" :key="index" class="rank-row">
        <!-- Rank Number -->
        <div class="rank-badge" :class="getRankClass(index % performers.length)">
          {{ performers.length ? (index % performers.length) + 1 : '' }}
        </div>

        <!-- Avatar -->
        <img :src="user.avatar" :alt="user.name" class="rank-avatar" />

        <!-- Info -->
        <div class="rank-info">
          <p class="rank-name">{{ user.name }}</p>
          <p class="rank-reps">{{ user.reps }} <span>pushups</span></p>
        </div>

        <!-- Social -->
        <a
          v-if="user.instagram"
          :href="user.instagram"
          target="_blank"
          class="rank-social"
          title="Instagram"
        >
          <!-- <img src="./icons/instagram-svgrepo-com.svg" class="insta-icon" /> -->
          <i class="pi pi-instagram" style="font-size: 1rem"></i>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
//import { supabase } from '@/utils/supabase'
//import { getIndiaDate } from '@/utils/intime'
import { fetchLeaderboard } from '@/utils/fetchdata'

import 'primeicons/primeicons.css'

const scrollBox = ref(null)
let interval = null
let resumeTimer = null

const performers = ref([])

const infiniteList = computed(() => [...performers.value, ...performers.value])

function getRankClass(i) {
  if (i === 0) return 'rank-gold'
  if (i === 1) return 'rank-silver'
  if (i === 2) return 'rank-bronze'
  return ''
}

function startAutoScroll() {
  stopAutoScroll()
  interval = setInterval(() => {
    const el = scrollBox.value
    if (!el) return
    el.scrollTop += 1
    if (el.scrollTop >= el.scrollHeight / 2) el.scrollTop = 0
  }, 30)
}

function stopAutoScroll() {
  if (interval) clearInterval(interval)
}
function pauseAutoScroll() {
  stopAutoScroll()
}
function resumeAutoScroll() {
  startAutoScroll()
}

function pauseTemporary() {
  stopAutoScroll()
  clearTimeout(resumeTimer)
  resumeTimer = setTimeout(startAutoScroll, 2200)
}

onMounted(async () => {
  performers.value = await fetchLeaderboard()
  startAutoScroll()
})

onBeforeUnmount(() => {
  stopAutoScroll()
  clearTimeout(resumeTimer)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
@import '@/assets/ranklist.css';
</style>
