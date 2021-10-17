<template>
  <div class="resource-list">
    <el-card class="box-card">
      <!-- 搜索框 = S -->
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="form" class="demo-form-inline" ref="form">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入资源名称"></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="form.url" placeholder="请输入资源路径"></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <!-- 记得要把v-model改成对应的数据，不然提交表单的数据会无效 -->
            <el-select v-model="form.categoryId" placeholder="请选择资源分类" clearable>
              <el-option :label="item.name" :value="item.id" v-for="item in resourceCategories" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询搜索</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 搜索框 = E -->
      <div>
        <el-table :data="resources" style="width: 100%" v-loading="isLoading">
          <el-table-column type="index" label="编号"> </el-table-column>
          <el-table-column prop="name" label="资源姓名"> </el-table-column>
          <el-table-column prop="url" label="资源路径"> </el-table-column>
          <el-table-column prop="description" label="描述"> </el-table-column>
          <el-table-column prop="createdTime" label="添加时间">
          </el-table-column>
          <!-- 有slot-scope="scope" 属性，就可以拿到当前对象啦 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- total是总记录数，page-size是每页大小，分页组件会自动根据 total和page-size计算出要分多少页 -->
        <!-- @size-change="handleSizeChange" 的作用是：每当每页大小改变后，会触发执行这个handleSizeChange函数 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="form.current"
          :page-sizes="[5, 10, 20]"
          :page-size="form.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          :disabled="isLoading"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      resources: [], // 资源列表
      form: {
        name: '',
        url: '',
        current: 1, // 默认查询第一页数据（请求的分页 页码）
        size: 5, // 默认每页大小（每一页的大小）
        categoryId: null
      },
      totalCount: 0,
      resourceCategories: [], // 资源分类列表
      isLoading: true // Table 的加载中加载状态
    }
  },
  created () {
    this.loadResources()
    this.loadResourceCategories()
  },
  methods: {
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      this.resourceCategories = data.data
    },
    async loadResources () {
      this.isLoading = true // 展示加载中状态
      const { data } = await getResourcePages(this.form)
      this.totalCount = data.data.total
      this.resources = data.data.records
      this.isLoading = false // 关闭加载中状态
    },
    // 点击搜索 数据筛选
    onSubmit () {
      this.form.current = 1 // 筛选从第一页开始
      this.loadResources()
    },
    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1 // 每页大小改变重新查询第一页的数据，其实就是改变每页大小后，回到第一页
      this.loadResources()
    },
    handleCurrentChange (val: number) {
      // console.log(`当前页: ${val}`)
      // 请求获取对应页码的数据 无非就是重新发请求
      this.form.current = val // 修改要查询的页码
      this.loadResources()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1 // 重置回到第一页
      this.loadResources()
    },
    handleEdit () {
      console.log('删除')
    },
    handleDelete () {
      console.log('删除')
    }
  }
})
</script>

<style lang="scss" scoped></style>
