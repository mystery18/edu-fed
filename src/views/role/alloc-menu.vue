<template>
  <div class="alloc-menu">
    <el-card>
      <div slot="header">
        <span>分配权限</span>
      </div>
      <div>
        <!-- 拿到你当前这个角色所拥有的菜单列表，找到它里面的ID，放到那个:default-checked-keys的数组里面 -->
        <el-tree ref="menu-tree" node-key="id"
          show-checkbox
          default-expand-all
          :default-checked-keys="checkedKeys"
          :data="menus"
          :props="defaultProps"
        ></el-tree>
        <div class="btn">
          <el-button @click="resetChecked">清空</el-button>
          <el-button type="primary" @click="onSave">保存</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
// 当前组件是作为一个路由组件来使用，它当前还依赖了路由参数roleId，如果这个组件想要它*不作为路由组件去使用该怎么办
// 如果不作为路由组件，那是不是必须得确保里面有个roleId才行，这个肯定是没法保证了，所以需要让数据和路由去解耦。
import Vue from 'vue'
// 现在在页面中需要使用roleId来获取这个角色对应的菜单列表，进行展示，关键就在于怎么拿到这个roleId，因为他是个动态的路由路径参数。
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocMenu',
  props: {
    // 路由组件怎么传递参数呢？在路由规则里去加配置项。当路由在匹配到这个组件时，路由就会自动把动态路径参数去传递给子组件props参数
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        // 这里要重新设置，因为接口里面的字段要对应上，否则它不知道在我的数据中，比如我们接口子节点字段是subMenuList 这里是children
        children: 'subMenuList',
        label: 'name' // 我们接口里面的数据叫name
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadMenus()
    this.loadRoleMenus()
  },
  methods: {
    async loadMenus () {
      const { data } = await getMenuNodeList()
      this.menus = data.data
    },
    async onSave () {
      // 拿到选中节点的数据 id 列表，因为接口需要
      // 请求提交保存
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys() // 获取当前树中，选中的的节点key值
      console.log(menuIdList)
      await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
      })
      this.$message.success('操作成功')
      this.$router.back()
    },
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      this.getCheckedKeys(data.data)
    },
    getCheckedKeys (menus: any) {
      menus.forEach((menu: any) => {
        if (menu.selected) {
          // 他说不能把any放到never类型的数组中，因为checkedKeys数组里的元素没有具体的类型，识别为never，此时要把id as never，这样never就能放在never里面
          // this.checkedKeys.push(menu.id as never)
          // 不用push了 因为push 好像不能触发视图更新
          this.checkedKeys = [...this.checkedKeys, menu.id] as any
        }
        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList) // 递归遍历
        }
      })
    },
    resetChecked () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    }
  }
})
</script>

<style lang="scss" scoped>
.btn {
  margin-top: 20px;
  text-align: center;
}
</style>
