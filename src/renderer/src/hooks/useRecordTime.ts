import { ref, onBeforeUnmount, Ref } from 'vue'

const useRecordTime = () => {
  const time = ref(0)
  const recordTimer = ref()
  const formatTime = ref('00:00:00')
  clearInterval(recordTimer.value)
  recordTimer.value = setInterval(() => {
    time.value++
    const hours = Math.floor(time.value / 3600)
      .toString()
      .padStart(2, '0')
    const minutes = Math.floor((time.value % 3600) / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (time.value % 60).toString().padStart(2, '0')
    formatTime.value = `${hours}:${minutes}:${seconds}`
  }, 1000)

  onBeforeUnmount(() => {
    clearInterval(recordTimer.value)
  })
  return formatTime.value
}

export default useRecordTime
