<template>
  <div>
    <div class="block">
      <el-image :src="src" style="width: 100%; height: 955px;"></el-image>
    </div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ruleForm">
        <div class="ms-title">后台管理系统</div>
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" @keyup.enter.native="submitForm('ruleForm')" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import bg from '@/assets/ad_bg.jpg'

export default {
  data: function () {
    return {
      src: bg,
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      var readyData = JSON.stringify({
        adminName: this.ruleForm.username,
        adminPwd: this.ruleForm.password
      })
      axios.post('/admin/alogin', readyData)
        // eslint-disable-next-line eqeqeq
        .then((res) => {
          if (res.data === 'success') {
            sessionStorage.setItem('adminName', this.ruleForm.username)
            this.$router.push({ path: '/ad_game' })
          } else if (res.data === 'error') {
            this.$alert('用户名或密码错误', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            })
          }
        })
        .catch((err) => { console.log('err', err); return err })
    }
  }
}
</script>

<style>
.ms-title {
  margin: -30px auto 40px auto;
  text-align: center;
  font-size: 30px;
  color: #505458;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 30%;
  width: 300px;
  height: 240px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  background: #fff;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
}
</style>
