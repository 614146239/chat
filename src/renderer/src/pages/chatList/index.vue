<template>
  <div class="box">
    <Search />
    <div class="chatList">
      <div
        v-for="(item, index) in list"
        :key="item.username"
        class="chatItem"
        :class="{ chatItemActive: actIndex === index }"
        @click="href(item, index)"
      >
        <div class="avatar">
          <el-avatar :size="40" src="../../assets/img/fly.png" />
        </div>

        <div class="chatInfo">
          <div class="infoT">
            <div class="userName">{{ item.username }}</div>
            <div class="time">{{ item.time }}</div>
          </div>
          <div class="info">
            <p>{{ item.message.at(-1).msg }}</p>
            <el-badge v-if="item.msgTotal" :value="item.msgTotal"> <span></span> </el-badge>
          </div>
        </div>
      </div>
    </div>
  </div>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'
import Search from '../../components/search/index.vue'

const userStore = useUserStore()
const router = useRouter()

const list = ref(userStore.chatList)
const userInfo = userStore.userInfo
const actIndex = ref(0)
const href = (item, index): void => {
  actIndex.value = index
  router.push({
    name: `chat`,
    query: {
      friendId: item.id,
      room: userStore.createRoom(item.id, userInfo.id)
    }
  })
}
</script>

<style scoped lang="less">
@import url(./index.less);
</style>

<!-- 查找好友页面 -->
<!-- 添加好友 -->
<!-- 同意好友请求 -->
