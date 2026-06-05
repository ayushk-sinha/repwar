import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

/* ------------------------------------------------ */
/* Lazy Loaded Views */
/* ------------------------------------------------ */

const HomeView = () => import('@/views/HomeView.vue')

const BlogView = () => import('@/views/BlogView.vue')

const ReadBlog = () => import('@/BlogComponents/ReadBlog.vue')

const AboutView = () => import('@/views/AboutView.vue')

const PrivacyView = () => import('@/views/PrivacyView.vue')

const ContactView = () => import('@/views/ContactView.vue')

const TermsView = () => import('@/views/TermsView.vue')

const DisclaimerView = () => import('@/views/DisclaimerView.vue')

const SideBarBlogView = () => import('@/views/SideBarBlogView.vue')

/* ------------------------------------------------ */
/* Heavy / Admin Pages */
/* ------------------------------------------------ */

const PostBlog = () => import('@/BlogComponents/PostBlog.vue')

const PostSideView = () => import('@/views/PostSideView.vue')
const sampleview = () => import('@/views/blogs/sampleview.vue')
const pushupsblogView = () => import('@/views/blogs/PushupsblogView.vue')

/* ------------------------------------------------ */
/* Router */
/* ------------------------------------------------ */

const router = createRouter({
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(import.meta.env.BASE_URL),

  routes: [
    /* ------------------------------------------ */
    /* Home */
    /* ------------------------------------------ */

    {
      path: '/',

      name: 'HomeView',

      component: HomeView,
    },

    /* ------------------------------------------ */
    /* Main Blog */
    /* ------------------------------------------ */

    {
      path: '/blog',

      name: 'blogpage',

      component: BlogView,
    },

    {
      path: '/blog/:slug',

      name: 'readBlog',

      component: ReadBlog,

      props: true,
    },

    /* ------------------------------------------ */
    /* Static Pages */
    /* ------------------------------------------ */

    {
      path: '/About-Us',

      name: 'AboutUs',

      component: AboutView,
    },
    {
      path: '/sampleview',

      name: 'sampleview',

      component: sampleview,
    },
    {
      path: '/50-pushups-a-day-benefits',
      name: 'pushupsblogView',
      component: pushupsblogView,
      meta: {
        title: '50 pushups a day: 7 Proven Things That Happen to Your Body',
        description:
          'Discover the 7 scientifically backed changes that happen when you do 30 push-ups every day — from heart health and bone density to blood sugar control and brain protection.',
        canonical: 'https://repwar.live/50-pushups-a-day-benefits',
        ogImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80',
        ogType: 'article',
        publishDate: '2025-06-01',
        articleSection: 'Fitness Science',
        keywords:
          '50 push-ups a day, push-up benefits, daily push-ups results, push-ups heart health, bodyweight exercise benefits',
        prerender: true,
        breadcrumbs: [
          { name: 'Home', url: 'https://repwar.live' },
          { name: 'Blog', url: 'https://repwar.live/blogs' },
          {
            name: '50 Push-Ups a Day: 7 Proven Things',
            url: 'https://repwar.live/50-pushups-a-day-benefits',
          },
        ],
      },
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

      name: 'TermsConditions',

      component: TermsView,
    },

    {
      path: '/health-disclaimer',

      name: 'HealthDisclaimer',

      component: DisclaimerView,
    },

    /* ------------------------------------------ */
    /* Side Blogs */
    /* ------------------------------------------ */

    {
      path: '/blogs-page',

      name: 'Blogs',

      component: SideBarBlogView,
    },

    {
      path: '/blogs-page/:slug',

      name: 'sideblogread',

      component: SideBarBlogView,

      props: true,
    },

    /* ------------------------------------------ */
    /* Admin / Editor */
    /* ------------------------------------------ */

    {
      path: '/Post-blog',

      name: 'PostBlog',

      component: PostBlog,

      meta: {
        noindex: true,
      },
    },

    {
      path: '/Post-blog-side',

      name: 'PostBlogSide',

      component: PostSideView,

      meta: {
        noindex: true,
      },
    },
  ],

  /* -------------------------------------------- */
  /* Better Scroll Behavior */
  /* -------------------------------------------- */

  scrollBehavior() {
    return {
      top: 0,

      behavior: 'smooth',
    }
  },
})

export default router
