import { defineStore } from 'pinia'
import { loginApi } from '@renderer/api/modules/login'
import { getFriends } from '@renderer/api/modules/user'
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userInfo: {},
      token: '',
      userList: [], //用户列表
      userGroup: [], //用户组列表
      groupAndUser: [], //用户组和用户列表
      chatList: [] //聊天列表
      // chatMsg: [] //
    }
  },

  getters: {
    setToken(state) {
      return (token: string) => {
        state.token = token
      }
    },
    createRoom() {
      return (selfId, friendId) => {
        const room = selfId > friendId ? `${friendId}-${selfId}` : `${selfId}-${friendId}`
        return room
      }
    },
    findUser(state) {
      return (id) => {
        return state.userList.find((user) => user.id == id)
      }
    },
    findChatUser(state) {
      return (id) => {
        return state.chatList.find((user) => user.id == id)
      }
    },
    clearMsgTotal(state) {
      return (id) => {
        state.chatList.forEach((user) => {
          if (user.id == id) {
            user.msgTotal = 0
          }
        })
      }
    }
  },
  actions: {
    async login(params) {
      const data = await loginApi(params)
      this.token = data.data.token
      this.userInfo = data.data.userInfo
      return data
    },
    async getFriends() {
      const data = await getFriends()
      this.groupAndUser = data.data.list
      const [UserList, groupList] = splitUser(data.data.list)
      this.userList = UserList
      this.userGroup = [...groupList]
    }
  },
  // persist: true
  persist: {
    // storage: sessionStorage
    paths: ['userInfo', 'token', 'userGroup', 'groupAndUser']
  }
})

const splitUser = (groupAndUser) => {
  const userList = []
  const groupList = []
  groupAndUser.forEach((el) => {
    const item = { ...el }
    delete item.Members
    groupList.push(item)
    el.Members.forEach((member) => {
      userList.push(member)
    })
  })
  return [userList, groupList]
}
