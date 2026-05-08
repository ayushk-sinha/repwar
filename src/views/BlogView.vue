<template>
  <div class="blog-shell">
    <div class="blog-header">
      <div class="blog-wordmark">
        <span class="wordmark-dot" />
        <span class="wordmark-text text-[10px] md:text-2xl">The Journal</span>
        <router-link to="/"
          ><span class="wordmark-text text-[10px] md:text-2xl">| Home</span></router-link
        >
      </div>

      <nav class="blog-nav">
        <button
          class="nav-btn"
          :class="{ active: activeComponent === ReadBlog }"
          @click="activeComponent = ReadBlog"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          Read
        </button>
        <!-- <button
          class="nav-btn"
          :class="{ active: activeComponent === PostBlog }"
          @click="activeComponent = PostBlog"
          disabled
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class=""
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Write
        </button> -->
      </nav>
    </div>

    <div class="blog-body">
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReadBlog from '@/BlogComponents/ReadBlog.vue'
// import PostBlog from '@/BlogComponents/PostBlog.vue'

const activeComponent = ref(ReadBlog)
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
