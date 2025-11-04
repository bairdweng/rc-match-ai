import { createApp } from 'vue'
import naive from 'naive-ui'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import { initGoogleAnalytics } from './utils/analytics.js'

const app = createApp(App)

// 正确注册Naive UI插件
app.use(naive)

app.use(router)

// 初始化Google Analytics
initGoogleAnalytics()

app.mount('#app')
