<template>
  <div class="box">
    <div class="chatList">
      <div v-for="item in list" :key="item.username" class="chatItem" @click="href(item)">
        <div class="avatar">
          <el-avatar :size="40" src="../../assets/img/fly.png" />
        </div>
        <div class="chatInfo">
          <div class="infoT">
            <div class="userName">{{ item.username }}</div>
            <div class="time">{{ item.time }}</div>
          </div>
          <div class="info">{{ item.msg }}</div>
        </div>
      </div>
    </div>
  </div>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const list = ref([
  {
    avatar: new URL('../../assets/img/fly.png', import.meta.url).href,
    username: '1222',
    time: '2020:0817',
    msg: '1222211122'
  },
  {
    avatar: new URL('../../assets/img/fly.png', import.meta.url).href,
    username: '1222',
    time: '2020:0817',
    msg: '1222211122'
  }
])
const href = (item): void => {
  router.push(`/chat/${item.username}`)
}
</script>

<style scoped lang="less">
@import url(./index.less);
</style>
