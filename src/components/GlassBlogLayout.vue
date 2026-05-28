<!-- components/GlassBlogLayout.vue -->
<template>
  <div class="blog-wrapper">
    <!-- Floating background -->
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>

    <!-- Hero -->
    <section class="hero-glass">
      <div class="hero-content">
        <p class="category">{{ category }}</p>

        <h1 class="blog-title">
          {{ title }}
        </h1>

        <p class="blog-subtitle">
          {{ subtitle }}
        </p>

        <div class="meta-row">
          <span>✍ {{ author }}</span>
          <span>•</span>
          <span>📅 {{ publishDate }}</span>
          <span>•</span>

          <!-- Mandatory SEO last updated -->
          <span class="updated"> 🔄 Last Updated: {{ lastUpdated }} </span>
        </div>
      </div>
    </section>

    <!-- Main Blog -->
    <main class="blog-container">
      <!-- Left TOC -->
      <aside class="toc-glass">
        <h3>Contents</h3>

        <a v-for="(item, index) in tableOfContents" :key="index" :href="'#' + item.id">
          {{ item.title }}
        </a>
      </aside>

      <!-- Blog Content -->
      <article class="content-area">
        <section
          v-for="(section, index) in sections"
          :key="index"
          :id="section.id"
          class="glass-card"
        >
          <div class="card-glow"></div>

          <h2>{{ section.heading }}</h2>

          <p v-for="(para, pIndex) in section.paragraphs" :key="pIndex">
            {{ para }}
          </p>

          <img v-if="section.image" :src="section.image" class="blog-image" alt="blog visual" />
        </section>
      </article>

      <!-- Right side sticky -->
      <aside class="sticky-side">
        <div class="glass-small">
          <h4>Quick Tip</h4>
          <p>{{ sideTip }}</p>
        </div>

        <div class="glass-small">
          <h4>Read Time</h4>
          <p>{{ readTime }}</p>
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  category: String,
  author: String,
  publishDate: String,
  lastUpdated: String,
  readTime: String,
  sideTip: String,
  sections: Array,
  tableOfContents: Array,
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

.blog-wrapper {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.06), transparent 30%),
    radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.05), transparent 30%), #111111;

  color: white;
  padding: 30px 20px 100px;
  overflow: hidden;
  position: relative;
  font-family: 'Poppins', sans-serif;
}

/* Floating background */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  z-index: 0;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: white;
  top: -100px;
  left: -100px;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: #777;
  right: -100px;
  bottom: -100px;
}

/* Hero */
.hero-glass {
  max-width: 1100px;
  margin: auto;
  margin-bottom: 50px;
  position: relative;
  z-index: 2;
}

.hero-content {
  backdrop-filter: blur(22px);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 32px;
  padding: 60px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.35),
    inset 0 1px 1px rgba(255, 255, 255, 0.08);
}

.category {
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 12px;
}

.blog-title {
  font-size: 52px;
  line-height: 1.1;
  margin-bottom: 20px;
  font-weight: 700;
}

.blog-subtitle {
  font-size: 18px;
  line-height: 1.8;
  opacity: 0.85;
  max-width: 800px;
}

.meta-row {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 14px;
  opacity: 0.8;
}

.updated {
  color: #d5d5d5;
}

/* Layout */
.blog-container {
  max-width: 1400px;
  margin: auto;
  display: grid;
  grid-template-columns: 240px 1fr 250px;
  gap: 28px;
  position: relative;
  z-index: 2;
}

/* TOC */
.toc-glass {
  position: sticky;
  top: 20px;
  height: fit-content;
  padding: 24px;
  border-radius: 24px;
  backdrop-filter: blur(18px);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.toc-glass h3 {
  margin-bottom: 20px;
}

.toc-glass a {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  margin-bottom: 14px;
  transition: 0.3s;
}

.toc-glass a:hover {
  transform: translateX(6px);
  color: white;
}

/* Main content */
.content-area {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Glass cards */
.glass-card {
  position: relative;
  overflow: hidden;
  padding: 42px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(18px);

  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.35),
    inset 0 1px 1px rgba(255, 255, 255, 0.05);

  transition: all 0.4s ease;
}

.glass-card:hover {
  transform: translateY(-8px) scale(1.01);
  border-color: rgba(255, 255, 255, 0.22);
}

.card-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    transparent,
    rgba(255, 255, 255, 0.03)
  );
  pointer-events: none;
}

.glass-card h2 {
  font-size: 34px;
  margin-bottom: 24px;
  line-height: 1.2;
}

.glass-card p {
  line-height: 2;
  font-size: 17px;
  color: rgba(255, 255, 255, 0.88);
  margin-bottom: 18px;
}

.blog-image {
  width: 100%;
  border-radius: 24px;
  margin-top: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Right side */
.sticky-side {
  position: sticky;
  top: 20px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.glass-small {
  padding: 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
}

.glass-small h4 {
  margin-bottom: 10px;
}

/* Responsive */
@media (max-width: 1200px) {
  .blog-container {
    grid-template-columns: 1fr;
  }

  .toc-glass,
  .sticky-side {
    display: none;
  }
}

@media (max-width: 768px) {
  .hero-content {
    padding: 32px 24px;
  }

  .glass-card {
    padding: 28px 22px;
    border-radius: 26px;
  }

  .blog-title {
    font-size: 34px;
  }

  .glass-card h2 {
    font-size: 26px;
  }

  .glass-card p {
    font-size: 16px;
    line-height: 1.9;
  }
}
</style>
