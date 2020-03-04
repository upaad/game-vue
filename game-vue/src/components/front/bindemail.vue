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
                                <el-card class="bemailbox">
                                    <el-form :model="bindemail" label-width="100px" ref="bindemail" class="bindemail" :rules="rules">
                                        <el-form-item prop="email" label="邮箱：">
                                            <el-input v-model="bindemail.email"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="submitForm('bindemail')" class="bebtn">绑定</el-button>
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
      bindemail: {
        email: ''
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var readyData = JSON.stringify({
            userinfoId: this.userId,
            userinfoEmail: this.bindemail.email
          })
          this.$axios.post('/user/updateemail', readyData)
            .then((res) => {
              if (res.data === 'success') {
                this.$message({ message: '绑定邮箱成功', type: 'success' })
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
.bemailbox{
    width: 880px;
}
.bindemail{
    padding-top: 100px;
    padding-left: 20%;
    width: 500px;
}
.bebtn{
    margin-top: 50px;
    margin-left: 300px;
}
</style>
