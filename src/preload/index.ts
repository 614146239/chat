import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 用于渲染器的自定义 API
// 渲染进程向主进程
const api = {
  // 右键菜单
  // contextMenu: (e) => {
  //   e.preventDefault()
  //   ipcRenderer.send('contextMenu')
  // },
  // 拖动
  drag: async (opt: { x: number; y: number }) => {
    // invoke 同步等待结果返回，执行下一步
    await ipcRenderer.invoke('drag', opt)
  },
  // 录制
  recording: () => {
    return ipcRenderer.invoke('recording')
  },

  // 创建窗口
  createWindow: (args) => {
    // send异步
    ipcRenderer.send('createWindow', args)
  },
  // 关闭窗口
  closeWindow: (winId) => {
    ipcRenderer.send('closeWindow', winId)
  },
  resize: (winId: number, isCircle: boolean) => {
    ipcRenderer.send('resize', winId, isCircle)
  },
  changeShape: (w, h) => {
    ipcRenderer.send('changeShape', w, h)
  },
  setFullScreen: (isFullScreen) => {
    ipcRenderer.send('setFullScreen', isFullScreen)
  },
  miniMize: () => {
    ipcRenderer.send('minimize')
  },
  setInfo: async (key, value) => {
    await ipcRenderer.invoke('setInfo', key, value)
  },
  getInfo: (key) => {
    return ipcRenderer.sendSync('getInfo', key)
  },
  openFolder: async () => {
    return await ipcRenderer.invoke('open-folder-dialog')
  }
}
// 主进程向渲染进程
const electron = {
  // 录屏
  screenCapturer: (arg) => {
    ipcRenderer.once('screenCapturer', arg)
  },
  // 下载进度条
  downloadProgress: (callback) => {
    ipcRenderer.on('downloadProgress', callback)
  }
  // 退出登录
  // logout: (callback) => {
  //   ipcRenderer.invoke('logout', callback)
  // }
}

// 使用“contextBridge”API仅在启用上下文隔离时才向渲染器公开Electron API，
// 否则只需添加到DOM全局
if (process.contextIsolated) {
  try {
    // 向渲染进程通知
    contextBridge.exposeInMainWorld('electron', { ...electronAPI, ...electron })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
