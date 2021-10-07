<template>
  <div class="">
    <el-form>
      <el-form-item label="角色名称">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="role.code"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input type="textarea" v-model="role.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createOrUpdate, getRoleById } from '@/services/role'

export default Vue.extend({
  name: 'CreateOrEditRole',
  props: {
    roleId: {
      type: [String, Number] // 这个类型是vue中的prop数据类型的校验，不是ts的类型校验
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      role: {
        code: '',
        name: '',
        description: ''
      }
    }
  },
  // 内部组件的生命周期只会执行一次。我们希望它每一次关闭/打开 里面的组件重新渲染，重新执行生命周期，才能拿到对应的数据
  created () {
    // 如果是编辑操作，则根据角色ID去加载展示你要编辑的信息
    this.isEdit && this.loadRole()
  },
  methods: {
    async onSubmit () {
      // const { data } = await createOrUpdate(this.role)
      await createOrUpdate(this.role)
      this.$message.success('操作成功')
      // 提交完表单之后要关闭对话框，但是对话框是在父组件上，所以要用组件通信
      this.$emit('success')
    },
    async loadRole () {
      const { data } = await getRoleById(this.roleId)
      this.role = data.data
    }
  }
})
</script>

<style lang="scss" scoped></style>
