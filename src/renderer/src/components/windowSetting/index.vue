<template>
  <div class="list">
    <div v-if="props.isChangeShape" class="item">
      <el-icon><Notebook @click="changeShape" /></el-icon>
    </div>
    <div v-if="props.isMiniMize" class="item" @click="miniMize">
      <el-icon><Minus /></el-icon>
    </div>
    <div v-if="props.isMaxImize" class="item" @click="maxImize">
      <el-icon><CopyDocument /></el-icon>
    </div>
    <div class="item" @click="close">
      <el-icon><CloseBold /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import useCloseWindow from '../../hooks/useCloseWindow'
const props = defineProps({
  isChangeShape: {
    type: Boolean,
    default: false
  },
  isMiniMize: {
    type: Boolean,
    default: false
  },
  isMaxImize: {
    type: Boolean,
    default: false
  }
})
const isFullScreen = ref(false)
const isFold = ref(false)
const close = (): void => {
  useCloseWindow()
}
const maxImize = (): void => {
  isFullScreen.value = !isFullScreen.value
  window.api.setFullScreen(!isFullScreen.value)
}
const miniMize = (): void => {
  window.api.miniMize()
}
const changeShape = (): void => {
  if (!isFold.value) {
    isFold.value = !isFold.value
    window.api.changeShape(320)
  } else {
    isFold.value = !isFold.value
    window.api.changeShape(950)
  }
}
</script>

<style scoped lang="less">
.list {
  display: flex;
  margin-top: 10px;
  z-index: 999999;
  .item {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}
</style>
