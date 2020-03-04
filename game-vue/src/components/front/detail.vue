<template>
    <div>
        <el-row>
            <el-col :span="20">
                <el-image class="dimage" :src="durl"></el-image>
            </el-col>
            <el-col :span="4">
                <el-card class="detailgame">
                    <div class="dgamename">
                        <span>{{dgamename}}</span>
                    </div>
                    <div class="dtag">
                        <el-tag>{{dtag}}</el-tag>
                    </div>
                    <div class="price">
                        <el-col :span="16">
                            <span class="nowprice" v-if="this.discount==1">¥ {{oldprice}}</span>
                            <span class="nowprice" v-if="this.discount!=1">¥ {{nowprice}}</span>
                            <span class="oldprice" v-if="this.discount!=1">¥ {{oldprice}}</span>
                        </el-col>
                        <el-col :span="8">
                            <el-tag class="discount" v-if="this.prom" color="Orange" effect="dark" type="warning">{{discount * 100}}%</el-tag>
                        </el-col>
                    </div>
                    <div class="btn">
                        <el-col :span="14">
                            <el-button @click="Buybol()" type="danger">加入购物车</el-button>
                        </el-col>
                        <el-col :span="10">
                            <el-button @click="Buy()" type="primary">购买</el-button>
                        </el-col>
                    </div>
                    <div class="collect">
                        <el-col :span="14">
                            <i @click="collectOn()" v-if="!collect" class="el-icon-star-off"></i>
                            <i @click="collectOff()" v-if="collect" class="el-icon-star-on"></i>
                            <span>加入收藏夹</span>
                        </el-col>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-card class="conbox">
            <div class="title">
                <h1>游戏介绍</h1>
            </div>
            <hr/>
            <span class="content">{{content}}</span>
        </el-card>
        <el-dialog
            title="提示"
            :visible.sync="dialog"
            width="20%"
            center
            custom-class='dialogstyle'>
            <span style="font-size:20px;">{{msg}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="skip()">前往购物车</el-button>
                <el-button type="primary" @click="dialog = false">继续逛逛</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  props: ['gameid'],
  inject: ['reload'],
  data () {
    return {
      userId: '',
      gameId: '',
      collect: false,
      durl: '',
      dgamename: '',
      dtag: '',
      nowprice: '',
      oldprice: '',
      discount: '',
      content: '',
      dialog: false,
      buybol: true,
      msg: '',
      prom: ''
    }
  },
  created () {
    this.gameId = this.gameid
    this.userId = sessionStorage.getItem('userId')
    this.loadDate()
    this.loadCollect()
  },
  methods: {
    loadDate () {
      var readyData = JSON.stringify({
        gameId: this.gameId
      })
      this.$axios.post('/game/showidgame', readyData)
        .then((res) => {
          if (res && res.status === 200) {
            this.durl = res.data.gameImg
            this.dgamename = res.data.gameName
            this.dtag = res.data.gameCharacter
            this.content = res.data.gameDescription
            this.oldprice = res.data.gamePrice
            this.nowprice = res.data.gamePrice * res.data.gameDiscount
            this.prom = res.data.gamePromotion
            if (res.data.gamePromotion) {
              this.discount = res.data.gameDiscount
            } else {
              this.discount = '1'
            }
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    loadCollect () {
      var readyData = JSON.stringify({
        collectionGameid: this.gameId,
        collectionUserid: this.userId
      })
      console.log(readyData)
      this.$axios.post('/collection/showcollect', readyData)
        .then((res) => {
          if (res.data) {
            this.collect = true
          } else {
            this.collect = false
          }
          console.log('是否收藏' + res.data)
          console.log('是否收藏2' + this.collect)
        })
        .catch((err) => { console.log('err', err); return err })
    },
    collectOn () {
      if (this.userId) {
        var readyData = JSON.stringify({
          collectionName: this.dgamename,
          collectionPrice: this.nowprice,
          collectionImg: this.durl,
          collectionGameid: this.gameId,
          collectionUserid: this.userId
        })
        this.$axios.post('/collection/insertcollection', readyData)
          .then((res) => {
            if (res.data === 'success') {
              this.collect = true
            } else if (res.data === 'error') {
              this.$message({ message: '添加收藏失败', type: 'error' })
            }
          })
          .catch((err) => { console.log('err', err); return err })
      } else {
        this.$alert('请先登陆', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    collectOff () {
      if (this.userId) {
        var readyData = JSON.stringify({
          collectionGameid: this.gameId,
          collectionUserid: this.userId
        })
        this.$axios.post('/collection/deletecollection', readyData)
          .then((res) => {
            if (res.data === 'success') {
              this.collect = false
            } else if (res.data === 'error') {
              this.$message({ message: '取消购物车失败', type: 'error' })
            }
          })
          .catch((err) => { console.log('err', err); return err })
      } else {
        this.$alert('请先登陆', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    addCart () {
      if (this.userId) {
        console.log(this.nowprice)
        if (!this.buybol) {
          var readyData = JSON.stringify({
            cartName: this.dgamename,
            cartImg: this.durl,
            cartPrice: this.nowprice,
            cartUserid: this.userId,
            cartGameid: this.gameId
          })
        }
        this.$axios.post('/cart/insertcart', readyData)
          .then((res) => {
            if (res.data === 'success') {
              this.msg = '商品添加成功'
              this.buybol = true
              this.dialog = true
            } else {
              console.log('err', res.data)
            }
          })
          .catch((err) => { console.log('err', err); return err })
      }
    },
    skip () {
      this.$router.push({ path: '/shoppingCart' })
    },
    Buybol () {
      if (this.userId) {
        var readyData = JSON.stringify({
          cartGameid: this.gameId,
          cartUserid: this.userId
        })
        this.$axios.post('/cart/buybol', readyData)
          .then((res) => {
            if (res.data === 'success') {
              this.buybol = false
              this.addCart()
            } else if (res.data === 'error') {
              this.msg = '商品已经在购物车中'
              this.buybol = true
              this.dialog = true
            }
          })
          .catch((err) => { console.log('err', err); return err })
      } else {
        this.$alert('请先登陆', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    Buy () {
      if (this.userId) {
        this.Buybol()
        console.log(this.buybol)
        this.$router.push({ path: '/orderPay', query: { gameid: this.gameId } })
      } else {
        this.$alert('请先登陆', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dimage{
    width: 800px;
    height: 480px;

}
.detailgame{
    margin-left: -350px;
    width: 400px;
    height: 310px;
    background-color: #FFFFFF;
}
.dgamename{
    font-size: 30px;
    padding-top: 20px;
    margin-left: 00px;
}
.dtag{
    padding-top: 20px;
    margin-left: -300px;

}
.price{
    padding-top: 40px;
}
.nowprice{
    font-size: 24px;
    color:red;
}
.oldprice{
    padding-left: 10px;
    text-decoration:line-through;
    color: #8E8E8E;
}
.btn{
    margin-top: 50px;
}
.collect{
    padding-top: 50px;
}
.conbox{
    margin-top: 20px;
    margin-left: 378px;
    width: 800px;
    height: 400px;
    background-color: #FFFFFF;
}
.title{
    padding-top: 10px;
    margin-left: -600px;
}
.content{
    padding-left: 20px;
    padding-right: 20px;
    text-align: left;
    float: left;
}
.dialogstyle{
    background-color: aqua
}

</style>
