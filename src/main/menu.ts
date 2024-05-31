import { Menu, MenuItemConstructorOptions } from 'electron'
import isMainWin from './utils/isMainwin'
import { WindowArr } from './type'

const menu = (windowArr: WindowArr[]) => {
  const mainWindow = isMainWin(windowArr)
  const template = [
    // {
    //   label: '设置',
    //   click: () => {
    //     mainWindow.webContents.send('href', 'setting')
    //   }
    // },
    // {
    //   label: '屏幕录制',
    //   click: () => {
    //     mainWindow.webContents.send('href', 'index')
    //   }
    // }
  ] as MenuItemConstructorOptions[]

  // 固定写法
  const menu = Menu.buildFromTemplate(template)
  // 监听右键菜单事件
  mainWindow.webContents.on('context-menu', (e) => {
    e.preventDefault()
    Menu.setApplicationMenu(null)
    menu.popup()
  })
}
export default menu
