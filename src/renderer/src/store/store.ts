import { createPinia } from 'pinia'
import piniaPluginPersistedstate, { createPersistedState } from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
// pinia.use(
//   createPersistedState({
//     storage: {
//       setItem: (key: string, value: string) => {
//         // 这里我使用异步方法保存数据
//         window.api.setInfo(key, value)
//       },
//       getItem: (key: string) => {
//         return window.api.getInfo(key)
//       }
//     }
//   })
// )

export default pinia
