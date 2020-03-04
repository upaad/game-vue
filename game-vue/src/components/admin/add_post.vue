<template>
  <el-container style="height: 960px; border: 1px solid #eee">
    <adbar></adbar>
    <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <adheader></adheader>
        </el-header>
        <el-main class="main">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="addForm">
                <el-form-item label="帖子标题" prop="title">
                    <el-input v-model="addForm.title"></el-input>
                </el-form-item>
                <el-form-item label="帖子内容" prop="content">
                  <el-input
                    v-model="addForm.content"
                    type="textarea"
                    :autosize="{ minRows: 10, maxRows: 10}">
                  </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('addForm')">发布帖子</el-button>
                    <el-button @click="resetForm('addForm')">重置数据</el-button>
                </el-form-item>
          </el-form>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import adbar from './admin_sidebar.vue'
import adheader from './ad_header.vue'

export default {
  inject: ['reload'],
  components: {
    adbar, adheader
  },
  data: function () {
    return {
      adminName: '',
      adminid: '',
      thumbs: '0',
      addForm: {
        title: '',
        content: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入帖子标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入帖子内容', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.adminName = sessionStorage.getItem('adminName')
    this.getId()
  },
  methods: {
    getId () {
      var readyData = JSON.stringify({
        adminName: this.adminName
      })
      this.$axios.post('/admin/getid', readyData)
        .then((res) => {
          if (res.data !== 0) {
            this.adminid = res.data
            console.log('管理员的id是:' + res.data)
          } else if (res.data === 0) {
            this.$alert('发生了意料之外的错误', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            })
          }
        })
        .catch((err) => {
          this.$alert('发生了意料之外的错误', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
          console.log('err', err); return err
        })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var readyData = JSON.stringify({
            postTitle: this.addForm.title,
            postContent: this.addForm.content,
            postThumbs: this.thumbs,
            postUserid: '0',
            postUsername: this.adminName,
            postCommons: '0'
          })
          this.$axios.post('/post/insertpost', readyData)
            .then((res) => {
              if (res.data === 'success') {
                this.reload()
              } else if (res.data === 'error') {
                this.$alert('发生了意料之外的错误', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                })
              }
            })
            .catch((err) => { console.log('err', err); return err })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
.el-header {

  background-color: #7D7DFF;
  color: #333;
  line-height: 60px;
}

.main{
    text-align: center;
    margin:0px;
    padding:0px;
}

.addForm{
    padding-top: 30px;
    padding-left: 30%;
    width: 500px;
}
</style>
