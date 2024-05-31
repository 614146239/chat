<template>
  <div class="main">
    <menuAside></menuAside>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import menuAside from '../../components/menuAside/index.vue'
</script>

<style scoped lang="less">
@import url('./index.less');
</style>
