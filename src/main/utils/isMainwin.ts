import { WindowArr } from '../type/index'
const isMainWin = (windowArr: WindowArr[]) => {
  let mainWindow
  windowArr.forEach((item) => {
    if (item.config.isMainWin) {
      mainWindow = item.win
    }
  })

  return mainWindow
}

export default isMainWin
