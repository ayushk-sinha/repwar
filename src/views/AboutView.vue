<template>
  <div class="app-shell">
    <div class="fixed-sidebar">
      <SideNavBar />
    </div>
    <!-- Hero Section -->
    <section class="hero-section mt-10">
      <div class="hero-inner">
        <div class="hero-badge" grid grid-col-2>
          <span class="badge-dot"></span>
          About RepWar

          <img src="@/components/icons/pushuplogow.png" alt="RepWar Logo" class="hero-logo" />
        </div>
        <h1 class="hero-title">Redefining Fitness Competition</h1>

        <p class="hero-sub">
          Turn your daily pushups into a real-time competitive experience powered by AI.
        </p>
      </div>
    </section>

    <!-- About Content -->
    <section class="ranklist-section">
      <div class="modal-box animate-up overflow-y-auto [scrollbar-width:none]">
        <div class="modal-head">
          <span class="hero-badge">Read from here</span>

          <h2 class="modal-title">Who We Are</h2>
          <p class="modal-sub">Built for consistency. Designed for competition.</p>
        </div>

        <p class="hero-sub">
          RepWar is a cutting-edge fitness platform designed to transform your workouts into an
          engaging and competitive experience. By combining advanced full-stack development with
          AI-driven computer vision, we ensure every rep you perform is accurately tracked and
          rewarded.
        </p>

        <br />

        <div class="modal-head">
          <h2 class="modal-title">Our Mission</h2>
        </div>

        <p class="hero-sub">
          Our mission is to make fitness addictive in the best way possible. We aim to turn
          discipline into a game, effort into visible progress, and consistency into competition.
        </p>

        <br />

        <div class="modal-head">
          <h2 class="modal-title">How It Works</h2>
        </div>

        <!-- Feature Cards -->
        <div class="actions-grid">
          <div class="action-btn">
            <div class="action-icon">🤖</div>
            <div class="action-label">
              <strong>AI Counter</strong><br />
              Tracks your pushups using pose detection with real-time feedback.
            </div>
          </div>

          <div class="action-btn">
            <div class="action-icon">🏆</div>
            <div class="action-label">
              <strong>XP Ranking</strong><br />
              Earn points, climb leaderboards, and compete globally.
            </div>
          </div>

          <div class="action-btn">
            <div class="action-icon">📊</div>
            <div class="action-label">
              <strong>Health Tools</strong><br />
              Track your fitness with our Pro BMI calculator and insights.
            </div>
          </div>

          <div class="action-btn">
            <div class="action-icon">🔥</div>
            <div class="action-label">
              <strong>Consistency System</strong><br />
              Stay motivated with streaks and performance tracking.
            </div>
          </div>
        </div>

        <br />

        <div class="modal-head">
          <h2 class="modal-title">Why RepWar?</h2>
        </div>

        <p class="hero-sub">
          Motivation fades, but competition doesn’t. RepWar keeps you consistent, pushes your
          limits, and makes fitness engaging. Every rep matters. Every session counts.
        </p>

        <br />

        <div class="modal-head">
          <h2 class="modal-title">Our Vision</h2>
        </div>

        <p class="hero-sub">
          We are building a global competitive fitness ecosystem where anyone can show up, perform,
          and rise.
        </p>
        <br />
        <div class="modal-head">
          <h2 class="modal-title">About Developer</h2>
        </div>

        <p class="hero-sub">
          I am Ayush sinha form Bihar(India), After not able to get interview in MNCs or startups, I
          decided to start something of my own. I have this plan from my college time to built
          something cool so I experimented with all of my ideas but never completed most of my
          projects. So, I came up with this idea of repWar.live (rep = repetation) which will
          basically allow user to count their clean rep. I decided to keep it as simple as possible,
          and the UI is mobile device friendly, feel free to use contact us section if you have any
          suggestion. Thanks!
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="app-footer">
      <span>REPWAR</span>
      <span class="footer-dot"></span>
      <span>COMPETE. TRACK. IMPROVE.</span>
    </footer>
  </div>
</template>

<script setup>
import SideNavBar from '@/components/SideNavBar.vue'
import { useHead } from '@vueuse/head'

useHead({
  title: 'About RepWar.live | AI Fitness Competition Platform',

  meta: [
    /* ------------------------------------------------ */
    /* Basic SEO */
    /* ------------------------------------------------ */

    {
      name: 'description',
      content:
        'Learn about RepWar.live — an AI-powered pushup tracking and competitive fitness platform built to gamify workouts, improve consistency, and motivate users through real-time rankings.',
    },

    {
      name: 'keywords',
      content:
        'RepWar, AI fitness app, pushup counter, competitive fitness platform, workout leaderboard, fitness tracker, pose detection, BMI calculator, fitness motivation',
    },

    {
      name: 'robots',
      content: 'index, follow',
    },

    {
      name: 'author',
      content: 'Ayush Sinha',
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
      content: 'About RepWar.live | AI Fitness Competition Platform',
    },

    {
      property: 'og:description',
      content:
        'Discover the mission, vision, and technology behind RepWar.live — an AI-powered workout competition platform.',
    },

    {
      property: 'og:url',
      content: 'https://repwar.live/About-Us',
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
      property: 'og:image:alt',
      content: 'RepWar.live AI Fitness Platform',
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
      content: 'About RepWar.live',
    },

    {
      name: 'twitter:description',
      content: 'Explore the story and vision behind RepWar.live — AI-powered fitness competition.',
    },

    {
      name: 'twitter:image',
      content: 'https://www.repwar.live/assets/pushuplogow-CI1Ovahn.png',
    },
  ],

  /* ------------------------------------------------ */
  /* Canonical */
  /* ------------------------------------------------ */

  link: [
    {
      rel: 'canonical',
      href: 'https://repwar.live/About-Us',
    },
  ],

  /* ------------------------------------------------ */
  /* Structured Data */
  /* ------------------------------------------------ */

  script: [
    {
      type: 'application/ld+json',

      children: JSON.stringify({
        '@context': 'https://schema.org',

        '@type': 'AboutPage',

        name: 'About RepWar.live',

        description:
          'Official about page for RepWar.live, an AI-powered pushup tracking and competitive fitness platform.',

        url: 'https://repwar.live/About-Us',

        mainEntity: {
          '@type': 'SoftwareApplication',

          name: 'RepWar.live',

          applicationCategory: 'HealthApplication',

          operatingSystem: 'Web',

          url: 'https://repwar.live',

          creator: {
            '@type': 'Person',

            name: 'Ayush Sinha',
          },

          featureList: [
            'AI Pushup Counter',
            'Workout Leaderboards',
            'BMI Calculator',
            'Realtime Pose Detection',
            'Fitness Competition',
            'Workout Tracking',
          ],
        },

        publisher: {
          '@type': 'Organization',

          name: 'RepWar.live',

          url: 'https://repwar.live',
        },
      }),
    },
  ],
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
@import '@/assets/aboutview.css';
</style>
