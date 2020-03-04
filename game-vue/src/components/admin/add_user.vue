<template>
  <el-container style="height: 960px; border: 1px solid #eee">
    <adbar></adbar>
    <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <adheader></adheader>
        </el-header>
        <el-main class="main">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="addForm">
                <el-form-item label="照片">
                    <el-upload
                        class="avatar-uploader"
                        action="#"
                        :http-request="httpRequest"
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="addForm.userinfoImg" :src="addForm.userinfoImg" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-input v-model="addForm.pwd"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="addForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="addForm.sex" placeholder="请选择性别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="出生年月日">
                    <el-col :span="11">
                    <el-form-item prop="birthday">
                        <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="addForm.birthday" style="width: 240px;"></el-date-picker>
                    </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('addForm')">添加用户</el-button>
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
  data () {
    var validateName = (rule, value, callback) => {
      var readyData = JSON.stringify({
        userinfoName: this.addForm.name
      })
      this.$axios.post('/user/duplicate', readyData)
        .then((res) => {
          if (res.data === 'error') {
            this.duplicate = true
          } else if (res.data === 'success') {
            this.duplicate = false
          }
        })
        .catch((err) => { console.log('err', err); return err })
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (this.duplicate) {
        callback(new Error('用户名重复'))
        this.duplicate = false
      } else {
        callback()
      }
    }
    var checkphone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/
      if (value) {
        setTimeout(() => {
          if (!Number.isInteger(+value)) {
            callback(new Error('请输入数字值'))
          } else {
            if (phoneReg.test(value)) {
              callback()
            } else {
              callback(new Error('电话号码格式不正确'))
            }
          }
        }, 100)
      } else {
        callback()
      }
    }
    return {
      adminName: '',
      duplicate: '',
      addForm: {
        userinfoImg: '',
        name: '',
        pwd: '',
        email: '',
        phone: '',
        sex: '',
        birthday: ''
      },
      rules: {
        name: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          { validator: checkphone, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.adminName = sessionStorage.getItem('adminName')
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var readyData = JSON.stringify({
            userinfoName: this.addForm.name,
            userinfoPwd: this.addForm.pwd,
            userinfoEmail: this.addForm.email,
            userinfoPhone: this.addForm.phone,
            userinfoSex: this.addForm.sex,
            userinfoBirthday: this.addForm.birthday,
            userinfoImg: this.addForm.userinfoImg
          })
          console.log('这是添加用户信息：' + readyData)
          this.$axios.post('/user/insertuser', readyData)
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
    },
    beforeAvatarUpload (file) {
      // 文件类型进行判断
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    httpRequest (date) {
      let rd = new FileReader() // 创建文件读取对象
      let file = date.file
      rd.readAsDataURL(file) // 文件读取装换为base64类型
      rd.onload = () => {
        console.log('file 转 base64结果：' + rd.result)
        this.addForm.userinfoImg = rd.result
      }
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
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
