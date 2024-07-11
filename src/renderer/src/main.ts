import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
import pinia from './store/store'
import './assets/css/styles.less'

// 加载图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 自定义指令
import directive from './directive/index'

app.use(router).use(pinia).use(directive)

app.mount('#app')
