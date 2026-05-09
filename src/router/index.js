import App from '@/App.vue'
import { createMemoryHistory } from 'vue-router'
import BlogView from '@/views/BlogView.vue'
import ReadBlog from '@/BlogComponents/ReadBlog.vue'
import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '@/views/AboutView.vue'
import PrivacyView from '@/views/PrivacyView.vue'
import ContactView from '@/views/ContactView.vue'
import TermsView from '@/views/TermsView.vue'
import DisclaimerView from '@/views/DisclaimerView.vue'
import HomeView from '@/views/HomeView.vue'
import SideBarBlogView from '@/views/SideBarBlogView.vue'
import PostBlog from '@/BlogComponents/PostBlog.vue'
import PostSideView from '@/views/PostSideView.vue'

const router = createRouter({
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomeView',
      component: HomeView,
    },
    {
      path: '/blog',
      name: 'blogpage',
      component: BlogView,
    },
    {
      path: '/blog/:slug', // ✅ IMPORTANT
      name: 'readBlog',
      component: ReadBlog,
      props: true, // passes slug as prop
    },
    {
      path: '/About-Us',
      name: 'AboutUs',
      component: AboutView,
    },
    {
      path: '/Privacy-Policy',
      name: 'PrivacyPolicy',
      component: PrivacyView,
    },
    {
      path: '/Contact-Us',
      name: 'ContactUs',
      component: ContactView,
    },
    {
      path: '/terms-and-conditions',
      name: 'Terms & Conditions',
      component: TermsView,
    },
    {
      path: '/health-disclaimer',
      name: 'Health Disclaimer',
      component: DisclaimerView,
    },
    {
      path: '/blogs-page',
      name: 'Blogs',
      component: SideBarBlogView,
    },
    {
      path: '/Post-blog',
      name: 'Post Blogs',
      component: PostBlog,
    },
    {
      path: '/Post-blog-side',
      name: 'Post Blogs side',
      component: PostSideView,
    },
  ],
})

export default router
