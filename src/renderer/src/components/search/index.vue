<template>
  <div>
    <div ref="box" class="search">
      <el-input
        ref="input"
        v-model="searchValue"
        placeholder="搜索"
        :prefix-icon="Search"
        @focus="search"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { createWindow } from '../../store/createWindow'
import useDrag from '../../hooks/useDrag'
const input = ref()
const box = ref()
const win = createWindow()
const searchValue = ref('')
const search = (): void => {
  win.searchFriend()
  input.value.blur()
}
let clearDrag
onMounted(() => {
  clearDrag = useDrag(box.value)
})
onBeforeUnmount(() => {
  clearDrag()
})
</script>

<style scoped lang="less">
@import url(./index.less);
</style>
