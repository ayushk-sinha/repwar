<template>
  <div class="blog-shell">
    <SideNavBar />
    <div class="blog-body">
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import { useHead } from '@vueuse/head'

import SideBarBlogRead from '@/components/SideBarBlogRead.vue'
import SideNavBar from '@/components/SideNavBar.vue'

/* ------------------------------------------------ */
/* Avoid Reactive Component Warning */
/* ------------------------------------------------ */

const activeComponent = ref(markRaw(SideBarBlogRead))

/* ------------------------------------------------ */
/* SEO */
/* ------------------------------------------------ */

useHead({
  title: 'Fitness Stories & Guides | RepWar.live',

  meta: [
    /* ------------------------------------------------ */
    /* Basic SEO */
    /* ------------------------------------------------ */

    {
      name: 'description',
      content:
        'Explore fitness stories, workout guides, BMI insights, AI pushup training articles, and motivational content from RepWar.live.',
    },

    {
      name: 'keywords',
      content:
        'fitness stories, workout blog, pushup guides, AI workout tracker, BMI articles, fitness motivation, bodyweight training, repwar blog',
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
      content: 'Fitness Stories & Guides | RepWar.live',
    },

    {
      property: 'og:description',
      content:
        'Read fitness stories, workout insights, AI pushup training tips, and motivational content from RepWar.live.',
    },

    {
      property: 'og:url',
      content: 'https://repwar.live/blogs-page',
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
      content: 'RepWar.live Fitness Stories',
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
      content: 'Fitness Stories & Guides | RepWar.live',
    },

    {
      name: 'twitter:description',
      content:
        'Explore workout guides, motivational fitness stories, and AI fitness insights from RepWar.live.',
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
      href: 'https://repwar.live/blogs-page',
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

        '@type': 'Blog',

        name: 'RepWar.live Fitness Stories',

        description:
          'Fitness stories, workout guides, and motivational training content from RepWar.live.',

        url: 'https://repwar.live/blogs-page',

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

.blog-shell {
  min-height: 50vh;
  background: #0d1117;
  font-family: 'DM Sans', sans-serif;
  color: #e6e1d6;
}

.blog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(13, 17, 23, 0.92);
  backdrop-filter: blur(12px);
}

.blog-wordmark {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.wordmark-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6ee7b7;
  display: inline-block;
}

.wordmark-text {
  font-family: 'Lora', serif;
  align-items: center;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #e6e1d6;
}

.blog-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 999px;
  padding: 0.25rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1.1rem;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: rgba(230, 225, 214, 0.45);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  color: #e6e1d6;
  background: rgba(255, 255, 255, 0.05);
}

.nav-btn.active {
  background: rgba(110, 231, 183, 0.12);
  color: #6ee7b7;
  font-weight: 500;
}

.blog-body {
  padding: 0;
}
</style>
