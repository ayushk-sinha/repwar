<template>
  <div class="read-root">
    <!-- ── LIST VIEW ─────────────────────────────────── -->
    <transition name="slide-up">
      <div v-if="!post" class="list-view">
        <!-- Hero label -->
        <div class="list-hero">
          <p class="list-eyebrow">Latest entries</p>
          <h1 class="list-title">Blogs</h1>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="state-block">
          <div class="spinner" />
          <span class="state-text">Fetching stories…</span>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="state-block error">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span class="state-text">{{ error }}</span>
          <button class="retry-btn" @click="fetchBlogs">Retry</button>
        </div>

        <!-- Empty -->
        <div v-else-if="!blogs.length" class="state-block">
          <span class="state-text">No stories yet. Be the first to write one.</span>
        </div>

        <!-- Blog List -->
        <div v-else class="blog-list">
          <router-link
            v-for="(blog, i) in blogs"
            :key="blog.id"
            :to="`/blog/${blog.slug}`"
            class="block"
          >
            <article class="blog-card" :style="{ '--delay': `${i * 60}ms` }">
              <div class="card-inner">
                <div class="card-meta">
                  <span class="card-date">{{ formatDate(blog.created_at) }}</span>
                  <span class="meta-sep">·</span>
                  <span class="card-read-time">{{ readTime(blog.content) }} min read</span>
                </div>

                <h2 class="card-title">{{ blog.title }}</h2>
                <p class="card-excerpt">{{ excerpt(blog.content) }}</p>

                <div class="card-footer">
                  <div class="author-pill">
                    <span class="author-avatar">{{ initials(blog.author) }}</span>
                    <span class="author-name">{{ blog.author || 'Anonymous' }}</span>
                  </div>
                  <div class="tag-row" v-if="blog.tags?.length">
                    <span v-for="tag in blog.tags.slice(0, 3)" :key="tag" class="tag">{{
                      tag
                    }}</span>
                  </div>
                  <span class="read-arrow">→</span>
                </div>
              </div>
            </article>
          </router-link>
        </div>
      </div>
    </transition>

    <!-- ── ARTICLE VIEW ───────────────────────────────── -->
    <transition name="fade-up">
      <div v-if="post" class="article-view">
        <div class="fixed top-0 left-0 w-full shadow-md">
          <div class="article-topbar">
            <!-- FIX: router.back() with parentheses -->
            <button class="back-btn" @click="router.back()">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back
            </button>
            <span class="article-topbar-date">{{ formatDate(post.created_at) }}</span>
          </div>
        </div>

        <div class="article-container">
          <header class="article-header">
            <div class="article-meta-row">
              <span class="article-eyebrow">{{ post.tags?.[0] ?? 'Essay' }}</span>
              <span class="meta-sep">·</span>
              <span>{{ readTime(post.content) }} min read</span>
            </div>
            <h1 class="article-title">{{ post.title }}</h1>
            <div class="article-byline">
              <span class="author-avatar large">{{ initials(post.author) }}</span>
              <div>
                <p class="byline-name">{{ post.author || 'Anonymous' }}</p>
                <p class="byline-date">{{ formatDateLong(post.created_at) }}</p>
              </div>
            </div>
            <!-- <div class="article-divider">
                <span class="divider-diamond">◆</span>
              </div> -->
          </header>

          <div class="article-body" v-html="renderContent(post.content)" />

          <footer class="article-footer">
            <div class="tag-row footer-tags" v-if="post.tags?.length">
              <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <!-- FIX: router.back() with parentheses -->
            <button class="back-bottom-btn" @click="router.back()">← Back to all stories</button>
          </footer>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import router from '@/router'

const route = useRoute()
const blogs = ref([])
const post = computed(() => blogs.value.find((b) => b.slug === route.params.slug))
const loading = ref(false)
const error = ref(null)

async function fetchBlogs() {
  loading.value = true
  error.value = null
  try {
    const { data, error: err } = await supabase
      .from('sideblogs')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) throw err
    blogs.value = data || []
  } catch (e) {
    error.value = e.message || 'Failed to load blogs'
  } finally {
    loading.value = false
  }
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateLong(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function readTime(content = '') {
  const words = content
    .replace(/<[^>]+>/g, '')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function excerpt(content = '', len = 140) {
  const plain = content.replace(/<[^>]+>/g, '').trim()
  return plain.length > len ? plain.slice(0, len).trimEnd() + '…' : plain
}

function initials(name = '') {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('') || '?'
  )
}

function renderContent(content = '') {
  if (!content.includes('<')) {
    return content
      .split(/\n\n+/)
      .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('')
  }
  return content
}

onMounted(fetchBlogs)
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

.read-root {
  font-family: 'DM Sans', sans-serif;
  color: #e6e1d6;
  min-height: 92vh;
}

/* ── LIST ────────────────────────────── */
.list-view {
  max-width: 780px;
  margin: 0 auto;
  padding: 3.5rem 2rem 6rem;
}

.list-hero {
  margin-bottom: 3rem;
}

.list-eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6ee7b7;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.list-title {
  font-family: 'Lora', serif;
  font-size: 2.2rem;
  font-weight: 500;
  color: #e6e1d6;
  margin: 0;
  line-height: 1.2;
}

.state-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  padding: 4rem 0;
  color: rgba(230, 225, 214, 0.35);
}

