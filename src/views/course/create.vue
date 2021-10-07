<template>
  <div class="create">
    <create-or-edit></create-or-edit>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './components/CreateOrEdit.vue'

export default Vue.extend({
  name: 'CourseCreate',
  components: {
    CreateOrEdit
  }
})
</script>

<style lang="scss" scoped></style>
