<template>
  <div class="blog-shell">
    <SideNavBar />
    <div class="blog-body">
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { markRaw } from 'vue'
import SideBarBlogRead from '@/components/SideBarBlogRead.vue'
import SideNavBar from '@/components/SideNavBar.vue'
// import PostBlog from '@/BlogComponents/PostBlog.vue'

const activeComponent = ref(markRaw(SideBarBlogRead))
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
