<template>
  <div class="login">
    <!-- :model="ruleForm" :rules="rules" ref="ruleForm" 通过ref拿到表单组件 el-form-item 绑定 prop 属性 -->
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      :rules="rules"
      label-position="top"
    >
      <h2>请先登录</h2>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <div>
          <el-button
            type="primary"
            @click="onSubmit"
            class="formBtn loginBtn"
            :loading="isLoginLoading"
            >登录</el-button
          >
        </div>
        <!-- <div>
          <el-button class="formBtn regBtn">注册</el-button>
        </div> -->
        <div>
          <el-button class="formBtn" @click="resetForm">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import request from '@/utils/request'
// import qs from 'qs'
import { Form } from 'element-ui'
import { login } from '@/services/user'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur' // 失去焦点时触发验证行为
          },
          {
            pattern: /^1\d{10}$/, // 正则表达式
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 18,
            message: '长度在 6-18 个字符',
            trigger: 'blur'
          }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 1. 表单验证 通过JS获取验证结果,this.$refs['form']是获取表单组件，因为你上面写的是form，然后调用它的validate方法，但ts没有检测出类型
        // this.$refs['form'].validate() // 若不传入回调函数，则会返回一个 promise
        // await就是获取它的验证结果，如果验证成功了代码就继续往后执行了，如果失败了promise就失败了，后面的就不执行了。
        await (this.$refs.form as Form).validate() // validate方法对整个表单进行校验的方法.(点击登录按钮！对整个表单进行预验证)
        // 登录按钮 loading 让他转起来
        this.isLoginLoading = true
        // 2. 验证通过 -> 提交表单
        const { data } = await login(this.form)
        // const { data } = await request({
        //   method: 'POST',
        //   url: '/front/user/login',
        //   headers: {
        //     'content-type': 'application/x-www-form-urlencoded'
        //   },
        //   data: qs.stringify(this.form)
        // })

        // 3. 处理请求结果
        if (data.state !== 1) {
          this.$message({
            showClose: true,
            type: 'error',
            message: data.message
          })
        } else {
          // 1.登录成功，要记录登录状态，状态需要能够全局访问。是在任何模块或组件能访问到这个登录状态。（放到 vuex 容器中）
          this.$store.commit('setUser', data.content)
          // 2.然后在访问需要登录的页面的时候判断有没有登录状态，有 就可以让你访问页面，没有就跳到登录页（路由拦截器 vue-router）
          // 成功：去首页
          this.$router.push(this.$route.query.redirect as string || '/') // 如果没有就跳到首页去
          // this.$router.push({
          //   name: 'home'
          // })
          this.$message({
            showClose: true,
            type: 'success',
            message: '登录成功'
          })
        }
      } catch (err) {
        // console.log('登录失败' + err)
        console.log('Error Input')
      }
      // 无论成功或失败，loading结束
      this.isLoginLoading = false
    },
    resetForm () {
      // this.refs.form.resetFields()
      (this.$refs.form as Form).resetFields()
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  position: relative;
  .el-form {
    position: absolute;
    background-color: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 360px;
    padding: 30px 50px;
    border-radius: 5px;
  }
  .formBtn {
    width: 100%;
  }
  .loginBtn {
    margin-bottom: 22px;
  }
  h2 {
    text-align: center;
  }
}
</style>
