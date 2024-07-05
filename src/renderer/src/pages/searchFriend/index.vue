<template>
  <div class="box">
    <header ref="head" class="head">
      <span>全网搜索</span>
      <windowSetting is-mini-mize is-max-imize class="setting" />
    </header>
    <section>
      <div class="search">
        <el-input
          v-model="searchValue"
          placeholder="输入搜索关键词"
          :prefix-icon="Search"
          @input="search"
        />
      </div>
      <div class="userList">
        <div v-for="item in list" :key="item.id" class="item">
          <div class="userInfo">
            <div class="avatar">
              <el-avatar :size="40" :src="item.avatar" />
            </div>
            <div class="info">
              <p>{{ item.username }}</p>
              <span>{{ item.nickname }}</span>
            </div>
          </div>
          <div class="add" @click="add(item)">
            <el-button>添加</el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import windowSetting from '../../components/windowSetting/index.vue'
import useDrag from '../../hooks/useDrag'
import { Search } from '@element-plus/icons-vue'
import { fuzzyFindUser, addFriend } from '../../api/modules/user'
import { createWindow } from '../../store/createWindow'
import { useDebounceFn } from '@vueuse/core'

const win = createWindow()
const head = ref<HTMLElement>()
const searchValue = ref('')
const list = ref()
let clearDrag
onMounted(() => {
  clearDrag = useDrag(head.value)
})
onBeforeUnmount(() => {
  clearDrag()
})
const search = useDebounceFn(async () => {
  if (!searchValue.value) return
  const data = await fuzzyFindUser({ username: searchValue.value })
  list.value = data.data
}, 1000)
const add = async (item): Promise<void> => {
  win.addFriend(JSON.stringify(item))
}
</script>

<style scoped lang="less">
@import url(./index.less);
</style>
