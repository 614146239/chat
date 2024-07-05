// 控制应用生命周期和创建原生浏览器窗口的模组
import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/windowTray.png?asset'

// 菜单
import menu from './menu'
import './setUserTasks'
// 托盘
import { createTray } from './tray'
// 更新
import autoUpdate from './autoUpdater'

// 窗口类
import Window from './createWin'
const window = new Window()
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
function createWindow(): void {
  // 只能开启一个应用，不能多开
  // const gotTheLock = app.requestSingleInstanceLock()
  // if (!gotTheLock) {
  //   app.quit()
  // }
  // 创建浏览器窗口,zhu窗口

  const mainWindow = window.createWindows({
    width: 320,
    height: 448,
    path: '/',
    isMainWin: true,
    autoHideMenuBar: true, //自动隐藏菜单栏
    alwaysOnTop: true, //是否保持在最上层
    skipTaskbar: false, //是否在任务栏中显示窗口
    resizable: false, //窗口是否可以改变尺寸
    frame: false,
    titleBarStyle: 'default'
  })
  window.listen()

  // 创建系统托盘
  // createTray(window.windowArr)

  // 设置dock图标
  if (process.platform === 'darwin') {
    app.dock.setIcon(icon)
  }
  //自动更新
  // autoUpdate(window.windowArr)
}
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  // 通知名称
  electronApp.setAppUserModelId('仿qq')
  // 开发中的 F12 默认打开或关闭 DevTools
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

//除了 macOS 外，当所有窗口都被关闭的时候退出程序
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 在这个文件中，你可以包含应用程序剩余的所有部分的代码，
// 也可以拆分成几个文件，然后用 require 导入。
