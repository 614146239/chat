<template>
  <div class="chabox" :value="msg" ref="inputRef" contenteditable="true" @input="handleInput"></div>
</template>

<script setup lang="ts">
const msg = defineModel({ required: true })
const props = defineProps({
  focus: {
    type: Boolean
  }
})
const inputRef = ref()
const handleInput = (e) => {
  msg.value = e.target.innerHTML
}
// watch(msg, (n) => {
//   inputRef.value.innerHTML = n
// })
const setInputValue = (value) => {
  inputRef.value.innerHTML = value
}
onMounted(() => {
  inputRef.value.innerHTML = msg.value
  if (props.focus) {
    inputRef.value.focus()
  }
})

defineExpose({
  setInputValue
})
</script>

<style scoped lang="less">
@import url(./index.less);
</style>
