/**
 * 用户相关请求模块
 */

import request from '@/utils/request'
import qs from 'qs'

interface User {
  phone: string
  password: string
}

// 登录需要传参
export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // 在这里就可以不用指定写headers了，因为下面通过qs转换之后的data的时候，axios会自动把content-type设置为x-www-form-urlencoded
    // 下面调用了qs.stringify的话，他们默认就会把content-type转成application/x-www-form-urlencoded

    // 如果 data 是普通对象，则 Content-Type 是 application/json（axios默认）
    // 如果 data 是 qs.stringify(data) 转换之后的数据：key=value&key=value，则 Content-Type 会被设置为 application/x-www-form-urlencoded
    // 如果 data 是 FormData 对象，则 Content-Type 是 multipart/form-data（这种一般是HTML5里上传文件会用到，同样我们也不需要手动去写）
    data: qs.stringify(data) // axios 默认发送的是 application/json 格式的数据
    // axios默认发送的是application/json格式的数据类型，而经过实际测试，我们要的是x-www-form-urlencoded
  })
}

// 根据接口文档，获取用户信息是GET请求且不需要传参，仅需在请求头中有对应的有效token就行
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

export const getUserPages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

export const forbidUser = (userId: string | number) => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: {
      userId
    }
  })
}
