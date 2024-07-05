<template>
  <div class="friendNotice">
    <header ref="head"></header>
    <div class="title">
      <div class="tag">好友通知</div>
    </div>
    <div class="notice">
      <div v-for="item in friendRequest" :key="item.id" class="noticeItem">
        <div class="noticeL">
          <div class="avatar">
            <el-avatar :size="40" src="../../assets/img/fly.png" />
          </div>
          <div class="name">{{ item.user.username }}</div>
          <div class="msg">请求加为好友</div>
          <div class="data">{{ item.CreatedAt }}</div>
        </div>
        <div class="noticeR" @click="agree(item.user.id)">
          <el-button v-if="item.status == 'pending'">同意</el-button>
          <p v-if="item.status == 'accepted'">已同意</p>
          <p v-if="item.status == 'rejected'">拒绝</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useDrag from '../../hooks/useDrag'
import { findFriendRequest, agreeFriend } from '../../api/modules/user'
const friendRequest = ref()
const head = ref<HTMLElement>()
let clearDrag
onMounted(async () => {
  clearDrag = useDrag(head.value)
  const data = await findFriendRequest()
  friendRequest.value = data.data
})
const agree = async (id) => {
  const data = await agreeFriend({ friendId: id })
  console.log(data)
}
onBeforeUnmount(() => {
  clearDrag()
})
</script>

<style scoped lang="less">
@import url(./index.less);
</style>
