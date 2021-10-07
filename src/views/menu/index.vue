<template>
  <div class="menu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div>
          <el-button @click="$router.push({ name: 'menu-create' })"
            >添加菜单</el-button
          >
        </div>
      </div>
      <div>
        <el-table :data="menus" style="width: 100%">
          <el-table-column prop="date" label="编号" type="index">
          </el-table-column>
          <el-table-column prop="name" label="菜单名称"> </el-table-column>
          <el-table-column prop="level" label="菜单级数"> </el-table-column>
          <el-table-column prop="icon" label="前端图标"> </el-table-column>
          <el-table-column prop="orderNum" label="排序"> </el-table-column>
          <el-table-column label="操作">
            <!-- 子组件中，给slot绑定属性，把scope值传过来 -->
            <!-- 相当于这里是父组件，子组件中的slot传过来的参数，我们用scope接收了。关键就是我们要怎么去接收传过来的东西 -->
            <!-- <template slot-scope="scope"> -->
            <template v-slot="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllMenus, deleteMenus } from '@/services/menu'

export default Vue.extend({
  name: 'MenuIndex',
  data () {
    return {
      menus: [] // 菜单列表
    }
  },
  created () {
    this.loadAllMenus()
  },
  methods: {
    async loadAllMenus () {
      const { data } = await getAllMenus()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    handleEdit (item: any) {
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: item.id
        }
      })
    },
    handleDelete (item: any) {
      // 拿到要删除的数据对象
      this.$confirm('确认删除吗？', '删除提示', {})
        .then(async () => { // 确认就执行这里
          // 请求删除操作
          const { data } = await deleteMenus(item.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            this.loadAllMenus() // 更新数据列表
          }
        }).catch(err => {
          console.log(err)
          this.$message.info('已取消删除')
        })
    }
  }
})
</script>

<style lang="scss" scoped></style>
