<template>
  <div class="chat">
    <header ref="headerRef">
      <el-page-header class="head">
        <template #content>
          <div class="name">
            <p>{{ friendInfo.username }}</p>
            <div v-if="friendInfo.isOnline" class="isOnline"></div>
          </div>
        </template>
        <template #extra>
          <div class="flex items-center">
            <div class="setting">
              <div @click="" class="settingItem">
                <el-icon :size="22"><Phone /></el-icon>
              </div>
              <div @click="videoCamera" class="settingItem">
                <el-icon :size="22"><VideoCamera /></el-icon>
              </div>
            </div>
          </div>
        </template>
      </el-page-header>
    </header>
    <div class="border"></div>
    <div class="messageList" v-scrollBottom ref="messageBox">
      <div v-for="(item, index) in messageList" :key="index">
        <div v-if="useTime(item.time)" class="time">{{ useTime(item.time) }}</div>
        <h1>111</h1>
        <div :class="item.class" v-if="item.class == 'opponentMsg'">
          <div class="avatar">
            <el-avatar :size="40" :src="item.userInfo.avatar" />
          </div>
          <p v-html="item.msg"></p>
        </div>
        <div :class="item.class" v-else>
          <!-- <p>{{ item.msg }}</p> -->
          <p v-html="item.msg"></p>
          <div class="avatar">
            <el-avatar :size="40" :src="item.userInfo.avatar" />
          </div>
        </div>
      </div>
    </div>
    <div class="border"></div>
    <div class="chatSetting">
      <div class="setItem" @click="openFolder">
        <el-icon :size="22"><FolderOpened /></el-icon>
      </div>
      <div class="setItem">
        <el-icon :size="22"><Picture /></el-icon>
      </div>
    </div>
    <div class="inputChat" ref="inputRef">
      <div class="writeMsg">
        <!-- <el-input v-model.trim="msg" autofocus autosize type="textarea" @keydown.enter="send" /> -->
        <Chatbox
          class="chatBox"
          ref="inputChat"
          focus
          v-model.trim="msg"
          @keydown.enter="send"
        ></Chatbox>
      </div>
      <div class="submit" @click="send"><el-button type="primary">发送</el-button></div>
    </div>

    <el-dialog
      v-model="isSendFile"
      :show-close="false"
      width="315"
      top="30vh"
      :lock-scroll="false"
      :close-on-click-modal="false"
      :title="'发送给' + friendInfo.username"
      center
    >
      <div class="fileContent">
        <div class="img">
          <img src="" alt="" />
        </div>
        <div class="fileInfo">
          <p>{{ fileInfo.fileName }}</p>
          <span>{{ fileInfo.size }}kb</span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="sendFile"> 发送 </el-button>
          <el-button @click="isSendFile = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import socket from '../../websocket/index'
import { useRoute } from 'vue-router'
import useDrag from '../../hooks/useDrag'
import { useUserStore } from '../../store/user'
import { createWindow } from '../../store/createWindow'
import { chatUpload } from '../../api/modules/upload'
import { UploadUserFile } from 'element-plus'
import useTime from '../../hooks/useTime'
import Chatbox from '../../components/chatBox/index.vue'
const win = createWindow()
const route = useRoute()
const userStore = useUserStore()
const friendId = ref(route.query.friendId)
const room = ref(route.query.room)
const userInfo = userStore.userInfo
const friendInfo = ref(userStore.findChatUser(friendId.value))
const headerRef = ref()
const msg = ref('')
const inputChat = ref(null)

const messageList: any = ref(friendInfo.message ? friendInfo.message : reactive([]))
console.log(messageList.value)
console.log(friendInfo.message)

const messageBox = ref()

const isSendFile = ref(false)
userStore.clearMsgTotal(friendId.value)
watch(
  () => route.query,
  (newQuery) => {
    socket.emit('leave_room', room.value)
    friendId.value = newQuery.friendId
    room.value = newQuery.room
    socket.emit('join_room', room.value)
    friendInfo.value = userStore.findUser(friendId.value)
    userStore.clearMsgTotal(friendId.value)
  }
)

socket.connect()
socket.on('receive_message', (msg) => {
  friendInfo.value = userStore.findChatUser(friendId.value)
  messageList.value = friendInfo.value.message
  // 消息不再提示
  userStore.chatList.forEach((user) => {
    if (user.id == friendId.value) {
      user.msgTotal = 0
    }
  })
})
let fileInfo = reactive({
  size: '',
  fileName: '',
  extension: '',
  path: '',
  file: ''
})
// const beforeAvatarUpload = (file) => {
//   console.log(file)
// }
// const fileList = ref<UploadUserFile[]>()
const openFolder = async () => {
  const file = await window.api.openFolder()
  if (!file) return
  isSendFile.value = true
  fileInfo = file
  console.log(fileInfo)
}
const sendFile = () => {
  const newFile = new File([fileInfo.file], fileInfo.fileName)

  const formData = new FormData()
  // formData.append('file', new Blob([fileInfo.file]))

  formData.append('file', newFile)

  chatUpload(formData)
}
const send = async (): Promise<void> => {
  if (!msg.value) return
  const time = new Date().toLocaleString()

  socket.emit(
    'send_message',
    room.value,
    JSON.stringify({
      class: 'opponentMsg',
      msg: msg.value,
      time: time,
      userInfo: toRaw(userInfo)
    })
  )
  messageList.value.push({
    class: 'selfMsg',
    msg: msg.value,
    time: time,
    userInfo: userInfo
  })

  inputChat.value.setInputValue(null)
}
const videoCamera = () => {
  socket.emit('call', room.value)
  win.videoChat(room.value as string, true)
}
let clearDrag
const inputRef = ref()
onMounted(() => {
  clearDrag = useDrag(headerRef.value)
  //

  inputRef.value.addEventListener('drop', (e) => {
    e.preventDefault()
    e.stopPropagation()

    for (const f of e.dataTransfer.files) {
      console.log('File(s) you dragged here: ', f)
      const formData = new FormData()
      formData.append('file', f)
      chatUpload(formData)
    }
  })
  inputRef.value.addEventListener('dragover', (e) => {
    e.preventDefault()
    e.stopPropagation()
  })
})
onBeforeUnmount(() => {
  clearDrag()
})
</script>

<style scoped lang="less">
@import url(./index.less);
</style>

<!-- 发送消息，接收消息，达到最底部 -->
