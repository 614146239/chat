import { defineStore } from 'pinia'
import { loginApi } from '@renderer/api/modules/login'
import { Login } from '@renderer/api/interface'
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userInfo: {
        userName: ''
      },
      access_token: ''
    }
  },

  getters: {
    setToken(state) {
      return (token: string) => {
        state.access_token = token
      }
    }
  },
  actions: {
    async login(params: Login.ReqLoginForm) {
      const data = await loginApi(params)
      console.log(data)
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage
      }
    ]
  }
})
