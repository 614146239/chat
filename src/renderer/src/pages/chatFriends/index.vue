<template>
  <div class="box">
    <Search />
    <div class="notice">
      <div class="noticeItem" @click="friendNotice">
        <p>好友通知</p>
        <el-icon><ArrowRight /></el-icon>
      </div>
    </div>
    <el-collapse accordion>
      <el-collapse-item v-for="item in list" :key="item.username" :title="item.groupName">
        <template #title>
          <div class="collapseItem">
            <!-- <span>{{ item.Members.length }}</span> -->
            <p>{{ item.groupName }}</p>
          </div>
        </template>
        <div class="chatList">
          <div
            v-for="value in item.Members"
            :key="value.username"
            class="chatItem"
            @dblclick="href(value)"
          >
            <div class="avatar">
              <el-avatar :size="40" src="../../assets/img/fly.png" />
            </div>
            <div class="chatInfo">
              <div class="infoT">
                <div class="userName">{{ value.username }}</div>
              </div>
              <div class="info">{{ value.msg }}</div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'
// import socket from '../../websocket/index'
import Search from '../../components/search/index.vue'
const userStore = useUserStore()
const router = useRouter()
const userInfo = userStore.userInfo

const list = ref(userStore.groupAndUser)

const href = (item): void => {
  // 添加之前判断有没有
  const hasUser = userStore.chatList.some((user) => user.id == item.id)
  if (!hasUser) {
    userStore.chatList.unshift(item)
  }
  router.push({
    name: `chat`,
    query: {
      friendId: item.id,
      room: userStore.createRoom(item.id, userInfo.id)
    }
  })
}
const friendNotice = (): void => {
  router.push('/friendNotice')
}
</script>

<style scoped lang="less">
@import url(./index.less);
</style>

<!-- 路由传参到聊天页面 -->
