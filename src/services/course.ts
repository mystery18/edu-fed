/**
 * 课程相关请求模块
 */

import request from '@/utils/request'

export const getQueryCourses = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

export const changeState = (params: any) => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}

export const saveOrUpdateCourse = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

// 需要通过函数参数的方式onUploadProgress 传进去。axios内部的类型定义ProgressEvent
export const uploadCourseImage = (data: any, onUploadProgress?: (progressEvent: ProgressEvent) => void) => {
  // **该接口要求的请求数据类型是：multipart/form-data
  // 所以需要提交 FormData 数据对象
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data, // 需要提供FormData 数据对象，所以你提交的时候要去new这个对象
    // HTML5 新增的上传响应事件：progress （原生的事件名），axios做了包装，暴露给我们的名字叫 onUploadProgress
    // onUploadProgress (e) {
    //   console.log(e.loaded) // 已上传的数据大小
    //   console.log(e.total) // 上传文件的总大小
    //  // 进度百分比 向下取整。**关键是要把这个百分比数据放到组件里！！！！
    // }
    onUploadProgress
  })
}

export const getCourseById = (courseId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}
