<template>
  <div ref="editor" class="text-editor"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'

export default Vue.extend({
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  // 组件已经渲染好，可以初始化操作 DOM 了
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor as any)
      // 注意：事件监听必须在create 之前！
      editor.config.onchange = (value: string) => {
        this.$emit('input', value)
      }
      // 只要你选了本地图片上传，那么当你选完这个文件后，它就会来调用这个方法customUploadImg
      editor.config.customUploadImg = async function (resultFiles: any, insertImgFn: any) {
        // resultFiles 是 input 中选中的文件列表(是你选的那个文件对象，是一个数组 因为它支持传多个)
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法(是一个函数，作用是根据图片地址生成img标签，然后插入富文本编辑器中)
        // console.log(resultFiles, insertImgFn)
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        // 1. 把用户选择的resultFiles上传到服务端，服务端会返回在线的图片访问地址，最后把服务端返回的在线地址 通过这个方法插入富文本编辑器中
        const { data } = await uploadCourseImage(fd)
        insertImgFn(data.data.name) // 根据图片地址 生成img标签，插入到富文本编辑器内容中
      }
      editor.create() // 实例化创建了编辑器
      // 注意：设置初始化必须在 create 后
      editor.txt.html(this.value) // 设置初始值
    }
  }
})
</script>

<style lang="scss" scoped></style>
