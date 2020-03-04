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
                                <el-card class="bphonebox">
                                    <el-form :model="bindphone" label-width="100px" ref="bindphone" class="bindphone" :rules="rules">
                                        <el-form-item prop="phone" label="手机号：">
                                            <el-input v-model="bindphone.phone"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="submitForm('bindphone')" class="bpbtn">绑定</el-button>
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
    var checkphone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
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
    }
    return {
      userId: '',
      bindphone: {
        phone: ''
      },
      rules: {
        phone: [
          { required: true, validator: checkphone, trigger: 'blur' }
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
            userinfoPhone: this.bindphone.phone
          })
          this.$axios.post('/user/updatephone', readyData)
            .then((res) => {
              if (res.data === 'success') {
                this.$message({ message: '绑定手机成功', type: 'success' })
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
.bphonebox{
    width: 880px;
}
.bindphone{
    padding-top: 100px;
    padding-left: 20%;
    width: 500px;
}
.bpbtn{
    margin-top: 50px;
    margin-left: 300px;
}

</style>
