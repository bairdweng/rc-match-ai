import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SearchResults from '../components/SearchResults.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router