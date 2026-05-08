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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
@import '@/assets/aboutview.css';
</style>