.state-block.error {
  color: #f87171;
}
.state-text {
  font-size: 0.9rem;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 2px solid rgba(110, 231, 183, 0.2);
  border-top-color: #6ee7b7;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  margin-top: 0.5rem;
  padding: 0.4rem 1rem;
  border: 1px solid rgba(248, 113, 113, 0.3);
  background: transparent;
  color: #f87171;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}
.retry-btn:hover {
  background: rgba(248, 113, 113, 0.1);
}

.blog-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.blog-card {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  animation: fadeSlideIn 0.4s ease both;
  animation-delay: var(--delay);
}

.blog-card:last-child {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-inner {
  padding: 1.8rem 0;
  transition: padding-left 0.25s ease;
}

.blog-card:hover .card-inner {
  padding-left: 0.75rem;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: rgba(230, 225, 214, 0.35);
  letter-spacing: 0.04em;
  margin-bottom: 0.7rem;
}

.meta-sep {
  opacity: 0.4;
}

.card-title {
  font-family: 'Lora', serif;
  font-size: 1.35rem;
  font-weight: 500;
  color: #e6e1d6;
  margin: 0 0 0.55rem;
  line-height: 1.35;
  transition: color 0.2s;
}

.blog-card:hover .card-title {
  color: #ffffff;
}

.card-excerpt {
  font-size: 0.88rem;
  line-height: 1.65;
  color: rgba(230, 225, 214, 0.5);
  margin: 0 0 1rem;
  max-width: 600px;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.author-pill {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(110, 231, 183, 0.15);
  color: #6ee7b7;
  font-size: 0.6rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0;
  flex-shrink: 0;
}

.author-avatar.large {
  width: 38px;
  height: 38px;
  font-size: 0.75rem;
}

.author-name {
  font-size: 0.78rem;
  color: rgba(230, 225, 214, 0.55);
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tag {
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  border: 1px solid rgba(110, 231, 183, 0.2);
  border-radius: 999px;
  color: rgba(110, 231, 183, 0.7);
  background: rgba(110, 231, 183, 0.05);
}

.read-arrow {
  margin-left: auto;
  font-size: 1rem;
  color: rgba(230, 225, 214, 0.2);
  transition: all 0.25s;
}

.blog-card:hover .read-arrow {
  color: #6ee7b7;
  transform: translateX(4px);
}

/* ── ARTICLE ──────────────────────────── */
.article-view {
  min-height: 100vh;
}

.article-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 57px;
  background: rgba(13, 17, 23, 0.92);
  backdrop-filter: blur(12px);
  z-index: 40;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  background: transparent;
  color: rgba(230, 225, 214, 0.6);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: rgba(110, 231, 183, 0.3);
  color: #6ee7b7;
  background: rgba(110, 231, 183, 0.05);
}

.article-topbar-date {
  font-size: 0.72rem;
  color: rgba(230, 225, 214, 0.3);
  letter-spacing: 0.04em;
}

.article-container {
  max-width: 680px;
  margin: 0 auto;
  padding: 3.5rem 2rem 6rem;
}

.article-header {
  margin-bottom: 2.5rem;
}

.article-meta-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: rgba(110, 231, 183, 0.7);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  font-weight: 500;
}

.article-title {
  font-family: 'Lora', serif;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 500;
  color: #f0ece3;
  line-height: 1.2;
  margin: 0 0 1.5rem;
  letter-spacing: -0.01em;
}

.article-byline {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.byline-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(230, 225, 214, 0.8);
  margin: 0 0 0.15rem;
}

.byline-date {
  font-size: 0.75rem;
  color: rgba(230, 225, 214, 0.35);
  margin: 0;
}

.article-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(110, 231, 183, 0.25);
  font-size: 0.5rem;
  letter-spacing: 0.4em;
}

.divider-diamond {
  color: rgba(110, 231, 183, 0.35);
  font-size: 0.6rem;
}

.article-body {
  font-family: 'Lora', serif;
  font-size: 1.05rem;
  line-height: 1.85;
  color: rgba(230, 225, 214, 0.82);
  letter-spacing: 0.005em;
}

:deep(.article-body p) {
  margin: 0 0 1.5em;
}

:deep(.article-body h1),
:deep(.article-body h2),
:deep(.article-body h3) {
  font-family: 'Lora', serif;
  color: #f0ece3;
  margin: 2.2em 0 0.7em;
  font-weight: 500;
}

:deep(.article-body h2) {
  font-size: 1.45rem;
}
:deep(.article-body h3) {
  font-size: 1.15rem;
  font-style: italic;
}

:deep(.article-body blockquote) {
  border-left: 2px solid rgba(110, 231, 183, 0.4);
  margin: 2em 0;
  padding: 0.25rem 0 0.25rem 1.5rem;
  color: rgba(230, 225, 214, 0.6);
  font-style: italic;
}

:deep(.article-body code) {
  background: rgba(255, 255, 255, 0.06);
  padding: 0.15em 0.45em;
  border-radius: 4px;
  font-size: 0.88em;
  font-family: 'JetBrains Mono', monospace;
}

:deep(.article-body pre) {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  padding: 1.2rem 1.4rem;
  overflow-x: auto;
  margin: 1.5em 0;
}

:deep(.article-body a) {
  color: #6ee7b7;
  text-decoration: underline;
  text-decoration-color: rgba(110, 231, 183, 0.3);
  text-underline-offset: 3px;
}

:deep(.article-body ul),
:deep(.article-body ol) {
  padding-left: 1.4rem;
  margin: 0 0 1.5em;
}

:deep(.article-body li) {
  margin-bottom: 0.4em;
}

.article-footer {
  margin-top: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.footer-tags {
  margin-bottom: 0.25rem;
}

.back-bottom-btn {
  align-self: flex-start;
  background: transparent;
  border: none;
  color: rgba(230, 225, 214, 0.35);
  font-size: 0.82rem;
  cursor: pointer;
  padding: 0;
  font-family: 'DM Sans', sans-serif;
  transition: color 0.2s;
}

.back-bottom-btn:hover {
  color: #6ee7b7;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-up-leave-to {
  opacity: 0;
}
</style>
