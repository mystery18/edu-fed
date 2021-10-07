<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :model="form">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="loading"
              >查询搜索</el-button
            >
            <el-button :disabled="loading" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <div>
          <!-- 点击后弹出确认框 -->
          <el-button @click="handleAdd">添加角色</el-button>
        </div>
        <div>
          <el-table :data="roles" style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="编号"> </el-table-column>
            <el-table-column prop="name" label="角色名称"> </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column prop="createdTime" label="添加时间">
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="text"
                    @click="
                      $router.push({
                        name: 'alloc-menu',
                        params: {
                          roleId: scope.row.id
                        }
                      })
                    "
                    >分配菜单</el-button
                  >
                  <el-button
                    type="text"
                    @click="
                      $router.push({
                        name: 'alloc-resource',
                        params: {
                          roleId: scope.row.id
                        }
                      })
                    "
                    >分配资源</el-button
                  >
                </div>
                <div>
                  <el-button type="text" @click="handleEdit(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleDelete(scope.row)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <!-- 弹出框 -->
    <el-dialog :title="isEdit? '编辑角色' : '添加角色' " :visible.sync="dialogVisible" width="30%">
      <!-- 弹出层关掉的时候，让这个组件销毁掉，用个v-if就可以了 具有条件渲染的功能 -->
      <create-or-edit @success="onSuccess" @cancel="dialogVisible = false" :role-id="roleId" :is-edit="isEdit" v-if="dialogVisible"></create-or-edit>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getRoles, deleteRole } from '@/services/role'
import { Form } from 'element-ui'
import CreateOrEdit from './CreateOrEdit.vue'

export default Vue.extend({
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      roles: [], // 角色列表
      form: {
        current: 1,
        size: 50,
        name: ''
      }, // 查询条件
      loading: false,
      dialogVisible: false, // 控制添加/编辑角色的对话框显示和隐藏
      roleId: null, // 编辑角色的 ID （初始是没有值的，只要当你点击编辑的时候才有）。存下来是因为要传递给子组件
      isEdit: false // 用来判断是否是编辑状态，false就不是编辑状态，而是添加
    }
  },

  created () {
    this.loadRoles()
  },
  methods: {
    async loadRoles () {
      this.loading = true
      const { data } = await getRoles(this.form)
      this.roles = data.data.records
      this.loading = false
    },

    onSubmit () {
      this.loadRoles()
    },
    // 点击编辑
    handleEdit (role: any) {
      this.dialogVisible = true
      // z这里要把你点击的，也就是这个role它相关的信息传递给添加角色的 子组件（所以那个子组件既可以添加也可以编辑）
      this.roleId = role.id // 当你点击编辑的时候，赋值。这个role就是你点击编辑的那个对象
      this.isEdit = true
    },

    async handleDelete (role: any) {
      try {
        await this.$confirm(`确认删除角色：${role.name}？`, '删除提示')
        await deleteRole(role.id)
        this.$message.success('删除成功')
        this.loadRoles()
      } catch (err) {
        if (err && err.response) {
          this.$message.error('删除失败，请重试')
        } else {
          this.$message.info('取消删除')
        }
      }
    },

    onReset () {
      (this.$refs.form as Form).resetFields()
      this.loadRoles()
    },

    onSuccess () {
      this.dialogVisible = false // 关闭对话框
      this.loadRoles() // 重新加载数据列表
    },
    // 点击添加角色
    handleAdd () {
      this.isEdit = false
      this.dialogVisible = true
    }
  }
})
</script>

<style lang="scss" scoped></style>
