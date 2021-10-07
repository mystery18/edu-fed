import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 容器的状态实现了数据共享，在组件里访问方便，但是没有持久化功能，刷新就没了
  state: {
    // user: null // 当前登录用户状态，这里就会有用户的ID 昵称 token等等数据
    // 因为JSON.parse要求接收的是字符串，但是里面返回的值可能是string或null两种 联合类型的值，所以写个或字符串的null
    user: JSON.parse(window.localStorage.getItem('user') || 'null') // 这里state就是在读localstorage数据
  },
  mutations: {
    // 修改容器数据必须使用mutation函数(什么时候调用mutation呢？肯定登录成功以后啦！调用mutation方法 存储到state中)
    setUser (state, payload) {
      state.user = JSON.parse(payload) // 传过来的content是JSON字符串，把JSON格式字符串转换成*对象*存储到user里面
      // 把整个(对象)存到了 user 里面
      // 为了防止页面刷新数据丢失，需要把 user 数据持久化(注意！ 本地存储只能存字符串)刚好传过来的payload就是字符串
      window.localStorage.setItem('user', payload)
      // 我们在通过mutation方法中，同时操作store和localStorage
    }
  },
  actions: {
  },
  modules: {
  }
})
// 丢进localStorage需要字符串，所以需要stringify。那从localStorage拿出来就要JSON.parse取出来
