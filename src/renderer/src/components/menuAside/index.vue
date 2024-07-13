<template>
  <div ref="dragRef" class="menuAside">
    <div class="avatar">
      <el-avatar :size="40" src="../../assets/img/fly.png" />
    </div>

    <el-menu
      router
      unique-opened
      active-text-color="rgb(0,153,255)"
      background-color="rgb(236,236,236)"
      :default-active="activeMenu"
      class="menuList"
    >
      <el-menu-item
        v-for="item in menuList"
        :key="item.path"
        class="menuItem"
        :index="String(item.path)"
      >
        <div class="menuitem">
          <el-icon size="50"> <component :is="item.icon" /></el-icon>
        </div>
      </el-menu-item>
    </el-menu>

    <el-menu
      class="setting"
      unique-opened
      active-text-color="rgb(0,153,255)"
      background-color="rgb(236,236,236)"
      default-active="/chatList"
    >
      <el-menu-item
        v-for="item in settingList"
        :key="item.icon"
        class="menuItem"
        :index="String(item.icon)"
      >
        <div class="menuitem">
          <el-icon size="50"> <component :is="item.icon" /></el-icon>
        </div>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import useDrag from '../../hooks/useDrag'
import socket from '../../websocket/index'
import { useRoute } from 'vue-router'
import { useUserStore } from '../../store/user'
const activeMenu = ref<string>('/chatList') //当前激活的菜单按钮
const userStore = useUserStore()
const userList = ref(userStore.userList)
const userInfo = userStore.userInfo
socket.connect()
userList.value.map((item) => {
  const room = userStore.createRoom(item.id, userInfo.id)
  item.room = room
  socket.emit('join_room', room)
})
onMounted(() => {
  const { path } = useRoute() // 获取当前路径
  console.log(path)

  activeMenu.value = path // 将当前路径和激活菜单绑定
})
userStore.getFriends()
const menuList = ref([
  {
    // path: '/mainMenu/chatList',
    path: '/chatList',

    icon: 'ChatDotRound'
  },
  {
    path: '/chatFriends',
    icon: 'User'
  }
])
const settingList = ref([
  {
    icon: 'Tools'
  }
])
const dragRef = ref()
let clearDrag
onMounted(() => {
  clearDrag = useDrag(dragRef.value)
})
onBeforeUnmount(() => {
  clearDrag()
})
</script>

<style scoped lang="less">
@import url(./index.less);
</style>
