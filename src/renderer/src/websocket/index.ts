import io from 'socket.io-client'
import { useUserStore } from '@renderer/store/user'
const userStore = useUserStore()
import { createWindow } from '@renderer/store/createWindow'
import { useRouter } from 'vue-router'
const router = useRouter()
const win = createWindow()
const URL = import.meta.env.VITE_BASE_API
import tone from './preview.mp3'
import { reactive } from 'vue'
import fly from '../assets/img/face.png'
const audio = new Audio(tone)
const userInfo = userStore.userInfo
const socket = io(URL, {
  transports: ['websocket'],
  autoConnect: false, // 是否自动连接
  reconnection: true, // 是否自动重新连接
  reconnectionAttempts: 3, // 重新连接尝试次数
  reconnectionDelay: 1000, // 重新连接延迟时间（毫秒）
  query: {
    token: userStore.token
  }
})

socket.on('connect', () => {
  console.log('connected:', socket.id)
})
// 接收消息
socket.on('receive_message', (msg) => {
  audio.play()
  const message = JSON.parse(msg)
  const friendId = message.userInfo.id
  const hasUser = userStore.chatList.some((user) => user.id == friendId)
  const friend = userStore.findUser(friendId)
  if (!hasUser && friend) {
    userStore.chatList.unshift(friend)
  }

  new window.Notification('来自qq的消息', {
    body: message.msg,
    // timeoutType: 'default'
    icon: fly
  }).onclick = () => {
    // console.log(1)
    router.push({
      name: `chat`,
      query: {
        friendId: friendId,
        room: userStore.createRoom(friendId, userInfo.id)
      }
    })
  }
  // 消息提示
  userStore.chatList.forEach((user) => {
    if (user.id == friendId) {
      user.message = user.message ? user.message : reactive([])
      user.message.push(message)
      console.log(message)

      const msgTotal = user.msgTotal ?? 0
      user.msgTotal = msgTotal + 1
    }
  })
  // 消息
})

socket.on('online', (msg) => {
  // console.log(msg)
  // userStore.getFriends()
  userStore.chatList.forEach((user) => {
    if (user.id == msg.id) {
      user.isOnline = msg.isOnline
    }
  })
  userStore.groupAndUser.forEach((group) => {
    group.Members.forEach((user) => {
      if (user.id == msg.id) {
        user.isOnline = msg.isOnline
      }
    })
  })
})
//接听电话
socket.on('phone', (room) => {
  win.videoChat(room, false)
})
socket.on('disconnect', () => {
  console.log('disconnected')
})

socket.on('connect_error', (err) => {
  // console.error('Connection error:', err)
  console.log(err.message)
})
export default socket

//  和所有好友建立房间，监听消息，获取消息
// 还有好友id,根据好友id把信息存入store,异步写入文件，
