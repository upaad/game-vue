<template>
    <div style="height:900px;">
        <h1 style="margin-top:200px;font-size:60px;" v-if="!this.gameId">无订单信息</h1>
        <div class="title" v-if="this.gameId">
            <span>确认订单信息</span>
        </div>
        <el-card class="cartbox" v-if="this.gameId">
            <el-form :model="gametable" class="form">
              <el-col :span="4">
                  <el-form-item>
                      <img :src="this.gametable.gameImg" class="img" width="200" height="120" />
                  </el-form-item>
              </el-col>
              <el-col :span="14">
                  <el-form-item>
                      <span style="height:120px;">{{this.gametable.gameName}}</span>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                  <el-form-item>
                      <span style="color:red;height:120px;">¥ {{this.gametable.gamePrice}}</span>
                  </el-form-item>
              </el-col>
            </el-form>
        </el-card>
        <el-card class="box" v-if="this.gameId">
            <span style="font-size:16px">共 1 件商品</span>
            <span style="margin-left:550px;">付款金额： <span style="color:red;">¥ {{this.gametable.gamePrice}}元</span></span>
            <el-button type="primary" @click="pay()" style="margin-left:30px;">确认并付款</el-button>
        </el-card>
        <el-dialog
            title="支付"
            :visible.sync="dialog"
            width="20%"
            center>
            <span style="font-size:20px;">请您在新打开的支付宝页面进行支付，支付完成前请不要关闭改窗口</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="warn" @click="skip()">已完成支付</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  inject: ['reload'],
  props: ['gameid'],
  data () {
    return {
      userId: '',
      gameId: '',
      dialog: false,
      gametable: {
        gameId: '',
        gameImg: '',
        gameName: '',
        gamePrice: ''
      }
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    this.gameId = this.gameid
    if (this.gameId) {
      this.loadData()
    }
  },
  methods: {
    loadData () {
      var readyData = JSON.stringify({
        gameId: this.gameId
      })
      this.$axios.post('/game/showidgame', readyData)
        .then((res) => {
          if (res.data) {
            this.gametable.gameId = res.data.gameId
            this.gametable.gameImg = res.data.gameImg
            this.gametable.gameName = res.data.gameName
            this.gametable.gamePrice = res.data.gamePrice * res.data.gameDiscount
          } else {
            console.log('err', res.data)
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    pay () {
      this.sNow = []
      this.vNow = new Date()
      this.sNow += String(this.vNow.getFullYear())
      this.sNow += String(this.vNow.getMonth() + 1)
      this.sNow += String(this.vNow.getDate())
      this.sNow += String(this.vNow.getHours())
      this.sNow += String(this.vNow.getMinutes())
      this.sNow += String(this.vNow.getSeconds())
      this.sNow += String(this.vNow.getMilliseconds())
      this.subjects = this.gametable.gameName
      this.body = this.gametable.gameId + ' ' + this.userId
      console.log(this.body)
      var readyData = JSON.stringify({
        number: this.sNow,
        money: this.gametable.gamePrice,
        subjects: this.subjects,
        gameid: this.body
      })
      this.$axios.post('/alipay/pay', readyData)
        .then((res) => {
          if (res) {
            this.dialog = true
            // this.addorder()
            let dwSafari
            let dataObj = res.data
            dwSafari = window.open()
            dwSafari.document.open()
            dwSafari.document.write(dataObj)
            dwSafari.document.forms[0].submit()
            dwSafari.document.close()
          } else {
            console.log('err', res.data)
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    judge () {
      var readyData = JSON.stringify({
        orderGameid: this.gametable.gameId,
        orderUserid: this.userId
      })
      this.$axios.post('/order/showbuystatus', readyData)
        .then((res) => {
          if (res.data === 'success') {
            this.$router.push({ path: '/pay' })
          } else if (res.data === 'error') {
            this.$message.error('还未付款！')
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    // addorder () {
    //   var readyData = JSON.stringify({
    //     cartName: this.gametable.gameName,
    //     cartPrice: this.gametable.gamePrice,
    //     cartGameid: this.gametable.gameId,
    //     cartUserid: this.userId
    //   })
    //   this.$axios.post('/order/addorder', readyData)
    //     .then((res) => {
    //       if (res.data === 'success') {
    //         console.log('插入成功')
    //       }
    //     })
    //     .catch((err) => { console.log('err', err); return err })
    // },
    skip () {
      this.dialog = false
      this.judge()
    }
  }
}
</script>

<style lang="less" scoped>
.title{
    padding-top: 30px;
    padding-bottom: 30px;
    font-size: 24px;
    text-align: left;
    padding-left: 30%;
}
.cartbox{
    margin-left: 24%;
    width: 1000px;
    height: 160px;
    border-radius: 10px;
    margin-bottom: 30px;
}
.box{
    margin-left: 24%;
    width: 1000px;
    border-radius: 10px;
    margin-bottom: 30px;
}
</style>
