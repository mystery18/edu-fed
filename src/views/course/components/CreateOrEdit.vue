<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-steps :active="curIndex" simple>
        <el-step
          v-for="(item, index) in steps"
          :key="item.title"
          :title="item.title"
          :icon="item.icon"
          @click.native="curIndex = index"
        ></el-step>
      </el-steps>
    </div>
    <div>
      <el-form ref="form" label-width="80px">
        <div v-show="curIndex === 0">
          <el-form-item label="课程名称">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              type="textarea"
              v-model="course.previewFirstField"
              style="margin-bottom: 10px"
              placeholder="概述1"
            ></el-input>
            <el-input
              type="textarea"
              v-model="course.previewSecondField"
              placeholder="概述2"
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number
              v-model="course.sortNum"
              :min="1"
              :max="10"
            ></el-input-number>
          </el-form-item>
        </div>
        <div v-show="curIndex === 1">
          <el-form-item label="课程封面">
            <!-- 把上传功能单独封装 -->
            <!--
                1. 如果course.courseListImg有值的话，组件就应该展示图片 可以进行预览，组件需要根据绑定的数据进行图片预览
                2. 组件需要把上传成功的图片地址同步到绑定的数据中
                v-model 的本质还是父子组件通信
                1.他会给子组件传递一个名字叫 value 的数据（所以子组件也要声明这个value来接收这个数据）：props
                2.子组件 默认监听input事件，修改绑定的数据
                （如果要在子组件修改这个绑定的数据的话，那子组件只需要发布一个自定义事件，即input事件，那你绑定的这个数据就会被修改）自定义事件
               -->
            <course-image v-model="course.courseListImg"></course-image>
          </el-form-item>
          <el-form-item label="介绍封面">
            <course-image
              v-model="course.courseImgUrl"
              :limit="5"
            ></course-image>
            <!-- <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload> -->
          </el-form-item>
        </div>
        <div v-show="curIndex === 2">
          <el-form-item label="售卖价格">
            <el-input v-model.number="course.discounts" type="number">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input v-model.number="course.price" type="number">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model.number="course.sales" type="number">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="course.discountsTag"></el-input>
          </el-form-item>
        </div>
        <div v-show="curIndex === 3">
          <el-form-item label="限时秒杀">
            <el-switch
              v-model="isSeckill"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
          <template v-if="isSeckill">
            <el-form-item label="开始时间">
              <el-date-picker
                type="date"
                placeholder="选择日期时间"
                v-model="course.activityCourseDTO.beginTime"
                value-format="YYYY-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="course.activityCourseDTO.endTime"
                type="date"
                placeholder="选择日期时间"
                value-format="YYYY-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input
                v-model.number="course.activityCourseDTO.amount"
                type="number"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input
                v-model.number="course.activityCourseDTO.stock"
                type="number"
              >
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="curIndex === 4">
          <el-form-item label="课程详情">
            <!-- <el-input type="textarea"></el-input> -->
            <!-- 如果我给编辑器数据，那它应该把我去做一个初始化展示，若内部数据改变了 也应该同步到我绑定的数据字段上来 -->
            <text-editor v-model="course.courseDescriptionMarkDown" />
          </el-form-item>
          <el-form-item label="是否发布">
            <!-- 我的开关值与course的status绑定，默认只看true和false，想要它根据0和1来表示开关，那就要配置两个属性 -->
            <!-- 即我开的时候值是1，然后把这个1与数据绑定上，控制它的状态 -->
            <el-switch
              v-model="course.status"
              :active-value="1"
              inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </el-form-item>
        </div>
        <el-form-item v-if="curIndex >= 0 && curIndex < 4">
          <el-button @click="curIndex++">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdateCourse, getCourseById } from '@/services/course'
import CourseImage from './CourseImage.vue'
import TextEditor from '@/components/TextEditor/index.vue'
import moment from 'moment'

export default Vue.extend({
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false // 默认不是编辑，非必须参数
    },
    courseId: {
      type: [String, Number] // 非必须 因为添加的时候不需要ID
    }
  },
  components: {
    CourseImage,
    TextEditor
  },
  data () {
    return {
      steps: [
        {
          title: '基本信息',
          icon: 'el-icon-edit'
        },
        {
          title: '课程封面',
          icon: 'el-icon-upload'
        },
        {
          title: '销售信息',
          icon: 'el-icon-picture'
        },
        {
          title: '秒杀活动',
          icon: 'el-icon-picture'
        },
        {
          title: '课程详情',
          icon: 'el-icon-edit'
        }
      ],
      curIndex: 0,
      isSeckill: false,
      // 巨多 初始化数据，对象里面就是接口所要求的数据
      course: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0, // 0：未发布，1：已发布
        sales: 0,
        activityCourse: false, // 是否开启活动秒杀
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  methods: {
    async loadCourse () {
      const { data } = await getCourseById(this.courseId) // 根据ID获取数据对象，然后赋给course对象
      // 服务器返回来的时间是时间戳，我们想要的是年月日格式，然后绑定到时间选择器组件上，所以要处理一下
      // 这里用moment插件转换一下
      const { activityCourseDTO } = data.data
      activityCourseDTO.beginTime = moment(activityCourseDTO.beginTime).format('YYYY-MM-DD')
      activityCourseDTO.endTime = moment(activityCourseDTO.endTime).format('YYYY-MM-DD')
      this.course = data.data
    },
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.course)
      if (data.code === '000000') {
        this.$message.success('保存成功')
        this.$router.push('/course')
      } else {
        this.$message.error('保存失败')
      }
      // this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
</style>
