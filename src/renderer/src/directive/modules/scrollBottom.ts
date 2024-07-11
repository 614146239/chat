import { computed } from 'vue'
export default {
  mounted(el, binding, vnode, prevVnode) {
    const scrollHeight = el.scrollHeight
    const clientHeight = el.clientHeight
    const difference = computed(() => {
      return scrollHeight - clientHeight
    })

    if (difference.value <= 0) return
    el.scrollTo({
      left: 0,
      top: difference.value,
      behavior: 'smooth'
    })
  },
  updated(el, binding, vnode, prevVnode) {
    const scrollHeight = el.scrollHeight
    const clientHeight = el.clientHeight
    const difference = computed(() => {
      return scrollHeight - clientHeight
    })
    if (difference.value <= 0) return
    el.scrollTo({
      left: 0,
      top: difference.value,
      behavior: 'smooth'
    })
  }
}
