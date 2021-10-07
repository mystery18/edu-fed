import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    meta: {
      requiresAuth: true // 自定义数据
    }, // meta默认是个空对象，你不写它也是存在的。
    // 只要父路由有，子路由也能匹配到的，所以它的子路由也会有这个属性，就省得写，但是不够灵活，因为默认layout下全部都需要登录，目前我们这符合
    children: [
      {
        path: '', // 留空，默认子路由。也就是上面是什么，默认就是渲染这个。
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */ '@/views/home/index.vue')
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */ '@/views/menu/index.vue')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */ '@/views/role/index.vue')
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */ '@/views/resource/index.vue')
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */ '@/views/course/index.vue')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */ '@/views/user/index.vue')
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */ '@/views/advert/index.vue')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */ '@/views/advert-space/index.vue')
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create-edit' */ '@/views/menu/create.vue')
      },
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-create-edit' */ '@/views/menu/edit.vue')
      },
      {
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: 'alloc-menu' */ '@/views/role/alloc-menu.vue'),
        props: true // 将路由路径参数 映射到组件的props属性中（用这种方式来解耦 传递参数）
      },
      {
        path: '/course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName: 'course-create' */ '@/views/course/create.vue')
      },
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunkName: 'course-edit' */ '@/views/course/edit.vue'),
        props: true
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: '404' */ '@/views/error-page/404.vue')
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫，任何页面的访问都要经过这里
// to：要去哪里的路由信息
// from：从哪来的路由信息
// next：放行的标志
router.beforeEach((to, from, next) => {
  // if(to.path!== '/login')
  // to.matched 是一个数组（匹配到是路由记录）这里匹配是否需要验证登录（如果匹配到了，说明这个路由是需要有登录认证）
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      // 判断如果没有登录状态，跳转到登录页面，让他去登录
      // 往登录页面跳的时候，就可以传一个参数，告诉登录页面我从哪来的
      next({
        name: 'login',
        query: {
          redirect: to.fullPath // 我要去的路由，把登录成功需要返回的页面告诉登录页，然后去登录页那边弄
        }
      })
    } else {
      // 判断如果当前有store中有登录状态，就放行
      next() // 允许通过 放行
    }
  } else {
    // 嗯如果没有匹配到你要去的那个路由里 需要登录认证，也放行
    next()
  }
})

export default router
