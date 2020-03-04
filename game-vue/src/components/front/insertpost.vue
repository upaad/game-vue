<template>
    <div>
        <el-container>
            <el-header>
                <indexheader></indexheader>
            </el-header>
            <el-container>
                <el-main class="main">
                    <hr class="line"/>
                    <div class="addbox">
                        <el-card >
                            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="addForm">
                                <el-form-item label="帖子标题" prop="title">
                                    <el-input maxlength="30" placeholder="请输入60字以内的内容" v-model="addForm.title"></el-input>
                                </el-form-item>
                                <el-form-item label="帖子内容" prop="content">
                                    <el-input
                                    v-model="addForm.content"
                                    type="textarea"
                                    :autosize="{ minRows: 10, maxRows: 10}">
                                    </el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button style="float:right;" type="primary" @click="insertpost('addForm')">发布帖子</el-button>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import indexheader from '@/components/front/indexheader.vue'

export default {
  components: {
    indexheader
  },
  data () {
    return {
      userId: '',
      thumbs: '0',
      addForm: [{
        title: '',
        content: ''
      }],
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
    this.userId = sessionStorage.getItem('userId')
    this.getUsername()
  },
  methods: {
    getUsername () {
      var readyData = JSON.stringify({
        userinfoId: this.userId
      })
      this.$axios.post('/user/showuser', readyData)
        .then((res) => {
          if (res.data) {
            this.userName = res.data.userinfoName
          }
        })
    },
    insertpost (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var readyData = JSON.stringify({
            postTitle: this.addForm.title,
            postContent: this.addForm.content,
            postThumbs: this.thumbs,
            postUserid: this.userId,
            postUsername: this.userName,
            postCommons: '0'
          })
          this.$axios.post('/post/insertpost', readyData)
            .then((res) => {
              if (res.data === 'success') {
                this.$router.push({ path: '/community' })
                this.$message({ message: '发布成功', type: 'success' })
              }
            })
            .catch((err) => {
              this.$alert('发生了意料之外的错误', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              })
              console.log('err', err); return err
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }

}
</script>

<style>
.main{
    width: 100%;
    margin: 0px;
    padding: 0px;
    height: 100%;
    background-color:#f0f0f0
}
.line{
    margin: 0px;
    padding: 0px;
    height:0px;
    border:none;
    border-top:5px groove skyblue;
}
.addbox{
    width: 880px;
    margin-top: 50px;
    margin-left: 28%;
    padding-bottom: 450px;
}

</style>
