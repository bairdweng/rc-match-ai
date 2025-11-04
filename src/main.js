import { createApp } from 'vue'
import { NConfigProvider, darkTheme } from 'naive-ui'
import { createGtag } from 'vue-gtag-next'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import { initGoogleAnalytics } from './utils/analytics.js'

const app = createApp(App)

// 配置Google Analytics
const gtag = createGtag({
  property: {
    id: import.meta.env.VITE_GA_MEASUREMENT_ID
  }
})

app.use(NConfigProvider, {
  theme: darkTheme
})

app.use(router)
app.use(gtag)

// 初始化Google Analytics
initGoogleAnalytics()

app.mount('#app')
