import { onBeforeUnmount } from 'vue'
// 窗口拖动
function useDrag(node?: HTMLElement): (() => void) | undefined {
  const dragElement = node // 如果node未传入，则使用window
  let dragging = false
  let startCoords = { x: 0, y: 0 }

  const handleMouseDown = (event: MouseEvent) => {
    if (event.target === node) {
      event.stopPropagation() // 阻止冒泡
      event.preventDefault()
      dragging = true
      startCoords = { x: event.screenX, y: event.screenY }
    }
  }
  const width = window.outerWidth
  const height = window.outerHeight
  const handleMouseMove = (event: MouseEvent) => {
    if (dragging) {
      const newCoords = { x: event.screenX, y: event.screenY }
      const move = {
        x: event.screenX - startCoords.x,
        y: event.screenY - startCoords.y,
        width: width,
        height: height
      }
      window.api.drag(move)
      startCoords = newCoords
    }
  }

  const handleMouseUp = (): void => {
    dragging = false
  }

  dragElement?.addEventListener('mousedown', handleMouseDown, true)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)

  onBeforeUnmount(() => {
    dragElement?.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  })

  // 返回一个清理函数
  return (): void => {
    dragElement?.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }
}

export default useDrag
