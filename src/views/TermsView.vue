<template>
  <div class="app-shell">
    <SideNavBar />
    <!-- Hero -->
    <section class="hero-section mt-10">
      <div class="hero-inner">
        <div class="hero-badge" grid grid-col-2>
          <span class="badge-dot"></span>
          REPWAR POLICY

          <img src="@/components/icons/pushuplogow.png" alt="RepWar Logo" class="hero-logo" />
        </div>

        <h1 class="hero-title">Terms & Conditions</h1>
        <p class="hero-sub">Simple rules to keep RepWar fair, fun, and safe for everyone.</p>
      </div>
    </section>

    <!-- Content -->
    <section class="actions-section">
      <div class="modal-box animate-up overflow-y-auto [scrollbar-width:none]">
        <div class="modal-head">
          <h2 class="modal-title">1. Using RepWar</h2>
          <p class="modal-sub">
            By using RepWar, you agree to follow these basic rules and respect the platform.
          </p>
        </div>

        <p class="modal-sub">
          RepWar is designed for competitive fitness tracking and leaderboard ranking. You are
          responsible for the content you submit and how you use the platform.
        </p>
        <br />
        <!-- Ranklist -->

        <div class="modal-head">
          <h2 class="modal-title">2. Ranklist Rules</h2>
        </div>

        <p class="modal-sub">
          The Ranklist reflects user-submitted performance data. While we aim for fairness, we
          cannot guarantee absolute accuracy of every submission.
        </p>

        <p class="modal-sub">
          We reserve the right to review, adjust, or remove any ranking that appears suspicious,
          manipulated, or violates fair competition standards.
        </p>
        <br />
        <!-- Submission -->
        <div class="modal-head">
          <h2 class="modal-title">3. Player Submissions</h2>
        </div>

        <p class="modal-sub">
          When submitting your performance through PlayerSubmissionForm, you agree that:
        </p>

        <ul class="modal-sub">
          <li>• All submitted data is truthful and accurate</li>
          <li>• You are not using fake scores, bots, or manipulation</li>
          <li>• Your avatar and content are appropriate</li>
        </ul>

        <p class="modal-sub">
          RepWar has full rights to remove any inappropriate avatars, offensive content, or fake
          submissions without prior notice.
        </p>
        <br />
        <!-- Moderation -->
        <div class="modal-head">
          <h2 class="modal-title">4. Content Moderation</h2>
        </div>

        <p class="modal-sub">
          We maintain the right to remove, edit, or restrict any content that:
        </p>

        <ul class="modal-sub">
          <li>• Is offensive, abusive, or harmful</li>
          <li>• Violates community standards</li>
          <li>• Attempts to cheat or exploit the system</li>
        </ul>
        <br />
        <!-- BMI -->
        <div class="modal-head">
          <h2 class="modal-title">5. BMI Calculator Disclaimer</h2>
        </div>

        <p class="modal-sub">
          The BMI Calculator provided on RepWar is for informational purposes only.
        </p>

        <p class="modal-sub">
          It should not be considered medical advice, diagnosis, or treatment. Always consult a
          qualified healthcare professional for health-related decisions.
        </p>
        <br />
        <!-- Liability -->
        <div class="modal-head">
          <h2 class="modal-title">6. Responsibility</h2>
        </div>

        <p class="modal-sub">You are responsible for how you use RepWar. We are not liable for:</p>

        <ul class="modal-sub">
          <li>• Incorrect user submissions</li>
          <li>• Misuse of fitness data</li>
          <li>• Decisions made based on platform content</li>
        </ul>
        <br />
        <!-- Updates -->
        <div class="modal-head">
          <h2 class="modal-title">7. Updates to Terms</h2>
        </div>

        <p class="modal-sub">
          These terms may be updated over time. Continued use of RepWar means you accept the latest
          version.
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="app-footer">
      REPWAR © 2026
      <span class="footer-dot"></span>
      Built for fair competition
    </footer>
  </div>
</template>

<script setup>
import SideNavBar from '@/components/SideNavBar.vue'
import { useHead } from '@vueuse/head'

useHead({
  title: 'Terms & Conditions | RepWar.live',

  meta: [
    /* ------------------------------------------------ */
    /* Basic SEO */
    /* ------------------------------------------------ */

    {
      name: 'description',
      content:
        'Read the official RepWar.live Terms & Conditions covering leaderboard rules, user submissions, content moderation, fair competition, BMI disclaimer, and platform usage policies.',
    },

    {
      name: 'keywords',
      content:
        'RepWar terms, fitness app terms, leaderboard rules, workout competition rules, AI pushup tracker policy, user submission policy',
    },

    {
      name: 'robots',
      content: 'index, follow',
    },

    {
      name: 'author',
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
      content: 'Terms & Conditions | RepWar.live',
    },

    {
      property: 'og:description',
      content:
        'Official terms and conditions for using RepWar.live including fair competition, moderation, and leaderboard policies.',
    },

    {
      property: 'og:url',
      content: 'https://repwar.live/terms-and-conditions',
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
      content: 'RepWar.live Terms and Conditions',
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
      content: 'Terms & Conditions | RepWar.live',
    },

    {
      name: 'twitter:description',
      content:
        'Review the official RepWar.live rules, platform policies, leaderboard guidelines, and moderation standards.',
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
      href: 'https://repwar.live/terms-and-conditions',
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

        '@type': 'TermsOfService',

        name: 'RepWar.live Terms & Conditions',

        description:
          'Official terms and conditions for RepWar.live including leaderboard rules, moderation policies, and user responsibilities.',

        url: 'https://repwar.live/terms-and-conditions',

        publisher: {
          '@type': 'Organization',

          name: 'RepWar.live',

          url: 'https://repwar.live',
        },

        about: {
          '@type': 'SoftwareApplication',

          name: 'RepWar.live',

          applicationCategory: 'HealthApplication',
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
