import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SearchResults from '../components/SearchResults.vue'
import { trackPageView } from '../utils/analytics.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'RC Match AI - Intelligent RC Model Upgrade Parts Finder',
      description: 'AI-powered platform for finding the perfect upgrade parts for your RC models. Smart matching technology for RC cars, drones, and helicopters.'
    }
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults,
    props: true,
    meta: {
      title: 'RC Upgrade Parts Search Results - RC Match AI',
      description: 'Find the best upgrade parts for your RC model. Browse verified parts with AI-powered recommendations.'
    }
  },
  {
    path: '/search/:brand/:model',
    name: 'BrandModelSearch',
    component: SearchResults,
    props: true,
    meta: {
      title: 'RC Upgrade Parts Search Results - RC Match AI',
      description: 'Find the best upgrade parts for your RC model. Browse verified parts with AI-powered recommendations.'
    }
  },
  {
    path: '/models/:modelId',
    name: 'ModelDetails',
    component: SearchResults,
    props: true,
    meta: {
      title: 'RC Model Upgrade Parts - RC Match AI',
      description: 'Upgrade parts specifically matched for your RC model. Improve performance and reliability.'
    }
  },
  {
    path: '/parts/:partId',
    name: 'PartDetails',
    component: SearchResults,
    props: true,
    meta: {
      title: 'RC Upgrade Part Details - RC Match AI',
      description: 'Detailed information about RC upgrade parts. Compatibility, specifications, and installation guides.'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: Home,
    meta: {
      title: 'Page Not Found - RC Match AI',
      description: 'The page you are looking for does not exist. Return to RC Match AI home page.'
    }
  }
]

const router = createRouter({
  history: createWebHistory('/aircmate/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由导航守卫，用于页面浏览跟踪和SEO优化
router.afterEach((to, from) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 更新meta description
  const descriptionMeta = document.querySelector('meta[name="description"]')
  if (descriptionMeta && to.meta.description) {
    descriptionMeta.setAttribute('content', to.meta.description)
  }
  
  // 更新canonical URL
  const canonicalLink = document.querySelector('link[rel="canonical"]')
  if (canonicalLink) {
    const baseUrl = 'https://bairdweng.github.io/aircmate'
    canonicalLink.setAttribute('href', baseUrl + to.path)
  }
  
  // 跟踪页面浏览
  trackPageView(to.meta.title || 'RC Match AI', to.path)
})

export default router