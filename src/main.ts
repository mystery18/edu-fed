import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
  // 通过render方法把App根组件渲染到app节点的入口这里
}).$mount('#app')
