import router from '../router/index'
function useCloseWindow(id?: number | string): void {
  const route = router.currentRoute.value
  const winID = id ?? Number(route.query.id)
  if (winID) {
    window.api.closeWindow(winID)
    return
  }
  window.close()
}

export default useCloseWindow
