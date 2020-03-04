<template>
    <div style="height:900px;">
        <el-card class="favbox">
            <div style="text-align: left;"><span>{{username}}心愿单</span></div>
            <hr/>
            <div style="text-align: left;"><span style="font-size:14px">共 {{favtabel.length}} 件商品</span></div>
            <el-table :data="favtabel" ref="favtabel">
                <el-table-column prop="favimg" width="300">
                  <template slot-scope="scope">
                      <img :src="scope.row.collectionImg"  width="200" height="120" />
                  </template>
                </el-table-column>
                <el-table-column prop="collectionName" width="400"></el-table-column>
                <el-table-column prop="collectionPrice" width="100"></el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <div><el-button type="warning" size="mini" @click="Buybol(scope.$index, scope.row) ">加入购物车</el-button></div> <!--handleAdd(scope.$index, scope.row)-->
                    <div style="padding-left:15px;"><el-button type="text" style="color:red;" size="mini" @click="handleDel(scope.$index, scope.row)">移除收藏夹</el-button></div>
                  </template>
                </el-table-column>
          </el-table>
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
  inject: ['reload'],
  data () {
    return {
      username: '',
      userId: '',
      buybol: true,
      msg: '',
      dialog: false,
      // gamedate: [{
      //   gameName: '',
      //   gameImg: '',
      //   gamePrice: '',
      //   gameDiscount: '',
      //   gameId: ''
      // }],
      // row: {},
      favtabel: [{
        collectionImg: '',
        collectionName: '',
        collectionPrice: '',
        collectionGameid: ''
      }]
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
        collectionUserid: this.userId
      })
      this.$axios.post('/collection/showcollection', readyData)
        .then((res) => {
          if (res && res.status === 200) {
            this.favtabel = res.data
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    // getGame (row) {
    //   var readyData = JSON.stringify({
    //     gameId: row.collectionGameid
    //   })
    //   this.$axios.post('/game/showidgame', readyData)
    //     .then((res) => {
    //       if (res.data) {
    //         this.gamedate = res.data
    //       }
    //     })
    //     .catch((err) => { console.log('err', err); return err })
    // },
    handleAdd (row) {
      if (row.collectionGameid) {
        if (!this.buybol) {
          var readyData2 = JSON.stringify({
            cartName: row.collectionName,
            cartImg: row.collectionImg,
            cartPrice: row.collectionPrice,
            cartUserid: this.userId,
            cartGameid: row.collectionGameid
          })
          this.$axios.post('/cart/insertcart', readyData2)
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
      }
    },
    Buybol (index, row) {
      if (row.collectionGameid) {
        var readyData = JSON.stringify({
          cartGameid: row.collectionGameid,
          cartUserid: this.userId
        })
        this.$axios.post('/cart/buybol', readyData)
          .then((res) => {
            if (res.data === 'success') {
              this.buybol = false
              this.handleAdd(row)
            } else if (res.data === 'error') {
              this.msg = '商品已经在购物车中'
              this.buybol = true
              this.dialog = true
            }
          })
          .catch((err) => { console.log('err', err); return err })
      } else {
        this.$message({ message: '商品已经不存在', type: 'error' })
      }
    },
    handleDel (index, row) {
      if (row.collectionGameid) {
        var readyData = JSON.stringify({
          collectionGameid: row.collectionGameid,
          collectionUserid: this.userId
        })
        this.$axios.post('/collection/deletecollection', readyData)
          .then((res) => {
            if (res.data === 'success') {
              this.reload()
            } else if (res.data === 'error') {
              this.$message({ message: '移除收藏夹失败', type: 'error' })
            }
          })
          .catch((err) => { console.log('err', err); return err })
      } else {
        var readyData2 = JSON.stringify({
          collectionName: row.collectionName,
          collectionUserid: this.userId
        })
        this.$axios.post('/collection/deletecollect', readyData2)
          .then((res) => {
            if (res.data === 'success') {
              this.reload()
            } else if (res.data === 'error') {
              this.$message({ message: '移除收藏夹失败', type: 'error' })
            }
          })
          .catch((err) => { console.log('err', err); return err })
      }
    },
    skip () {
      this.$router.push({ path: '/shoppingCart' })
    }
  }
}
</script>

<style lang="less" scoped>
.favbox{
    margin-top: 30px;
    margin-left: 24%;
    width: 1000px;
    border-radius: 10px;
    margin-bottom: 100px;
}
</style>
