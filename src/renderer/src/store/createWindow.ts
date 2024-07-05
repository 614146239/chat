import { defineStore } from 'pinia'
const screenWidth = screen.width
const screenHeight = screen.height
const positionX = (width, percent) => {
  return Math.trunc(screenWidth - width - screenWidth * (percent / 100))
}
const positionY = (height, percent) => {
  return Math.trunc(screenHeight - height - screenHeight * (percent / 100))
}
export const createWindow = defineStore(
  'createWindow',
  () => {
    // 登录窗口
    const login = () => {
      window.api.createWindow({
        path: '/login',
        width: 320,
        height: 448,
        autoHideMenuBar: true, //自动隐藏菜单栏
        alwaysOnTop: true, //是否保持在最上层
        frame: false, //windows去除标题栏和窗口控制按钮
        transparent: false //窗口背景透明
        // skipTaskbar: false
      })
    }
    // 聊天窗口
    const mainMenu = () => {
      window.api.createWindow({
        path: '/chatDefault',
        width: 960,
        height: 640,
        isMainWin: true, //主窗口
        autoHideMenuBar: true, //自动隐藏菜单栏
        alwaysOnTop: false, //是否保持在最上层
        frame: false, //windows去除标题栏和窗口控制按钮
        transparent: false, //窗口背景透明
        resizable: true,
        skipTaskbar: false
      })
    }

    // 搜索好友
    const searchFriend = () => {
      window.api.createWindow({
        path: '/searchFriend',
        width: 680,
        height: 720,
        isMainWin: false, //主窗口
        autoHideMenuBar: true, //自动隐藏菜单栏
        alwaysOnTop: false, //是否保持在最上层
        frame: false, //windows去除标题栏和窗口控制按钮
        transparent: false, //窗口背景透明
        resizable: true,
        skipTaskbar: false
      })
    }
    const addFriend = (friendInfo) => {
      window.api.createWindow({
        path: `/addFriend/${friendInfo}`,
        width: 320,
        height: 480,
        isMainWin: false, //主窗口
        autoHideMenuBar: true, //自动隐藏菜单栏
        alwaysOnTop: true, //是否保持在最上层
        frame: false, //windows去除标题栏和窗口控制按钮
        transparent: false, //窗口背景透明
        resizable: true,
        skipTaskbar: false
      })
    }
    const videoChat = (room: string, isPhone: boolean) => {
      window.api.createWindow({
        path: `/videoChat/${room}/${isPhone}`,
        width: 800,
        height: 580,
        isMainWin: false, //主窗口
        autoHideMenuBar: true, //自动隐藏菜单栏
        alwaysOnTop: true, //是否保持在最上层
        frame: false, //windows去除标题栏和窗口控制按钮
        transparent: false, //窗口背景透明
        resizable: true,
        skipTaskbar: false
      })
    }
    // 添加好友

    //创建摄像头窗口
    // const cameraWindow = () => {
    //   window.api.createWindow({
    //     path: '/webcam',
    //     width: config.isCircle ? 300 : 400,
    //     height: config.isCircle ? 300 : 300,
    //     show: false,
    //     autoHideMenuBar: true, //自动隐藏菜单栏
    //     alwaysOnTop: true, //是否保持在最上层
    //     frame: false, //windows去除标题栏和窗口控制按钮
    //     transparent: true, //窗口背景透明
    //     modal: true,
    //     x: positionX(300, 10),
    //     y: positionY(300, 7),
    //     skipTaskbar: true // 不在任务栏中显示窗口图标
    //   })
    // }
    const recordWindow = () => {
      window.api.createWindow({
        path: '/recording',
        width: 350,
        height: 80,
        show: false,
        autoHideMenuBar: true,
        alwaysOnTop: true,
        frame: false,
        modal: true,
        x: positionX(350, 5),
        y: positionY(100, 85),
        skipTaskbar: true // 不在任务栏中显示窗口图标
      })
    }
    const countDownWindow = () => {
      window.api.createWindow({
        path: '/countDown',
        width: screen.width,
        height: screen.height,
        autoHideMenuBar: true, //自动隐藏菜单栏
        alwaysOnTop: true, //是否保持在最上层
        frame: false, //windows去除标题栏和窗口控制按钮
        transparent: true, //窗口背景透明
        skipTaskbar: false
      })
    }
    return {
      login,
      // cameraWindow,
      recordWindow,
      countDownWindow,
      mainMenu,
      searchFriend,
      addFriend,
      videoChat
    }
  },
  {
    persist: true
  }
)
