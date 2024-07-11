const useTime = (time) => {
  const currentTimestamp = Date.now()
  const lastTime = new Date(time)
  const deferredTime = currentTimestamp - lastTime.getTime()
  // deferredTime < 10 * 60 * 1000
  if (deferredTime < 0 || deferredTime < 10 * 60 * 1000) {
    return null
  } else if (deferredTime < 24 * 60 * 60 * 1000) {
    // 小于24小时
    return lastTime.toTimeString().split(' ')[0] // 返回例如 "13:14"
  } else if (deferredTime < 48 * 60 * 60 * 1000) {
    // 大于24小时且小于48小时
    return '昨天'
  } else if (deferredTime < 7 * 24 * 60 * 60 * 1000) {
    // 大于48小时且小于7天
    return lastTime.toLocaleDateString('zh-CN', { weekday: 'long' }) // 返回例如 "星期三"
  } else {
    // 大于7天
    return lastTime.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }) // 返回完整日期
  }
}

export default useTime
