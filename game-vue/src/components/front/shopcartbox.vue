<template>
    <div style="height:900px;">
        <div class="title">
            <span>购物车</span>
        </div>
        <el-card class="cartbox">
            <el-table :data="carttabel" ref="carttabel" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="cartImg" width="200">
                    <template slot-scope="scope">
                        <img :src="scope.row.cartImg"  width="200" height="120" />
                    </template>
                </el-table-column>
                <el-table-column prop="cartName" label="游戏" align="center"></el-table-column>
                <el-table-column prop="cartPrice" label="商品价格" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" style="color:red;" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
          </el-table>
          <el-row style="padding-top:20px;">
            <el-col :span="12">
              <span style="font-size:16px">共 {{carttabel.length}} 件商品，已选择 {{totalnum}} 件</span>
            </el-col>
            <el-col :span="12">
              合计： {{totalprice}}元
              <el-button type="primary" @click="pay()" style="margin-left:20px;">支付</el-button>
            </el-col>
          </el-row>
        </el-card>
        <el-dialog
            title="支付"
            :visible.sync="dialog"
            width="20%"
            center>
            <span style="font-size:20px;">请您在新打开的支付宝页面进行支付，支付完成前请不要关闭改窗口</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="warn" @click="skip()">已完成支付</el-button>
                <el-button type="primary" @click="closedia()">关闭窗口</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  inject: ['reload'],
  computed: {
    totalnum: function () {
      let num = 0
      this.multipleSelection.forEach((item) => {
        num += 1
      })
      return num
    },
    totalprice: function () {
      let sumprice = 0
      this.multipleSelection.forEach((item) => {
        sumprice += 1 * item.cartPrice
      })
      return sumprice
    }
  },
  data () {
    return {
      userId: '',
      vNow: '',
      sNow: '',
      html: '',
      number: '',
      money: '',
      subjects: '',
      body: '',
      list: '',
      dialog: false,
      carttabel: [{
        cartId: '',
        cartImg: '',
        cartName: '',
        cartPrice: '',
        cartGameid: '',
        cartUserid: ''
      }],
      multipleSelection: []
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    this.loadData()
  },
  mounted () {
    const timer = setInterval(() => {
    // 某些定时器操作
      this.loadData()
    }, 3000)
    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
    })
  },
  methods: {
    loadData () {
      var readyData = JSON.stringify({
        cartUserid: this.userId
      })
      this.$axios.post('/cart/showcart', readyData)
        .then((res) => {
          if (res.data) {
            this.carttabel = res.data
          } else {
            console.log('err', res.data)
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleDel (index, row) {
      var readyData = JSON.stringify({
        cartUserid: this.userId,
        cartId: row.cartId
      })
      this.$axios.post('/cart/deletecart', readyData)
        .then((res) => {
          if (res.data === 'success') {
            this.$message({ message: '删除商品成功', type: 'success' })
            this.reload()
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
      this.subjects = []
      this.body = []
      var l = this.totalnum
      for (var i = 0; i < l; i++) {
        this.subjects += this.multipleSelection[i].cartName + ' '
      }
      for (var j = 0; j < l; j++) {
        if (j === l - 1) {
          this.body += this.multipleSelection[j].cartGameid + ' '
          this.body += this.userId
        } else {
          this.body += this.multipleSelection[j].cartGameid + ' '
        }
      }
      console.log(this.body)
      var readyData = JSON.stringify({
        number: this.sNow,
        money: this.totalprice,
        subjects: this.subjects,
        gameid: this.body
      })
      if (this.totalprice) {
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
      } else {
        this.$message({ message: '请选择要支付的商品', type: 'error' })
      }
    },
    // addorder () {
    //   this.list = JSON.stringify(this.multipleSelection)
    //   // var text1 = this.list.replace('[', '')
    //   // var text2 = text1.split('').reverse().join('')
    //   // var text3 = text2.replace(']', '')
    //   // var text4 = text3.split('').reverse().join('')
    //   // console.log('数据' + text4)
    //   this.$axios.post('/order/insertorder', this.list)
    //     .then((res) => {
    //       if (res.data === 'success') {
    //         console.log('插入成功')
    //       }
    //     })
    //     .catch((err) => { console.log('err', err); return err })
    // },
    skip () {
      this.dialog = false
      this.$router.push({ path: '/pay' })
    },
    closedia () {
      this.dialog = false
      this.reload()
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
    border-radius: 10px;
    margin-bottom: 100px;
}
</style>
