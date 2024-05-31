<template>
  <div class="chat">
    <header ref="headerRef">
      <div class="close" @click="close">x</div>
      <div class="name">
        <p>对方行名</p>
        <div class="isOnline"></div>
      </div>
    </header>
    <div class="border"></div>
    <div class="messageList">
      <div class="opponentMsg">
        <div class="avatar">
          <el-avatar :size="40" src="../../assets/img/fly.png" />
        </div>
        <p>对方消息</p>
      </div>
      <div class="time">时间</div>
      <div class="selfMsg">
        <p>自己消息</p>
        <div class="avatar">
          <el-avatar :size="40" src="../../assets/img/fly.png" />
        </div>
      </div>
    </div>
    <div class="border"></div>
    <div class="inputChat">
      <div class="writeMsg">
        <el-input v-model="msg" autofocus autosize type="textarea" />
      </div>
      <!-- <div class="upload">
        <el-upload class="upload-context" drag action="" multiple></el-upload>
      </div> -->
      <div class="submit"><el-button type="primary">发送</el-button></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const headerRef = ref()
import useCloseWindow from '../../hooks/useCloseWindow'
import useDrag from '../../hooks/useDrag'
const msg = ref('')
let clearDrag: () => void
onMounted(() => {
  clearDrag = useDrag(headerRef.value)
})
onBeforeUnmount(() => {
  clearDrag()
})
const close = (): void => {
  useCloseWindow()
}
</script>

<style scoped lang="less">
@import url(./index.less);
</style>
