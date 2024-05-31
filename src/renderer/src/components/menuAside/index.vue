<template>
  <div ref="dragRef" class="menuAside">
    <div class="avatar">
      <el-avatar :size="40" src="../../assets/img/fly.png" />
    </div>

    <el-menu
      router
      unique-opened
      active-text-color="rgb(0,153,255)"
      background-color="rgb(204,205,205)"
      default-active="/chatList"
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
  </div>
</template>

<script setup lang="ts">
import useDrag from '../../hooks/useDrag'
import useCloseWindow from '../../hooks/useCloseWindow'

const menuList = ref([
  {
    path: '/chatList',
    icon: 'Comment'
  },
  {
    path: '/chatFriends',
    icon: 'Avatar'
  }
])
const dragRef = ref()
let clearDrag: () => void
onMounted(() => {
  clearDrag = useDrag(dragRef.value)
})

onBeforeUnmount(() => {
  clearDrag()
  console.log('失效')
})
</script>

<style scoped lang="less">
@import url(./index.less);
</style>
