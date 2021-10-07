<template>
  <div class="course-image">
    <el-progress type="circle" :percentage="percentage" :width="178" v-if="isUploading" :status="percentage === 100 ? 'success': undefined "></el-progress>
    <!-- on-success当你上传提交成功后，发了请求成功后，会执行这个回调。但是我们这不需要了，我们是自定义上传 -->
    <!-- 当我自己设置了http-request属性后绑定到方法后，它就不会帮你去上传，要自己去实现上传行为 -->
    <el-upload
      v-else
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="handleUpload"
    >
    <!-- 这个img 就要显示你传给我的这个数据！ -->
      <img v-if="value" :src="value" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { uploadCourseImage } from '@/services/course'

export default Vue.extend({
  name: 'CourseImage',
  props: {
    value: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      isUploading: false,
      percentage: 0
    }
  },
  methods: {
    beforeAvatarUpload (file: any) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < this.limit

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error(`上传头像图片大小不能超过 ${this.limit}MB!`)
      }
      return isJPG && isLt2M
      // 如果这里这个方法返回 false的话，就不会去调用下面的handleUpload啦，就不会去上传文件，上传文件前的文件 格式、文件大小
    },
    // upload 组件中的 http-request 属性：覆盖默认的上传行为，可以自定义上传的实现
    // options是这个组件，他会把上传相关的参数发送给你！！我们其实要的是它里面的文件属性file,有了它就可以提交给服务端了
    async handleUpload (options: any) {
      // console.log(options)
      this.isUploading = true // 当请求开始
      const fd = new FormData()
      fd.append('file', options.file) // 这里写'file'是因为接口文档中的字段要求是file，值就是文件对象
      const { data } = await uploadCourseImage(fd, e => {
        this.percentage = Math.floor(e.loaded / e.total * 100)
      })
      // console.log(data.data.name) // 此时服务端返回的是 服务端的图片地址，它返回的是图片地址
      // this.course.courseListImg = data.data.name // 把我上传后得到的图片地址，存到到表单的数据对象中
      this.isUploading = false // 当请求结束
      this.percentage = 0
      this.$emit('input', data.data.name)
    }
    // handleAvatarSuccess (res: any, file: any) {
    //   // 在这里帮你做了预览操作
    //   this.imageUrl = URL.createObjectURL(file.raw)
    // }
  }
})
</script>

<style lang="scss" scoped>
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
