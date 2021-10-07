<template>
  <div class="create">
    <create-or-edit is-edit :course-id="courseId"></create-or-edit>
    <!-- 这个组件需要那个courseId，因为他要根据id去加载课程的字段 -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './components/CreateOrEdit.vue'

export default Vue.extend({
  name: 'CourseCreate',
  // 因为我在路由配置的时候设置了true，所以可以拿到。这样可以解耦
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    CreateOrEdit
  }
})
</script>

<style lang="scss" scoped></style>
