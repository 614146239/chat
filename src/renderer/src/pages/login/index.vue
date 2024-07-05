<template>
  <div class="box">
    <div class="close" @click="closeWindow">x</div>
    <header ref="headerRef"></header>
    <div class="contain">
      <div class="avatar">
        <el-avatar :size="50" :src="fly" />
      </div>
      <el-form class="form">
        <el-autocomplete
          v-model="userinfo.username"
          clearable
          class="user"
          :fetch-suggestions="querySearch"
          placeholder="请输入账号"
          value-key="username"
          @select="handleSelect"
        />
        <el-input
          v-model="userinfo.password"
          type="password"
          placeholder="请输入密码"
          show-password
          clearable
          @keydown.enter="submit"
        />

        <el-button ref="buttonRef" :disabled="isDisabled" type="primary" @click="submit"
          >登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import fly from '@renderer/assets/img/fly.png'
import { ref, onMounted, reactive, watch, onBeforeUnmount } from 'vue'
import useDrag from '../../hooks/useDrag'
import useCloseWindow from '../../hooks/useCloseWindow'
import { createWindow } from '../../store/createWindow'
import { useUserStore } from '../../store/user'
const userStore = useUserStore()

const headerRef = ref()
const isDisabled = ref<boolean>(true)
const closeWindow = (): void => {
  useCloseWindow()
}
let clearDrag
onMounted(() => {
  clearDrag = useDrag(headerRef.value)
})
onBeforeUnmount(() => {
  clearDrag()
})
interface UserInfo {
  username: string
  password: string
}

const userinfo: UserInfo = reactive({
  username: '',
  password: ''
})
const userList = ref<UserInfo[]>([])
userList.value = JSON.parse(localStorage.getItem('userList') ?? '[]')

const querySearch = (queryString: string, cb: any) => {
  const results = queryString ? userList.value.filter(createFilter(queryString)) : userList.value
  cb(toRaw(results))
}
const handleSelect = (item: UserInfo): void => {
  userinfo.password = item.password
}
const createFilter = (queryString: string) => {
  return (restaurant: UserInfo) => {
    return restaurant.username.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}
watch(userinfo, (newV) => {
  if (newV.username && newV.password) {
    isDisabled.value = false
  } else {
    isDisabled.value = true
  }
})

const window = createWindow()
const submit = async () => {
  // 开始登录
  if (isDisabled.value) return

  const data = await userStore.login(userinfo)
  if (data.code == '200') {
    // 获取当前存储的用户列表
    const storedUserList = localStorage.getItem('userList')
    userList.value = storedUserList ? JSON.parse(storedUserList) : []

    // 检查用户是否已存在
    const hasUser = userList.value.some((user) => user.username === userinfo.username)
    if (!hasUser) {
      userList.value.push({ ...userinfo })
      localStorage.setItem('userList', JSON.stringify(userList.value))
    }

    // 关闭窗口，打开新窗口
    window.mainMenu()
    useCloseWindow()
  }
}
</script>

<style scoped lang="less">
@import url('./index.scss');
</style>
