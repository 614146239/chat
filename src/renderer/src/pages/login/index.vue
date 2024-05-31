<template>
  <div class="box">
    <div class="close" @click="closeWindow">x</div>
    <header ref="headerRef"></header>
    <div class="contain">
      <div class="avatar">
        <el-avatar :size="50" :src="fly" />
      </div>
      <el-form class="form">
        <el-select
          ref="selectRef"
          v-model="userinfo.username"
          filterable
          default-first-option
          remote
          remote-show-suffix
          clearable
          placeholder="请输入账号"
          size="large"
          :remote-method="remoteMethod"
          @blur="writeSelectValue"
          @change="changeUser"
        >
          <el-option
            v-for="item in userList"
            :key="item.username"
            :label="item.username"
            :value="item.username"
          />
          <!-- <template #empty> </template> -->
        </el-select>

        <el-input
          v-model="userinfo.password"
          type="password"
          placeholder="请输入密码"
          show-password
          clearable
        />

        <el-button ref="buttonRef" :disabled="isDisabled" type="primary" @click="submit"
          >登录</el-button
        >
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

const selectRef = ref()
let clearDrag: () => void
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

watch(userinfo, (newV) => {
  if (newV.username && newV.password) {
    isDisabled.value = false
  } else {
    isDisabled.value = true
  }
})
const remoteMethod = (query): void => {
  // console.log(query)
  // selectRef.value.toggleMenu()
}

const writeSelectValue = (e): void => {
  userinfo.username = e.target.value
}
const changeUser = (e): void => {
  userList.value.forEach((item) => {
    if (item.username == e) {
      userinfo.password = item.password
    }
  })
}
const window = createWindow()
const submit = (): void => {
  // 开始登录

  userStore.login(userinfo)

  userList.value.forEach((el) => {
    if (el.username != userinfo.username) {
      userList.value.push({ ...userinfo })
      localStorage.setItem('userList', JSON.stringify(userList.value))
    }
  })

  // 关闭窗口，打开新窗口
  // useCloseWindow()
  // window.mainMenu()
}
</script>

<style scoped lang="less">
@import url('./index.scss');
</style>
