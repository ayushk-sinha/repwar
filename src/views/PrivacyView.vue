<template>
  <div class="app-shell">
    <!-- Sidebar -->
    <div class="fixed-sidebar">
      <SideNavBar />
    </div>

    <!-- Hero Section -->
    <section class="hero-section mt-10">
      <div class="hero-inner">
        <div class="hero-badge" grid grid-col-2>
          <span class="badge-dot"></span>
          Privacy Policy

          <img src="@/components/icons/pushuplogow.png" alt="RepWar Logo" class="hero-logo" />
        </div>

        <h1 class="hero-title">Your Data. Your Control.</h1>

        <p class="hero-sub">
          We respect your privacy and are committed to protecting your personal data while you use
          RepWar.
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="ranklist-section">
      <div class="modal-box animate-up overflow-y-auto [scrollbar-width:none]">
        <!-- Introduction -->
        <span class="hero-badge">Read from here</span>
        <div class="modal-head">
          <h2 class="modal-title">Introduction</h2>
        </div>
        <p class="hero-sub">
          At <strong>repWar.live</strong>, your privacy matters. This policy explains how we
          collect, use, and protect your information when you interact with our fitness tools, AI
          tracking system, and leaderboard features.
        </p>

        <br />

        <!-- Data Collection -->
        <div class="modal-head">
          <h2 class="modal-title">What We Collect</h2>
        </div>

        <p class="hero-sub">
          When you use RepWar, we may collect certain information to provide a smooth and fair
          experience:
        </p>

        <br />

        <div class="actions-grid">
          <div class="action-btn">
            <div class="action-icon">👤</div>
            <div class="action-label">
              <strong>User Information</strong><br />
              Your name, email, and optional Instagram link when submitting leaderboard scores.
            </div>
          </div>

          <div class="action-btn">
            <div class="action-icon">🖼️</div>
            <div class="action-label">
              <strong>Media Uploads</strong><br />
              Custom avatars you upload are securely stored in our database.
            </div>
          </div>

          <div class="action-btn">
            <div class="action-icon">📱</div>
            <div class="action-label">
              <strong>Device Identification</strong><br />
              Unique device IDs help prevent duplicate entries and maintain leaderboard fairness.
            </div>
          </div>

          <div class="action-btn">
            <div class="action-icon">🍪</div>
            <div class="action-label">
              <strong>Cookies</strong><br />
              Used to improve functionality and deliver relevant experiences.
            </div>
          </div>
        </div>

        <br />

        <!-- Third Party -->
        <div class="modal-head">
          <h2 class="modal-title">Third-Party Services</h2>
        </div>

        <p class="hero-sub">
          We use trusted third-party services like Google AdSense to display advertisements. Google
          may use cookies to show ads based on your previous visits to this or other websites.
        </p>

        <br />

        <!-- Opt Out -->
        <div class="modal-head">
          <h2 class="modal-title">Your Choices</h2>
        </div>

        <p class="hero-sub">
          You have control over your data. You can opt out of personalized advertising anytime by
          visiting Google’s Ads Settings.
        </p>

        <br />

        <!-- Closing -->
        <div class="modal-head">
          <h2 class="modal-title">Final Note</h2>
        </div>

        <p class="hero-sub">
          We do not sell your personal data. Everything we collect is used to improve your
          experience, ensure fair competition, and keep RepWar running smoothly.
        </p>
        <span class="app-footer">Mail us @sinha.ayush2406@gmail.com to remove your data</span>
      </div>
    </section>

    <!-- Footer -->
    <footer class="app-footer">
      <span>REPWAR</span>
      <span class="footer-dot"></span>
      <span>PRIVACY FIRST</span>
    </footer>
  </div>
</template>

<script setup>
import SideNavBar from '@/components/SideNavBar.vue'
import { useHead } from '@vueuse/head'

