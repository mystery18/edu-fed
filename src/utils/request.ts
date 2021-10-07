import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      // 它从哪里来的，到时候可以回去
      redirect: router.currentRoute.fullPath
    }
  })
}
function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 请求拦截器（只要有请求，就会经过请求拦截器）
request.interceptors.request.use(function (config) {
  // 我们就可以在这里通过改写 config 配置信息来实现业务功能的统一处理。config就是本次请求相关的数据。
  const { user } = store.state
  if (user && user.access_token) { // 如果vuex里有数据了，在请求之前，把headers设置好
    // 在请求拦截器里面 通过改写config里的headers，统一设置了access token（这一串其实就是用来统一设置headers的，放在拦截器这里而已实现而已）
    config.headers.Authorization = user.access_token // 你发起请求的时候，请求拦截器就会去获取vuex里的token，让请求头都带这个token
  }
  // 注意这里一定要返回 config，否则请求就发不出去了。
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器（收到响应以后，会优先进入拦截器，经过拦截器以后，再走到我们真正发请求的响应里）响应成功走这里
let isRfreshing = false // 控制刷新token 的状态
let requests: any[] = [] // 存储刷新 token 期间过来的 401 请求

request.interceptors.response.use(function (response) {
  // 当状态码为2xx 都会进入这里
  // 如果是后端返回的是 如果使用自定义状态码的话，错误处理就写到这里。记得要写return响应，不然你拦了，又不把相应返回，就没东西了。
  return response
}, async function (error) {
  // 超出2xx范围的状态码都在这执行，响应失败走这里（下面一大串处理token过期情况，根据相应码）
  // 如果是使用Http错误状态码，错误处理就写到这里
  if (error.response) {
    // 请求收到响应了，但是状态码超出了2开头的范围（这里的逻辑就比较多了...）
    // 常见的http状态码：400 401 403 404 500，不是乱写的，具体还要看你和后端的约定，看后端返回的是什么，在这个项目的接口文档里可以瞅瞅
    const { status } = error.response // 拿到响应的状态码
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token无效（情况多，例如没有提供token token无效 token过期了等）401失败意味着需要重新登录，要获取新的token才行
      // 这里两个if应该是两种情况：重新登录或者刷新获取新的token
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      // 刷新token
      if (!isRfreshing) {
        isRfreshing = true // 要刷新啦，锁住！
        // 如果有 refresh_token 则尝试使用它来获取新的 access_token。如果获取成功了，就把本次失败的请求重新发出去.
        // 尝试发生请求，获取新的token。单独创建一个请求实例，它没有拦截器，单独处理，否则失败的话，会进入死循环：401了？刷新token？refresh也是401？刷！
        // 想知道请求成功失败与否
        return refreshToken().then(res => {
          if (!res.data.success) throw new Error('刷新 TOKEN 失败')
          // 意味着刷新token 成功了，更新state
          store.commit('setUser', res.data.content)
          // 把 requests 队列中的请求 重新发出去
          requests.forEach(cb => cb())
          // 只要失效就存在数组里了，如果你不对这个数组进行清除，它里面会一直往里面累加请求数据
          // 要重置 requests 数组
          requests = []
          return request(error.config)
        }).catch(err => {
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(err)
        }).finally(() => {
          isRfreshing = false
        })
      }
      // 刷新状态下，把请求挂起，放到 requests 数组中（很难理解）
      // 为什么要用promise呢？因为promise可以控制它的完成状态，如果你不让他内部resolve，promise就一直处于pending状态，也不会断开，就是等待的状态
      // promise 也不是上来就 resolve，先存起来，所以给数组里push一个函数，函数里面去调用resolve，resolve接收一个参数，就是失败请求返回的 promise 给了resolve
      // resolve接到了，还是你最终请求之后的promise。就是这样把它挂起来，直到我们调用resolve的时候，这个失败的请求，才会重新被发出去。
      // 什么时候调用 resolve的，在刷新token成功之后。在存储了user状态之后，循环requests队列，把里面的函数一个一个把它调一下，那调完以后，就把
      // 原来失败的请求都给他重新发出去。
      // 还要记得把数组重置，要不然数组会一直累积很多 在刷新存储的失败请求。
      return new Promise(resolve => {
        // 怎么把请求挂起？返回一个不执行resolve的promise，因为promise不结束，请求就会一直等待
        requests.push(() => {
          resolve(request(error.config)) // 把error里的config配置对象传进来，把这个错误的请求给它重新发出去，它的结果给到resolve
          // 那 resolve 又作为 promise 的返回结果，最后还是回到你正在发请求的地方
        })
      })
      // 数组里面添加一个函数，函数里面调用resolve，resolve里面调用request

      // 不用try catch了 因为已经捕获不到了，直接调用已经封装好的获取refresh token的方法
      // try {
      //   const { data } = await axios.create()({
      //     method: 'POST',
      //     url: '/front/user/refresh_token',
      //     data: qs.stringify({
      //       refreshtoken: store.state.user.refresh_token
      //     })
      //   })
      //   // 把成功刷新拿到的新的access_token更新到容器和本地存储
      //   store.commit('setUser', data.content)
      //   // （存完之后，有数据啦）把本次失败的请求重新发出去
      //   return request(error.config) // error.config失败请求的配置信息。刚好error.config里包含了请求需要的参数，就不用谢methods url什么的了
      //   // 要return因为真正发请求的地方才能拿到，它的返回值是promise return出去
      // } catch (err) {
      //   // 尝试获取刷新token失败了，把当前登录用户状态清除掉
      //   store.commit('setUser', null)
      //   // 如果连 refresh_token 都没有 就直接去登录页重新登录吧
      //   // 获取失败后跳转到登录页去重新登录，获取新token
      //   redirectLogin()
      //   return Promise.reject(err)
      // }
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
    // 以上根据不同的错误给出不同的消息提示，让用户知道现在是怎么了怎么做
  } else if (error.request) {
    // 请求发出去了，但是没有收到响应（一般是请求超时或者你网络断开了 会走到这里）
    Message.error('请求超时，请刷新重试')
    // console.log(error.request);
  } else {
    // 在设置请求的时候发生了一些事情，触发了一个错误
    // console.log('Error', error.message)
    Message.error(`请求失败：${error.message}`)
  }
  // 把请求失败的错误对象继续抛出，扔给下一个（我们处理完之后，把里面的错误继续抛出，因为后面可能正在发请求的地方还想要拿到这个错误信息）
  return Promise.reject(error)
})

export default request
