import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
  nativeImage,
  shell
} from 'electron'
import { createTray } from './tray'
import menu from './menu'
import icon from '../../resources/windowTray.png?asset'
import { join } from 'path'
// import url from 'url'
import { is } from '@electron-toolkit/utils'
// 录制屏幕
import screenCapturer from './desktopCapturer '
import { WindowArr, WindowConfig } from './type'
class Window {
  main: null
  windowArr: WindowArr[]
  constructor() {
    this.main = null //当前页
    this.windowArr = [] //窗口组
  }
  defaultConfig(): BrowserWindowConstructorOptions & WindowConfig {
    return {
      width: 600,
      height: 600,
      show: false,
      autoHideMenuBar: true, //自动隐藏菜单栏
      alwaysOnTop: false, //是否保持在最上层
      skipTaskbar: true, //是否在任务栏中显示窗口
      resizable: false, //窗口是否可以改变尺寸
      titleBarStyle: 'default', //mac下隐藏导航栏
      maximizable: true,
      icon: icon,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        webSecurity: false //是否禁用同源策略
      }
    }
  }
  // 获取窗口
  getWindow(id) {
    return BrowserWindow.fromId(id)
  }
  // 获取全部窗口
  getAllWindows() {
    return BrowserWindow.getAllWindows()
  }

  // 创建窗口
  createWindows(options: BrowserWindowConstructorOptions & WindowConfig) {
    const windowConfig = Object.assign({}, this.defaultConfig(), options)

    // 判断窗口是否存在
    // for (const i in this.windowArr) {
    //   if (
    //     this.getWindow(Number(i)) &&
    //     this.windowArr[i].path === windowConfig.path &&
    //     !windowConfig.isMultiWindow
    //   ) {
    //     this.getWindow(Number(i)).focus()
    //     return
    //   }
    // }
    for (let i = 0; i < this.windowArr.length; i++) {
      const item = this.windowArr[i]
      // 如果重复打开窗口,让窗口聚焦
      if (this.getWindow(item.win.id) && item?.path === options.path) {
        this.getWindow(Number(item.config.id))?.focus()
        return
      }
    }

    if (options.isMainWin) {
      this.windowArr.forEach((el) => {
        el.config.isMainWin = false
      })
    }
    const win = new BrowserWindow(windowConfig)
    this.windowArr.push({
      path: windowConfig.path,
      config: windowConfig,
      win: win
    })

    // win.on('close', () => win.setOpacity(0))
    // 打开网址（加载页面）
    // HMR 用于基于electron cli 的渲染器。
    // 只能用hash模式
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      if (windowConfig.path) {
        win.loadURL(process.env['ELECTRON_RENDERER_URL'] + `#${windowConfig.path}?id=${win.id}`)
      } else {
        win.loadURL(process.env['ELECTRON_RENDERER_URL'] + `#?id=${win.id}`)
      }
    } else {
      // 加载 index.html
      if (windowConfig.path) {
        win.loadFile(join(__dirname, '../renderer/index.html'), {
          hash: `${windowConfig.path}?id=${win.id}`
        })
      } else {
        win.loadFile(join(__dirname, '../renderer/index.html'))
      }
    }
    win.once('ready-to-show', () => {
      win.show(),
        //系统托盘
        createTray(this.windowArr)
      // 右键菜单
      // menu(this.windowArr)
    })

    // 当窗口被关闭时触发
    win.on('close', (event) => {
      if (windowConfig.isMainWin) {
        // 阻止默认行为
        event.preventDefault()
        // 隐藏窗口
        win.hide()
      }
    })
    win.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
    const icon = nativeImage.createFromPath(join(__dirname, '../../resources/windowTray.png'))
    win.setIcon(icon)
    return win
  }
  listen() {
    // 录制
    ipcMain.handle('recording', screenCapturer)
    // 创建窗口
    ipcMain.on('createWindow', (_, args) => {
      this.createWindows(args)
    })
    // 关闭窗口
    ipcMain.on('closeWindow', (_, winId) => {
      if (winId) {
        this.getWindow(Number(winId))?.close()
        this.windowArr = this.windowArr.filter((item) => {
          return item.config.id != winId
        })
      }
    })
    //无边框 窗口移动
    ipcMain.handle('drag', (_, move, winId) => {
      const win = winId ? this.getWindow(Number(winId)) : BrowserWindow.getFocusedWindow()
      const winBounds = win!.getBounds()
      win?.setBounds({
        x: winBounds.x + move.x,
        y: winBounds.y + move.y,
        width: winBounds.width,
        height: winBounds.height
      })
    })
    // 窗口按比例放大缩小
    ipcMain.on('resize', (_, winId, isCircle) => {
      if (winId) {
        const win = this.getWindow(Number(winId))
        if (isCircle) {
          win?.setAspectRatio(1)
        } else {
          win?.setAspectRatio(4 / 3)
        }
      }
    })
    // 切换窗口形态
    ipcMain.on('changeShape', (_, winId, width, isCircle) => {
      if (winId) {
        const win = this.getWindow(Number(winId))
        if (isCircle) {
          win?.setSize(width, width)
        } else {
          // 长边
          // win?.setSize(width, (width * 3) / 4)
          // 短边
          win?.setSize(Math.trunc((width * 4) / 3), width)
        }
      }
    })
    // 窗口全屏
    ipcMain.on('setFullScreen', (_, winId, isFullScreen) => {
      if (winId) {
        const win = this.getWindow(Number(winId))
        win?.setAspectRatio(0)
        win?.setFullScreen(isFullScreen)
      }
    })
  }
}

export default Window
