/**
 * 课程章节相关请求模块
 */

import request from '@/utils/request'

export const getSectionAndLesson = (courseId: string | number) => {
  return request({
    method: 'GET',
    // 配置了代理，所以调接口的时候要以boss开头
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }
  })
}

// 这么写也可以。其实好像好一些
export const requestNameGet = (params: string | number) => request.get('/boss/str/exampleGet', { params: params })
export const requestNamePost = (params: any) => request.get('/boss/str/examplePost', params)
