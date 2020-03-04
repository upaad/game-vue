<template>
    <div class="databox" >
        <el-image class="oimage" v-if="userinfoImg" :src="userinfoImg"></el-image>
        <img class="oimage" v-if="!userinfoImg"  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
        <h2>{{userinfoName}}</h2>
        <el-button v-if="mybol" style="width:150px;" @click="opendialog()" type="primary">
          <i class="el-icon-message"/> 私信
        </el-button>
         <el-tabs tab-position="top" class="nav">
            <el-tab-pane label="游戏">
                <div>
                  <el-table
                    :data="gamedata"
                    style="width: 1000px;padding:0px;font-size: 20px;">
                    <el-table-column prop="gameImg" width="200px">
                        <template slot-scope="scope">
                          <el-image class="img" :src="scope.row.gameImg"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderName" width="650px">
                    </el-table-column>
                    <el-table-column width="150px">
                      <template slot-scope="scope">
                        <el-button @click="search1(scope.$index, scope.row)" type="primary">查看游戏</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="收藏">
              <el-table
                  :data="collectdata"
                  height = "120px;"
                  style="width: 1000px;padding:0px;font-size: 20px;">
                  <el-table-column prop="collectionImg" width="200px">
                      <template slot-scope="scope">
                          <el-image class="img" :src="scope.row.collectionImg"></el-image>
                      </template>
                  </el-table-column>
                  <el-table-column prop="collectionName" width="650px">
                  </el-table-column>
                  <el-table-column width="150px">
                    <template slot-scope="scope">
                      <el-button @click="search2(scope.$index, scope.row)" type="primary">查看游戏</el-button>
                    </template>
                  </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="帖子">
              <otherpost v-bind:thisId="thisId"></otherpost>
            </el-tab-pane>
            <el-tab-pane label="评论">
              <othercommon v-bind:thisId="thisId"></othercommon>
            </el-tab-pane>
        </el-tabs>
        <div>
          <el-dialog title="私信" :visible.sync="msgdialog" width="20%" :before-close="closeDialog">
              <el-form :model="msgform" ref="msgform">
                  <el-form-item prop="userName">
                      <el-input v-model="msgform.name" autocomplete="off" placeholder="请输入用户名"></el-input>
                  </el-form-item>
                  <el-form-item prop="msg">
                      <el-input @keyup.enter.native="send()" maxlength="60" type="textarea" :rows="3" placeholder="不超过60字" v-model="msgform.msg"></el-input>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="send()">发 送</el-button>
              </div>
          </el-dialog>
        </div>
    </div>
</template>

<script>
import otherpost from '@/components/front/otherpost.vue'
import othercommon from '@/components/front/othercommon.vue'

export default {
  props: ['thisId'],
  components: {
    otherpost, othercommon
  },
  data () {
    return {
      userId: '',
      userinfoName: '',
      userinfoImg: '',
      mybol: true,
      msgdialog: false,
      myName: '',
      gamedata: [{
        gameImg: '',
        orderName: '',
        orderGameid: ''
      }],
      collectdata: [{
        collectionImg: '',
        collectionName: '',
        collectionGameid: ''
      }],
      msgform: [{
        name: '',
        msg: ''
      }]
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    if (this.thisId === this.userId) {
      this.mybol = false
    } else if (!this.userId) {
      this.mybol = false
    }
    this.loadUserDate()
    this.loadGameData()
    this.loadCollectData()
    this.getMyname()
  },
  methods: {
    loadUserDate () {
      var readyData = JSON.stringify({
        userinfoId: this.thisId
      })
      this.$axios.post('/user/showuser', readyData)
        .then((res) => {
          if (res) {
            this.userinfoImg = res.data.userinfoImg
            this.userinfoName = res.data.userinfoName
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    loadGameData () {
      var readyData = JSON.stringify({
        orderUserid: this.thisId
      })
      this.$axios.post('/order/ordernorepeat', readyData)
        .then((res) => {
          if (res && res.status === 200) {
            this.gamedata = res.data
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    loadCollectData () {
      var readyData = JSON.stringify({
        collectionUserid: this.thisId
      })
      this.$axios.post('/collection/showcollection', readyData)
        .then((res) => {
          if (res && res.status === 200) {
            this.collectdata = res.data
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
    getMyname () {
      var readyData = JSON.stringify({
        userinfoId: this.userId
      })
      this.$axios.post('/user/showuser', readyData)
        .then((res) => {
          if (res) {
            this.myName = res.data.userinfoName
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    opendialog () {
      if (this.userId) {
        this.msgform.name = this.userinfoName
        this.msgdialog = true
      } else {
        this.$message({ message: '请先登陆', type: 'error' })
      }
    },
    send () {
      if (this.myName === this.msgform.name) {
        this.$message({ message: '不能和自己私信', type: 'error' })
      } else {
        var readyData = JSON.stringify({
          privatemsgSendid: this.userId,
          privatemsgSendname: this.myName,
          privatemsgAcceptid: this.thisId,
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
    },
    search1 (index, row) {
      if (row.orderGameid) {
        this.$router.push({ path: '/detailedgame', query: { gameid: row.orderGameid } })
      } else {
        this.$message({ message: '商品已经不存在', type: 'error' })
      }
    },
    search2 (index, row) {
      if (row.collectionGameid) {
        this.$router.push({ path: '/detailedgame', query: { gameid: row.collectionGameid } })
      } else {
        this.$message({ message: '商品已经不存在', type: 'error' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.databox{
    padding-top: 50px;
}
.oimage{
    width: 150px;
    height: 150px;
    border-radius: 90%;
}
.nav{
    width: 1000px;
    padding-left: 24%;
    padding-bottom: 400px;
    padding-top: 50px;
}
.img{
    width:200px;
    height: 120px;
    display: block;
}
</style>
