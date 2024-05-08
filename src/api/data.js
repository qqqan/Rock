// 请求接口
import { http } from './http'

const API = {
    uploadImg: '/api/imageUpload',
    uploadFile: '/api/fileUpload',
    getImgs: '/api/getImgs',
}

// 上传图片
export const reqUploadImg = (data) => http.post(API.uploadImg, data)
// 上传文件
export const reqUploadFile = (data) => http.post(API.uploadFile, data)
// 获取全部图片
export const reqGetImgs = () => http.post(API.getImgs)
