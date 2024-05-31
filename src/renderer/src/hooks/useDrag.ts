import router from '../router/index'

// 窗口拖动
function useDrag(node?: HTMLElement): (() => void) | undefined {
  const route = router.currentRoute.value
  const dragElement = node || window // 如果node未传入，则使用window

  let dragging = false
  let startCoords = { x: 0, y: 0 }

  const handleMouseDown = (event: MouseEvent) => {
    if (dragElement === window || event.target === node) {
      dragging = true
      startCoords = { x: event.screenX, y: event.screenY }
    }
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (dragging) {
      const newCoords = { x: event.screenX, y: event.screenY }
      const move = {
        x: event.screenX - startCoords.x,
        y: event.screenY - startCoords.y
      }
      window.api.drag(move, Number(route.query.id))
      startCoords = newCoords
    }
  }

  const handleMouseUp = (): void => {
    dragging = false
  }

  // 绑定事件
  dragElement.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)

  // 返回一个清理函数
  return (): void => {
    dragElement.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }
}

export default useDrag
