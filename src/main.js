// // import './assets/main.css'

// import { createApp } from 'vue'
// // import { createPinia } from 'pinia'

// import App from './App.vue'
// import router from './router'

// //import { createHead } from '@unhead/vue/server'

// const app = createApp(App)
// //const head = createHead()
// //app.use(head)
// // app.use(createPinia())
// app.use(router)
// app.mount('#app')

import { ViteSSG } from 'vite-ssg'

import App from './App.vue'
import router from './router'

import { getDynamicRoutes } from './prerender'

export const createApp = ViteSSG(App, {
  routes: router.options.routes,

  async includedRoutes(paths, routes) {
    const dynamicRoutes = await getDynamicRoutes()

    return [...paths, ...dynamicRoutes]
  },
})
