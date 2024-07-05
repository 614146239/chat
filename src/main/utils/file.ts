import { dialog } from 'electron'
import fs from 'fs'
import path from 'path'

export const openFile = async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      // { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] },
      { name: 'All Files', extensions: ['*'] } // 添加 '*' 允许选择任何文件
    ]
  })
  if (result.canceled) {
    return null // 用户取消选择
  }
  getFile(result.filePaths[0])
  return result.filePaths[0]
}

export const getFile = (filePath) => {
  try {
    const stats = fs.statSync(filePath)
    const fileSizeInBytes = stats.size // 文件大小（字节）
    const fileName = path.basename(filePath) // 文件名（不包含路径）
    const extension = path.extname(filePath) // 文件扩展名
    // 同步读取文件
    const data = fs.readFileSync(filePath, 'binary')

    // const data = fs.createReadStream(filePath)
    return {
      size: fileSizeInBytes,
      fileName: fileName,
      extension: extension,
      file: data
    }
    // 在这里处理文件内容
  } catch (err) {
    return null
  }
}
