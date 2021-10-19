<template>
  <!-- <div class="course-section">课程内容</div> -->
  <div class="course-section">
    <el-card>
      <div slot="header">
        课程列表
      </div>
      <!-- 用props指定你的数据中哪个是子节点，哪个是节点名称，会去使用到这个数据 -->
      <el-tree :data="sections"
        :props="defaultProps"
        draggable
      >
      <!-- 要自定义树形控件的话，就要用到插槽（那就要自己写 树里面的内容啦！） -->
      <!-- node.label对应的就是数据中的label。这里只是用模板来手动绑定了。data 就是绑定节点的数据对象 -->
      <!-- <template v-slot="{ node, data }">
        <span>{{ node.label }}666</span>
        <span v-if="data.sectionName" class="actions">
          <el-button >编辑</el-button>
          <el-button>添加课时</el-button>
          <el-button>状态</el-button>
        </span>
        <span v-else class="actions">
          <el-button>编辑</el-button>
          <el-button>上传课时</el-button>
          <el-button>状态</el-button>
        </span>
      </template> -->
      <!-- 如果有sectionName证明是阶段。否则就是课时 -->
      <div class="inner" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span v-if="data.sectionName" class="actions">
          <el-button >编辑</el-button>
          <el-button>添加课时</el-button>
          <el-button>状态</el-button>
        </span>
        <span v-else class="actions">
          <el-button>编辑</el-button>
          <el-button>上传课时</el-button>
          <el-button>状态</el-button>
        </span>
      </div>
      </el-tree>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getSectionAndLesson } from '@/services/course-section'

export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        // 告诉他子节点列表的名称是lessonDTOS,会去遍历
        children: 'lessonDTOS',
        // label是用来设置节点展示的名称
        // label: 'label'
        label (data: any) {
          return data.sectionName || data.theme
        }
      }
    }
  },
  created () {
    this.loadSections()
  },
  methods: {
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      this.sections = data.data
    }
  }
})
</script>

<style lang="scss" scoped>
.inner {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}

::v-deep .el-tree-node__content {
  height: auto;
}
</style>
