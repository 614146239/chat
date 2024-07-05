<template>
  <div class="box">
    <header ref="head" class="head">
      <span>申请加好友</span>
      <windowSetting class="setting" />
    </header>

    <section>
      <div class="userInfo">
        <div class="avatar">
          <el-avatar :size="40" :src="friendInfo.avatar" />
        </div>
        <div class="info">
          <p>{{ friendInfo.username }}</p>
          <span>{{ friendInfo.nickname }}</span>
        </div>
      </div>
      <div class="form">
        <div class="formItem">
          <div class="title">
            <p>填写验证信息</p>
          </div>
          <div class="input">
            <el-input v-model="addInfo.msg" type="textarea" />
          </div>
        </div>
        <div class="formItem">
          <div class="title">
            <p>备注</p>
          </div>
          <div class="input">
            <el-input v-model="addInfo.reMark" />
          </div>
        </div>
        <div class="formItem">
          <div class="title">
            <p>分组</p>
          </div>
          <div class="input">
            <el-select v-model="addInfo.groupId" style="width: 100%">
              <el-option
                v-for="item in group"
                :key="item.id"
                :label="item.groupName"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
      </div>
      <div class="submit">
        <el-button type="primary" @click="submit">发送</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import windowSetting from '../../components/windowSetting/index.vue'
import useDrag from '../../hooks/useDrag'
import { addFriend } from '../../api/modules/user'
import { useUserStore } from '../../store/user'
import useCloseWindow from '../../hooks/useCloseWindow'
import { useRoute } from 'vue-router'
const route = useRoute()
const userStore = useUserStore()
const group = userStore.userGroup

let friendInfo
if (route.params.friendInfo && !Array.isArray(route.params.friendInfo)) {
  friendInfo = JSON.parse(route.params.friendInfo)
}

const addInfo = reactive({
  msg: `我是${userStore.userInfo.username}`,
  reMark: `${friendInfo.username}`,
  friendGroupId: group[0].id,
  toFriendId: friendInfo.id
})
const head = ref<HTMLElement>()

const submit = async () => {
  const data = await addFriend(addInfo)
  if (data.code == '200') {
    useCloseWindow()
  }
}
const close = (): void => {
  useCloseWindow()
}
let clearDrag
onMounted(() => {
  clearDrag = useDrag(head.value)
})
onBeforeUnmount(() => {
  clearDrag()
})
</script>

<style scoped lang="less">
@import url(./index.less);
</style>