useHead({
  title: 'Privacy Policy | RepWar.live',

  meta: [
    /* ------------------------------------------------ */
    /* Basic SEO */
    /* ------------------------------------------------ */

    {
      name: 'description',
      content:
        'Read the official RepWar.live Privacy Policy explaining how user data, leaderboard submissions, cookies, device IDs, and fitness information are collected and protected.',
    },

    {
      name: 'keywords',
      content:
        'RepWar privacy policy, fitness app privacy, AI workout tracker privacy, leaderboard privacy, cookies policy, user data protection',
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
      content: 'Privacy Policy | RepWar.live',
    },

    {
      property: 'og:description',
      content:
        'Learn how RepWar.live collects, stores, and protects your data while using our AI fitness tracking platform.',
    },

    {
      property: 'og:url',
      content: 'https://repwar.live/Privacy-Policy',
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
      content: 'RepWar.live Privacy Policy',
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
      content: 'Privacy Policy | RepWar.live',
    },

    {
      name: 'twitter:description',
      content:
        'Read how RepWar.live handles and protects your personal data and fitness activity information.',
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
      href: 'https://repwar.live/Privacy-Policy',
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

        '@type': 'PrivacyPolicy',

        name: 'RepWar.live Privacy Policy',

        description:
          'Official privacy policy for RepWar.live explaining data collection, cookies, leaderboard submissions, and user protection.',

        url: 'https://repwar.live/Privacy-Policy',

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

.app-shell {
  min-height: 100vh;
  background: #0a0d12;
  font-family: 'DM Sans', sans-serif;
  color: #e6e1d6;
}

/* ── Hero ─────────────────────────────── */
.hero-section {
  padding: 3rem 1.5rem 2.5rem;
  text-align: center;
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  background: rgba(110, 231, 183, 0.08);
  border: 1px solid rgba(110, 231, 183, 0.2);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6ee7b7;
  font-weight: 500;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6ee7b7;
  animation: pulse 2s ease infinite;
}
.fixed-sidebar {
  z-index: 20;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}
.scrolltext {
  text-align: center;
  display: inline-flex;
  align-items: center;
}

.hero-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  margin-top: 0rem;
  animation: pulse 2s ease infinite;
}

.hero-title {
  font-family: 'Lora', serif;
  font-size: 2.4rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: #f0ece3;
  margin: 0;
  line-height: 1.1;
}

.hero-sub {
  font-size: 0.85rem;
  color: rgba(230, 225, 214, 0.4);
  margin: 0;
  line-height: 1.5;
}

/* ── Actions ──────────────────────────── */
.actions-section {
  padding: 0 1.5rem 2rem;
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
}

.action-btn,
.blog-link-btn {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 1rem 1.1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: rgba(230, 225, 214, 0.75);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 400;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.22s ease;
}

.action-btn:hover,
.blog-link-btn:hover {
  background: rgba(110, 231, 183, 0.06);
  border-color: rgba(110, 231, 183, 0.2);
  color: #e6e1d6;
}

.action-icon {
  color: rgba(110, 231, 183, 0.6);
  flex-shrink: 0;
  display: flex;
}

.action-label {
  flex: 1;
  text-align: left;
}

.action-arrow {
  margin-left: auto;
  font-size: 0.9rem;
  color: rgba(230, 225, 214, 0.2);
  transition: all 0.22s;
}

.action-btn:hover .action-arrow,
.blog-link-btn:hover .action-arrow {
  color: #6ee7b7;
  transform: translateX(3px);
}

.blog-badge {
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(110, 231, 183, 0.08);
  border: 1px solid rgba(110, 231, 183, 0.2);
  color: rgba(110, 231, 183, 0.7);
}

/* ── Ranklist ─────────────────────────── */
.ranklist-section {
  padding: 0 1.5rem 3rem;
  max-width: 520px;
  margin: 0 auto;
}

/* ── Modals ───────────────────────────── */
.modal-backdrop {
  z-index: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-box {
  width: 100%;
  max-width: 520px;
  max-height: 60vh;
  background: #0f1419;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
}

.modal-box.modal-wide {
  max-width: 560px;
}

.modal-box-bare {
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(230, 225, 214, 0.5);
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e6e1d6;
}

.modal-close-bare {
  position: absolute;
  top: -1rem;
  right: -1rem;
  z-index: 10;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #0f1419;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(230, 225, 214, 0.6);
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-head {
  margin-bottom: 1.25rem;
  padding-right: 2.5rem;
}

.modal-title {
  font-family: 'Lora', serif;
  font-size: 1.3rem;
  font-weight: 500;
  color: #f0ece3;
  margin: 0 0 0.25rem;
}

.modal-sub {
  font-size: 0.78rem;
  color: rgba(230, 225, 214, 0.35);
  margin: 0;
}

/* ── Footer ───────────────────────────── */
.app-footer {
  padding: 2rem;
  text-align: center;
  font-size: 0.72rem;
  color: rgba(230, 225, 214, 0.2);
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.footer-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(110, 231, 183, 0.4);
  display: inline-block;
}

/* ── Transitions ──────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-up {
  animation: slideUp 0.28s cubic-bezier(0.34, 1.2, 0.64, 1);
}
</style>
