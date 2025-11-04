import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SearchResults from '../components/SearchResults.vue'
import { trackPageView } from '../utils/analytics.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'RC Match AI - 主页'
    }
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults,
    props: true,
    meta: {
      title: 'RC Match AI - 搜索结果'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由导航守卫，用于页面浏览跟踪
router.afterEach((to, from) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 跟踪页面浏览
  trackPageView(to.meta.title || 'RC Match AI', to.path)
})

export default router