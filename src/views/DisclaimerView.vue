<template>
  <div class="app-shell">
    <SideNavBar />
    <!-- Hero -->
    <section class="hero-section mt-10">
      <div class="hero-inner">
        <div class="hero-badge" grid grid-col-2>
          <span class="badge-dot"></span>
          HEALTH DISCLAIMER

          <img src="@/components/icons/pushuplogow.png" alt="RepWar Logo" class="hero-logo" />
        </div>

        <h1 class="hero-title">Fitness & Medical Disclaimer</h1>
        <p class="hero-sub">Important information before using RepWar’s fitness tools.</p>
      </div>
    </section>

    <!-- Content -->
    <section class="actions-section">
      <div class="modal-box animate-up overflow-y-auto [scrollbar-width:none]">
        <!-- Intro -->
        <div class="modal-head">
          <h2 class="modal-title">1. General Information</h2>
        </div>

        <p class="modal-sub">
          RepWar provides fitness tools and performance tracking features for general informational
          and entertainment purposes only.
        </p>

        <p class="modal-sub">We do not provide medical advice, diagnosis, or treatment.</p>
        <br />
        <!-- BMI -->
        <div class="modal-head">
          <h2 class="modal-title">2. BMI Calculator</h2>
        </div>

        <p class="modal-sub">
          The BMI Calculator in RepWar is a basic tool designed to give general guidance based on
          standard formulas.
        </p>

        <p class="modal-sub">
          It should not be used as a substitute for professional medical advice. For accurate health
          assessment, consult a qualified healthcare professional.
        </p>
        <br />
        <!-- Pushups -->
        <div class="modal-head">
          <h2 class="modal-title">3. Physical Activities & Pushup Counter</h2>
        </div>

        <p class="modal-sub">
          Features like the Pushup Counter encourage physical activity, but all exercises are
          performed at your own risk.
        </p>

        <p class="modal-sub">
          You are responsible for ensuring that you are physically capable of performing exercises
          safely. Improper form, overexertion, or pre-existing conditions may lead to injury.
        </p>

        <p class="modal-sub">
          Stop immediately if you feel pain, discomfort, or dizziness, and seek professional medical
          advice if needed.
        </p>
        <br />
        <!-- Responsibility -->
        <div class="modal-head">
          <h2 class="modal-title">4. User Responsibility</h2>
        </div>

        <p class="modal-sub">By using RepWar, you acknowledge that:</p>

        <ul class="modal-sub">
          <li>• You are responsible for your own health and safety</li>
          <li>• You will not rely solely on the app for medical decisions</li>
          <li>• You understand the risks associated with physical exercise</li>
        </ul>
        <br />
        <!-- Liability -->
        <div class="modal-head">
          <h2 class="modal-title">5. Limitation of Liability</h2>
        </div>

        <p class="modal-sub">
          RepWar is not responsible for any injuries, health issues, or damages that may occur from
          using the app or participating in physical activities.
        </p>

        <p class="modal-sub">Use the platform responsibly and within your personal limits.</p>
        <br />
        <!-- Updates -->
        <div class="modal-head">
          <h2 class="modal-title">6. Updates</h2>
        </div>

        <p class="modal-sub">
          This disclaimer may be updated as the platform evolves. Continued use of RepWar means you
          accept the latest version.
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="app-footer">
      REPWAR © 2026
      <span class="footer-dot"></span>
      Train smart, stay safe
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
