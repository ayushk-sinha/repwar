<!-- SideNavBar.vue -->
<template>
  <div>
    <!-- Top Navbar -->
    <div class="fixed top-0 left-0 w-full shadow-md">
      <header class="navbar">
        <div class="navbar-brand">
          <img src="@/components/icons/pushuplogow.png" alt="logo" class="brand-logo" />
          <span class="brand-name">repWar</span>
          <span class="brand-dot" />
        </div>

        <button @click="toggleSidebar" class="menu-btn" :class="{ active: isOpen }">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </header>
    </div>

    <!-- Overlay -->
    <transition name="overlay-fade">
      <div v-if="isOpen" @click="toggleSidebar" class="sidebar-overlay" />
    </transition>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: isOpen }">
      <!-- Sidebar Header -->
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <span class="wordmark-dot" />
          <span class="sidebar-title">repWar</span>
        </div>
        <button @click="toggleSidebar" class="sidebar-close">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Nav Links -->
      <nav class="sidebar-nav">
        <a
          v-for="item in navItems"
          :key="item.label"
          :href="item.href"
          class="nav-item"
          @click="toggleSidebar"
        >
          <span class="nav-icon" v-html="item.icon" />
          <span class="nav-label">{{ item.label }}</span>
          <span class="nav-arrow">→</span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <p class="sidebar-tagline">Push your limits.</p>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
  {
    label: 'About Us',
    href: '/About-Us',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
							<path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"/></svg>`,
  },
  {
    label: 'Privacy Policy',
    href: 'Privacy-Policy',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
							<path d="M18.344,16.174l-7.98-12.856c-0.172-0.288-0.586-0.288-0.758,0L1.627,16.217c0.339-0.543-0.603,0.668,0.384,0.682h15.991C18.893,16.891,18.167,15.961,18.344,16.174 M2.789,16.008l7.196-11.6l7.224,11.6H2.789z M10.455,7.552v3.561c0,0.244-0.199,0.445-0.443,0.445s-0.443-0.201-0.443-0.445V7.552c0-0.245,0.199-0.445,0.443-0.445S10.455,7.307,10.455,7.552M10.012,12.439c-0.733,0-1.33,0.6-1.33,1.336s0.597,1.336,1.33,1.336c0.734,0,1.33-0.6,1.33-1.336S10.746,12.439,10.012,12.439M10.012,14.221c-0.244,0-0.443-0.199-0.443-0.445c0-0.244,0.199-0.445,0.443-0.445s0.443,0.201,0.443,0.445C10.455,14.021,10.256,14.221,10.012,14.221"/></svg>`,
  },
  {
    label: 'Contact Us',
    href: '/Contact-Us',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
							<path d="M17.388,4.751H2.613c-0.213,0-0.389,0.175-0.389,0.389v9.72c0,0.216,0.175,0.389,0.389,0.389h14.775c0.214,0,0.389-0.173,0.389-0.389v-9.72C17.776,4.926,17.602,4.751,17.388,4.751 M16.448,5.53L10,11.984L3.552,5.53H16.448zM3.002,6.081l3.921,3.925l-3.921,3.925V6.081z M3.56,14.471l3.914-3.916l2.253,2.253c0.153,0.153,0.395,0.153,0.548,0l2.253-2.253l3.913,3.916H3.56z M16.999,13.931l-3.921-3.925l3.921-3.925V13.931z"/></svg>`,
  },
  {
    label: 'Terms & Conditions',
    href: '/terms-and-conditions',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
							<path d="M17.592,8.936l-6.531-6.534c-0.593-0.631-0.751-0.245-0.751,0.056l0.002,2.999L5.427,9.075H2.491c-0.839,0-0.162,0.901-0.311,0.752l3.683,3.678l-3.081,3.108c-0.17,0.171-0.17,0.449,0,0.62c0.169,0.17,0.448,0.17,0.618,0l3.098-3.093l3.675,3.685c-0.099-0.099,0.773,0.474,0.773-0.296v-2.965l3.601-4.872l2.734-0.005C17.73,9.688,18.326,9.669,17.592,8.936 M3.534,9.904h1.906l4.659,4.66v1.906L3.534,9.904z M10.522,13.717L6.287,9.48l4.325-3.124l3.088,3.124L10.522,13.717z M14.335,8.845l-3.177-3.177V3.762l5.083,5.083H14.335z"/></svg>`,
  },
  {
    label: 'Health Disclaimer',
    href: '/health-disclaimer',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
							<path d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"/></svg>`,
  },
  {
    label: 'Blogs',
    href: '/blogs-page',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=".8">
							<path d="M8.63 7.89c-.13.5-.75.22-.5.29L4.12 7.14a.4.4 0 1 1 .2-.78l4.01 1.04c.22.06.35.28.3.49zm-.29 2.24L4.32 9.09a.4.4 0 1 0-.2.78l4.01 1.04c-.26-.06.37.19.5-.29.06-.22-.08-.44-.29-.49zm-1.2 2.38-2.81-.73a.4.4 0 1 0-.2.78l2.81.73c-.27-.06.37.19.5-.29.06-.22-.08-.44-.3-.49zM18.16 3.68v10.7a.4.4 0 0 1-.3.39l-7.76 1.95a.6.6 0 0 1-.2 0L2.15 14.77a.4.4 0 0 1-.3-.39V3.68c0-.27.25-.46.51-.4l7.65 1.92 7.65-1.92c.26-.06.5.13.5.4zM9.59 5.94 2.66 4.2v9.86l6.93 1.74zm7.75-1.74-6.94 1.74v9.86l6.94-1.74zM16.17 6.65a.4.4 0 0 0-.5-.29l-4.01 1.04a.4.4 0 1 0 .2.78l4.01-1.04c.22-.06.35-.28.3-.49zm0 2.73a.4.4 0 0 0-.5-.29l-4.01 1.04a.4.4 0 1 0 .2.78l4.01-1.04c.22-.06.35-.28.3-.49zm-1.2 3.01a.4.4 0 0 0-.5-.29l-2.81.73a.4.4 0 1 0 .2.78l2.81-.73c.22-.06.35-.28.3-.49"/></svg>`,
  },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

/* ── Navbar ───────────────────────────── */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: rgba(10, 13, 18, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: sticky;
  top: 0;
  z-index: 999;
  backdrop-filter: blur(12px);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.brand-logo {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.brand-name {
  font-family: 'Lora', serif;
  font-size: 1.1rem;
  font-weight: 500;
  color: #f0ece3;
  letter-spacing: 0.01em;
}

.brand-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #6ee7b7;
  animation: pulse 2.5s ease infinite;
  margin-left: 2px;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.menu-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: rgba(230, 225, 214, 0.6);
  cursor: pointer;
  transition: all 0.2s;
}

.menu-btn:hover,
.menu-btn.active {
  background: rgba(110, 231, 183, 0.08);
  border-color: rgba(110, 231, 183, 0.2);
  color: #6ee7b7;
}

/* ── Overlay ──────────────────────────── */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 40;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* ── Sidebar ──────────────────────────── */
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 50;
  height: 100%;
  width: 260px;
  background: #0f1419;
  border-left: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: -24px 0 60px rgba(0, 0, 0, 0.5);
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-brand {
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

.sidebar-title {
  font-family: 'Lora', serif;
  font-size: 1rem;
  font-weight: 500;
  color: #e6e1d6;
}

.sidebar-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: rgba(230, 225, 214, 0.4);
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar-close:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e6e1d6;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.85rem;
  border-radius: 10px;
  text-decoration: none;
  color: rgba(230, 225, 214, 0.55);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(110, 231, 183, 0.06);
  color: #e6e1d6;
}

.nav-icon {
  color: rgba(110, 231, 183, 0.5);
  display: flex;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
}

.nav-arrow {
  font-size: 0.8rem;
  color: rgba(230, 225, 214, 0.15);
  transition: all 0.2s;
}

.nav-item:hover .nav-arrow {
  color: #6ee7b7;
  transform: translateX(3px);
}

.sidebar-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-tagline {
  font-family: 'Lora', serif;
  font-size: 0.8rem;
  font-style: italic;
  color: rgba(230, 225, 214, 0.2);
  margin: 0;
}
</style>
