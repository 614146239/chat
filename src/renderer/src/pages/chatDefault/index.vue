<template>
  <div class="chat">
    <header ref="headerRef" class="head"></header>
  </div>
</template>

<script setup lang="ts">
import useDrag from '../../hooks/useDrag'
const headerRef = ref()
let clearDrag
onMounted(() => {
  clearDrag = useDrag(headerRef.value)
})
onBeforeUnmount(() => {
  clearDrag()
})
</script>

<style scoped lang="less">
@import url(./index.less);
</style>
