// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `prependData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        prependData: `@import "~@/styles/variables.scss";`
      }
    }
  },

  devServer: {
    // 这个代理仅针对npm run serve 运行的开发服务有效，即npm run serve实际上运行的是vuecli内部所启动的http服务
    // 如果你用了代理，而serve的话它只能托管静态资源，不支持代理配置，所以你用serve测试时就满足不了需求
    proxy: {
      // 这个boss是随便起的名字 比如你写/a 所有/a开头的请求都会被转发到target目标地址
      '/boss': {
        target: 'http://eduboss.lagou.com', // 接口域名
        // ws: true, // 我们这里没有websocket协议
        changeOrigin: true // 把请求头中的host配置为 target
      },
      '/front': {
        target: 'http://edufront.lagou.com',
        changeOrigin: true // 你去请求front 那请求头里面的host就是target
      }
    }
  }
}