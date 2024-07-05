<template>
  <div class="main">
    <menuAside></menuAside>
    <router-view></router-view>
    <windowsetting is-change-shape is-mini-mize is-max-imize class="windowConfig"></windowsetting>
  </div>
</template>

<script setup lang="ts">
import menuAside from '../../components/menuAside/index.vue'
import windowsetting from '../../components/windowSetting/index.vue'
</script>

<style scoped lang="less">
@import url('./index.less');
</style>
