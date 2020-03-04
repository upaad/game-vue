<template>
    <div>
      <el-container>
            <el-header>
                <indexheader></indexheader>
            </el-header>
            <el-container>
                <el-main class="main">
                  <hr class="line"/>
                  <div class="msg">
                    <el-card :body-style="{ padding: '20px' }">
                      <div>
                        <span style="font-size:26px;">我的消息</span>
                        <el-button type="warning" @click="openmsg()" style="margin-left:600px;margin-bottom:10px;">发私信</el-button>
                    </div>
                     <hr color="#999999"/>
                      <el-col class="block" v-for="(o,index) in msglist" :key="index" >
                        <div style="text-align:left;">
                          <div style="margin-left:150px;">
                            <el-button @click="skip(index)" style="font-size:20px;color:#4F4F4F;" type="text">{{o.privatemsgSendname}}</el-button>
                            <span>  发送于  </span>
                            <span style="">{{o.privatemsgTime | dateFmt('YYYY-MM-DD HH:mm:ss')}}</span>
                          </div>
                          <div style="margin-left:200px;width:700px;padding-top:10px;padding-bottom:20px">
                            <i class="el-icon-chat-square"/>：
                            <span>
                              {{o.privatemsgContent}}
                            </span>
                          </div>
                          <hr width="800px" style="margin-left:150px;" />
                        </div>
                      </el-col>
                    </el-card>
                  </div>
                </el-main>
                <asides v-if="this.userId"></asides>
            </el-container>
        </el-container>
      <el-dialog title="私信" :visible.sync="msgdialog" width="20%" :before-close="closeDialog">
          <el-form :model="msgform" ref="msgform">
              <el-form-item prop="name">
                  <el-input v-model="msgform.name" autocomplete="off" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item prop="msg">
                  <el-input @keyup.enter.native="getUser()" maxlength="60" type="textarea" :rows="3" placeholder="不超过60字" v-model="msgform.msg"></el-input>
              </el-form-item>
          </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="getUser()">发 送</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import indexheader from '@/components/front/indexheader.vue'
import asides from '@/components/front/aside.vue'

export default {
  components: {
    indexheader, asides
  },
  data () {
    return {
      myname: '',
      userId: '',
      msgdialog: false,
      exist: false,
      acceptid: '',
      msglist: [{
        privatemsgSendname: '',
        privatemsgContent: '',
        privatemsgTime: '',
        privatemsgSendid: ''
      }],
      msgform: [{
        name: '',
        msg: ''
      }]
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    this.loadMsgData()
    this.getMyname()
  },
  mounted () {
    const timer = setInterval(() => {
    // 某些定时器操作
      this.loadMsgData()
    }, 3000)
    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
    })
  },
  methods: {
    loadMsgData () {
      var readyData = JSON.stringify({
        privatemsgAcceptid: this.userId
      })
      this.$axios.post('/msg/showmsg', readyData)
        .then((res) => {
          if (res) {
            this.msglist = res.data
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    closeDialog () {
      this.$nextTick(() => {
        this.msgdialog = false
        this.$refs['msgform'].resetFields()
      })
    },
    openmsg () {
      this.msgdialog = true
    },
    getUser () {
      var readyData = JSON.stringify({
        userinfoName: this.msgform.name
      })
      this.$axios.post('/user/getuser', readyData)
        .then((res) => {
          if (res.data) {
            this.acceptid = res.data.userinfoId
            this.send()
          } else {
            this.$message({ message: '用户不存在', type: 'error' })
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    getMyname () {
      var readyData = JSON.stringify({
        userinfoId: this.userId
      })
      this.$axios.post('/user/showuser', readyData)
        .then((res) => {
          if (res) {
            this.myname = res.data.userinfoName
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    skip (index) {
      if (this.msglist[index].privatemsgSendid) {
        this.$router.push({ path: '/othersdata', query: { thisId: this.msglist[index].privatemsgSendid } })
      } else {
        this.$message({ message: '用户已经不存在', type: 'error' })
      }
    },
    send () {
      if (this.myname === this.msgform.name) {
        this.$message({ message: '不能和自己私信', type: 'error' })
      } else {
        var readyData = JSON.stringify({
          privatemsgSendid: this.userId,
          privatemsgSendname: this.myname,
          privatemsgAcceptid: this.acceptid,
          privatemsgAcceptname: this.msgform.name,
          privatemsgContent: this.msgform.msg
        })
        this.$axios.post('/msg/send', readyData)
          .then((res) => {
            if (res) {
              this.closeDialog()
              this.$message({ message: '发送成功', type: 'success' })
            } else {
              this.$message({ message: '发送失败', type: 'error' })
              this.msgdialog = true
            }
          })
          .catch((err) => { console.log('err', err); return err })
      }
    }
  }

}
</script>

<style lang="less" scoped>
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
.msg{
  padding-top: 30px;
  padding-bottom: 900px;
  margin-left: 24%;
  width: 1000px;
}
</style>
