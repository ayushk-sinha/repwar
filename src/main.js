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
import { createHead } from '@vueuse/head'

import App from './App.vue'
import router from './router'

import { getDynamicRoutes } from './prerender'

const head = createHead()

export const createApp = ViteSSG(
  App,

  {
    routes: router.options.routes,

    async includedRoutes(paths) {
      const dynamicRoutes = await getDynamicRoutes()

      return [...paths, ...dynamicRoutes]
    },
  },

  ({ app }) => {
    app.use(head)
  },
)
