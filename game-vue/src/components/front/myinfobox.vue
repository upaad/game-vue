<template>
    <div>
        <el-card class="infobox">
            <el-form :model="updatedate" :rules="rules" ref="updatedate">
                <el-form-item prop="userinfoImg">
                  <el-row>
                    <el-col :span="23">
                      <el-avatar :size="100">
                        <img v-if="updatedate.userinfoImg" :src="updatedate.userinfoImg"/>
                        <img v-if="!updatedate.userinfoImg" src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                      </el-avatar>
                    </el-col>
                    <el-col :span="1">
                      <el-upload
                        action="#"
                        :http-request="httpRequest"
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload">
                           <el-button class="upload" size="mini" type="primary" icon="el-icon-camera" circle></el-button>
                      </el-upload>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item class="mbox" label="昵称" prop="userinfoName">
                    <el-input type="text" style="width:30%" v-model="updatedate.userinfoName"></el-input>
                </el-form-item>
                <el-form-item class="mbox" label="电子邮箱" prop="userinfoEmail">
                    <span>{{updatedate.userinfoEmail}}</span>
                </el-form-item>
                <el-form-item class="mbox" label="手机号" prop="userinfoPhone">
                    <span>{{updatedate.userinfoPhone}}</span>
                </el-form-item>
                <el-form-item class="mbox" label="性别" prop="userinfoSex">
                    <el-select v-model="updatedate.userinfoSex" placeholder="请选择性别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="mbox" label="您的生日" prop="userinfoBirthday">
                    <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="updatedate.userinfoBirthday" style="width: 30%;"></el-date-picker>
                </el-form-item>
                <div class="mbtn">
                    <el-button type="primary" @click="update('updatedate')" round>保存修改信息</el-button>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
  inject: ['reload'],
  data () {
    var validateName = (rule, value, callback) => {
      var readyData = JSON.stringify({
        userinfoName: this.updatedate.userinfoName
      })
      this.$axios.post('/user/duplicate', readyData)
        .then((res) => {
          if (res.data === 'error') {
            if (this.name === this.updatedate.userinfoName) {
              this.duplicate = false
            } else {
              this.duplicate = true
            }
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
    return {
      duplicate: false,
      userId: '',
      name: '',
      updatedate: [
        {
          userinfoImg: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png',
          userinfoName: '',
          userinfoEmail: '',
          userinfoPhone: '',
          userinfoSex: '',
          userinfoBirthday: ''
        }
      ],
      rules: {
        userinfoName: [
          { validator: validateName, trigger: 'blur' }
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
            this.updatedate = res.data
            this.name = res.data.userinfoName
          }
          this.updatedate.userinfoPhone = this.updatedate.userinfoPhone.toString().replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
        })
        .catch((err) => { console.log('err', err); return err })
    },
    httpRequest (date) {
      let rd = new FileReader() // 创建文件读取对象
      let file = date.file
      rd.readAsDataURL(file) // 文件读取装换为base64类型
      rd.onload = () => {
        console.log('file 转 base64结果：' + rd.result)
        this.updatedate.userinfoImg = rd.result
      }
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
    update (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var readyData = JSON.stringify({
            userinfoId: this.userId,
            userinfoImg: this.updatedate.userinfoImg,
            userinfoName: this.updatedate.userinfoName,
            userinfoSex: this.updatedate.userinfoSex,
            userinfoBirthday: this.updatedate.userinfoBirthday
          })
          this.$axios.post('/user/updateuser', readyData)
            .then((res) => {
              if (res.data === 'success') {
                this.$message({ message: '修改信息成功', type: 'success' })
                // location.reload()
                this.reload()
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

<style lang="less" scoped>
.infobox{
    width: 800px;
}
.mbox{
    padding-top: 20px;
    padding-left: 100px;
    text-align: left;
}
.upload{
  margin-left: -700px;
  margin-top: 80px;
}
.mbtn{
    padding-top:50px;
    float:right;
    padding-bottom: 20px;
    padding-right: 50px;
}
</style>
