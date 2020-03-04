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
                                <div>
                                    <el-card class="pwdbox">
                                        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
                                            <el-form-item label="新密码：" prop="pass">
                                                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                                            </el-form-item>
                                            <el-form-item label="确认密码：" prop="checkPass">
                                                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                                            </el-form-item>
                                            <el-form-item>
                                                <el-button type="primary" @click="submitForm('ruleForm')" class="upbtn">提交</el-button>
                                            </el-form-item>
                                        </el-form>
                                    </el-card>
                                </div>
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userId: '',
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
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
            userinfoPwd: this.ruleForm.pass
          })
          this.$axios.post('/user/updatepwd', readyData)
            .then((res) => {
              if (res.data === 'success') {
                this.$message({ message: '修改密码成功', type: 'success' })
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
.pwdbox{
    width: 880px;
}
.ruleForm{
    padding-top: 100px;
    padding-left: 20%;
    width: 500px;
}
.upbtn{
    margin-top: 50px;
    margin-left: 300px;
}
</style>
