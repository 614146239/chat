import { Upload } from '@renderer/api/interface/index'
import { authPort } from '../config/servicePort'
import http from '@renderer/api'

/**
 * @name 文件上传模块
 */
// 图片上传
export const chatUpload = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(authPort + `/chatUpload`, params, { cancel: false })
}

// 视频上传
export const uploadVideo = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(authPort + `/file/upload/video`, params, { cancel: false })
}
