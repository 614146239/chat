<template>
  <div class="chat">
    <header>
      <div class="close" @click="close">x</div>
    </header>
  </div>
</template>

<script setup lang="ts">
import useCloseWindow from '../../hooks/useCloseWindow'

const close = (): void => {
  useCloseWindow()
}
</script>

<style scoped lang="less">
@import url(./index.less);
</style>
