// import { defineStore } from 'pinia'

// function getLocalData() {
//   try {
//     return JSON.parse(localStorage.getItem('homeData')) || null
//   } catch (e) {
//     return null
//   }
// }

// export const useHomeStore = defineStore('home', {
//   state: () => ({
//     homeData: getLocalData(),
//     isLoading: false,
//   }),

//   actions: {
//     async fetchHomeData() {
//       if (this.homeData) return // cache hit

//       this.isLoading = true
//       try {
//         const response = await fetch('your-api-endpoint')
//         const data = await response.json()

//         this.homeData = data
//         localStorage.setItem('homeData', JSON.stringify(data))
//       } catch (error) {
//         console.error('Failed to fetch home data:', error)
//       } finally {
//         this.isLoading = false
//       }
//     },

//     clearCache() {
//       this.homeData = null
//       localStorage.removeItem('homeData')
//     },
//   },
// })
