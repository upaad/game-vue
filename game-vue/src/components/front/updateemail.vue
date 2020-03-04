<template>
    <div>
        <el-container>
            <el-header>
                <indexheader></indexheader>
            </el-header>
            <el-container>
                <el-main class="main">
                    <hr class="line"/>
                    <div class="conbox">
                        <el-row>
                            <el-col :span="8">
                                <myaside></myaside>
                            </el-col>
                            <el-col :span="16">
                                <el-card class="uemailbox">
                                    <el-form :model="updateemail" label-width="100px" ref="updateemail" class="updateemail" :rules="rules">
                                        <el-form-item label="原邮箱：">
                                            <span>{{updateemail.email}}</span>
                                        </el-form-item>
                                        <el-form-item prop="email2" label="新邮箱：">
                                            <el-input v-model="updateemail.email2"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="submitForm('updateemail')" class="uebtn">修改</el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-card>
                            </el-col>
                        </el-row>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import indexheader from '@/components/front/indexheader.vue'
import myaside from '@/components/front/mydataaside.vue'

export default {
  components: {
    indexheader, myaside
  },
  data () {
    return {
      userId: '',
      updateemail: {
        email: '',
        email2: ''
      },
      rules: {
        email2: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    this.loadDate()
  },
  methods: {
    loadDate () {
      var readyData = JSON.stringify({
        userinfoId: this.userId
      })
      this.$axios.post('/user/showuser', readyData)
        .then((res) => {
          if (res) {
            this.updateemail.email = res.data.userinfoEmail
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var readyData = JSON.stringify({
            userinfoId: this.userId,
            userinfoEmail: this.updateemail.email2
          })
          this.$axios.post('/user/updateemail', readyData)
            .then((res) => {
              if (res.data === 'success') {
                this.$message({ message: '修改邮箱成功', type: 'success' })
                this.$router.push({ path: '/mysafe' })
              } else {
                this.$alert('发生意外了', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                })
              }
            })
            .catch((err) => { console.log('err', err); return err })
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
.conbox{
    padding-top: 50px;
    height: 1000px;
}
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
.uemailbox{
    width: 880px;
}
.updateemail{
    padding-top: 100px;
    padding-left: 20%;
    width: 500px;
}
.uebtn{
    margin-top: 50px;
    margin-left: 300px;
}

</style>
