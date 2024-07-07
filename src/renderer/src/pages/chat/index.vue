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
    <div class="messageList">
      <div v-for="(item, index) in messageList" :key="index" :class="item.class">
        <template v-if="item.class == 'opponentMsg'">
          <div class="avatar">
            <el-avatar :size="40" :src="item.userInfo.avatar" />
          </div>
          <p>{{ item.msg }}</p>
        </template>
        <template v-else>
          <p>{{ item.msg }}</p>
          <div class="avatar">
            <el-avatar :size="40" :src="item.userInfo.avatar" />
          </div>
        </template>
      </div>

      <div class="time">时间</div>
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
    <div class="inputChat">
      <div class="writeMsg">
        <el-input v-model="msg" autofocus autosize type="textarea" @keydown.enter="send" />
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
const win = createWindow()
const route = useRoute()
const userStore = useUserStore()
const friendId = ref(route.query.friendId)
const room = ref(route.query.room)
const userInfo = userStore.userInfo
const friendInfo = ref(userStore.findChatUser(friendId.value))
const headerRef = ref()
const msg = ref('')
// const messageList = ref([])
const messageList = ref(friendInfo.message ? friendInfo.message : reactive([]))
console.log(messageList)

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
})
let fileInfo = reactive({
  size: '',
  fileName: '',
  extension: '',
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
  const newFile = new File([fileInfo.file], fileInfo.fileName, { type: 'application/octet-stream' })

  const formData = new FormData()
  // formData.append('file', new Blob([fileInfo.file]))

  formData.append('file', newFile)

  chatUpload(formData)
}
const send = async (): Promise<void> => {
  if (msg.value == '') return

  socket.emit(
    'send_message',
    room.value,
    JSON.stringify({
      class: 'opponentMsg',
      msg: msg.value,
      userInfo: toRaw(userInfo)
    })
  )
  messageList.value = [
    ...messageList.value,
    {
      class: 'selfMsg',
      msg: msg.value,
      userInfo: userInfo
    }
  ]
  msg.value = ''
}
const videoCamera = () => {
  socket.emit('call', room.value)
  win.videoChat(room.value as string, true)
}
let clearDrag
onMounted(() => {
  clearDrag = useDrag(headerRef.value)
})
onBeforeUnmount(() => {
  clearDrag()
})
</script>

<style scoped lang="less">
@import url(./index.less);
</style>
