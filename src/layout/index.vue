<template>
  <div class="layout">
    <el-container>
      <el-aside width="200px">
        <app-aside></app-aside>
      </el-aside>
      <el-container>
        <el-header>
          <app-header></app-header>
        </el-header>
        <el-main>
          <!-- 子路由出口 -->
          <router-view></router-view>
        </el-main>
        <el-footer>
          <app-footer></app-footer>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppAside from './components/app-aside.vue'
import AppHeader from './components/app-header.vue'
import AppFooter from './components/app-footer.vue'
export default Vue.extend({
  name: 'LayoutIndex',
  components: {
    AppAside,
    AppHeader,
    AppFooter
  }
})
</script>

<style lang="scss" scoped>
.el-header {
  // background-color: #b3c0d1;
  background-color: #fff;
}
.el-container {
  min-height: 100vh;
  // 你给30vh就是占整个屏幕高度的30%
  min-width: 980px;
  // 屏幕有可能会被拉伸 内容会变形，给它个最小宽度.防止内容多被挤压的不好看。
}
.el-aside {
  background-color: #d3dce6;
}
.el-main {
  background-color: #e9eef3;
}
.el-footer {
  background-color: #b3c0d1;
}
</style>
