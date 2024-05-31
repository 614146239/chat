export interface WindowConfig {
  id?: string | number //唯一id
  path?: string // 页面路由URL '/manage?id=123'
  data?: null //数据
  isMultiWindow?: boolean //是否支持多开窗口 (如果为false，当窗体存在，再次创建不会新建一个窗体 只focus显示即可，，如果为true，即使窗体存在，也可以新建一个)
  isMainWin?: boolean //是否主窗口(当为true时会替代当前主窗口)
  parentId?: string //父窗口id  创建父子窗口 -- 子窗口永远显示在父窗口顶部 【父窗口可以操作】
  modal?: boolean //模态窗口 -- 模态窗口是禁用父窗口的子窗口，创建模态窗口必须设置 parent 和 modal 选项 【父窗口不能操作】
}
export interface WindowArr {
  win: BrowserWindow
  path?: string
  config: BrowserWindowConstructorOptions & Config
}
