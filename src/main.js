import { createApp } from 'vue'
import { NConfigProvider, darkTheme } from 'naive-ui'
import './style.css'
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)

app.use(NConfigProvider, {
  theme: darkTheme
})

app.use(router)

app.mount('#app')
