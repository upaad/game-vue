<template>
    <el-container class="conbox">
        <el-header height='120px' >
            <loginheader></loginheader>
        </el-header>
        <el-main class="main">
            <hr class="line"/>
            <div class="block">
                <el-image :src="src"></el-image>
            </div>
            <div class="ulogin">
                <el-tabs class="tabs" v-model="activeName" type="card">
                    <el-tab-pane label="登陆" name="login">
                        <el-card class="box-card" shadow="always">
                            <el-form :model="loginForm" :rules="rules" ref="loginForm" class="loginForm">
                                <el-form-item prop="username">
                                <el-input
                                    prefix-icon="el-icon-user"
                                    class="input"
                                    v-model="loginForm.username"
                                    @keyup.enter.native="login('loginForm')"
                                    placeholder="用户名/邮箱/手机号"></el-input>
                                </el-form-item>
                                <el-form-item prop="password">
                                <el-input
                                    class="input"
                                    type="password"
                                    placeholder="密码"
                                    prefix-icon="el-icon-key"
                                    v-model="loginForm.password"
                                    @keyup.enter.native="login('loginForm')"></el-input>
                                </el-form-item>
                                <div class="login-btn">
                                    <el-button type="primary" :plain="true" @click="login('loginForm')" round>登录</el-button>
                                </div>
                            </el-form>
                        </el-card>
                    </el-tab-pane>

                    <el-tab-pane label="注册" name="regist">
                        <el-card class="box-card" shadow="always">
                            <el-form :model="registForm" :rules="rules" ref="registForm" class="registForm">
                                <el-form-item prop="username2">
                                    <el-input
                                        placeholder="用户名"
                                        prefix-icon="el-icon-user"
                                        class="input"
                                        @keyup.enter.native="regist('loginForm')"
                                        v-model="registForm.username2"></el-input>
                                </el-form-item>
                                <el-form-item prop="password2">
                                    <el-input
                                        placeholder="密码"
                                        class="input"
                                        type="password"
                                        prefix-icon="el-icon-key"
                                        @keyup.enter.native="regist('loginForm')"
                                        v-model="registForm.password2"></el-input>
                                </el-form-item>
                                <el-form-item prop="password3">
                                    <el-input
                                        placeholder="确认密码"
                                        class="input"
                                        type="password"
                                        prefix-icon="el-icon-key"
                                        v-model="registForm.password3"
                                        @keyup.enter.native="regist('loginForm')"></el-input>
                                </el-form-item>
                                <div class="login-btn">
                                    <el-button type="primary" @click="regist('registForm')" round>注册</el-button>
                                </div>
                            </el-form>
                        </el-card>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-main>
    </el-container>
</template>
<script>
import loginheader from './loginheader.vue'
import loginbg from '@/assets/us_bg.jpg'

export default {
  components: {
    loginheader
  },
  data () {
    var validateName = (rule, value, callback) => {
      var readyData = JSON.stringify({
        userinfoName: this.registForm.username2
      })
      this.$axios.post('/user/duplicate', readyData)
        .then((res) => {
          if (res.data === 'error') {
            this.duplicate = true
          }
        })
        .catch((err) => { console.log('err', err); return err })
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (this.duplicate) {
        callback(new Error('用户名重复'))
        this.duplicate = false
      } else {
        if (this.registForm.password3 !== '') {
          this.$refs.registForm.validateField('password3')
        }
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.registForm.password3 !== '') {
          this.$refs.registForm.validateField('password3')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registForm.password2) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      src: loginbg,
      activeName: 'login',
      duplicate: false,
      loginForm: {
        username: '',
        password: ''
      },
      registForm: {
        username2: '',
        password2: '',
        password3: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名/邮箱/手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        username2: [
          { validator: validateName, trigger: 'blur' }
        ],
        password2: [
          { validator: validatePass, trigger: 'blur' }
        ],
        password3: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var readyData = JSON.stringify({
            userinfoName: this.loginForm.username,
            userinfoPwd: this.loginForm.password
          })
          this.$axios.post('/user/ulogin', readyData)
            .then((res) => {
              if (res.data) {
                this.$message({ message: '登陆成功', type: 'success' })
                sessionStorage.setItem('userId', res.data.userinfoId)
                this.$router.push({ path: '/index' })
              } else {
                this.$alert('用户名或密码错误', '提示', {
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
    },

    regist (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var readyData = JSON.stringify({
            userinfoName: this.registForm.username2,
            userinfoPwd: this.registForm.password2
          })
          this.$axios.post('/user/register', readyData)
            .then((res) => {
              if (res.data === 'success') {
                this.$message({ message: '注册成功', type: 'success' })
                var redate = JSON.stringify({
                  userinfoName: this.registForm.username2
                })
                this.$axios.post('/user/getuserid', redate)
                  .then((result) => {
                    if (result.data) {
                      sessionStorage.setItem('userId', result.data.userinfoId)
                      this.$router.push({ path: '/index' })
                    }
                  })
                  .catch((err) => { console.log('err', err); return err })
              } else if (res.data === 'error') {
                this.$alert('用户名或密码错误', '提示', {
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
.line{
    margin: 0px;
    padding: 0px;
    height:0px;
    border:none;
    border-top:10px groove skyblue;
}
.main{
    margin: 0px;
    padding: 0px;
    height: 100%;
}
.input{
    font-size: 120%
}
.ulogin {
  position: absolute;
  left: 50%;
  top: 30%;
  width: 300px;
  height: 360px;
  margin: -30px 0 0 200px;
  padding: 40px;
  border-radius: 15px;
  background-color:floralwhite
}
.tabs{
    background-color: floralwhite
}
.login-btn{
   padding-top: 20px;
}
.login-btn button {
    width: 250px;
    height: 40px;
}
</style>
