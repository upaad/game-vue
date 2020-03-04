<template>
    <div>
        <el-card class="gamebox">
            <el-table
                :data="gametable" style="width: 800px">
                <el-table-column prop="gameImg">
                    <template slot-scope="scope">
                        <img :src="scope.row.gameImg" width="200" height="120" />
                    </template>
                </el-table-column>
                <el-table-column prop="orderName"></el-table-column>
                <el-table-column align="right">
                    <template slot-scope="scope">
                        <el-button type="warning" plain size="small" @click="handleOpen(scope.$index, scope.row)">查看下载地址</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog
            title="激活码"
            :visible.sync="dialog"
            width="20%"
            center>
            <div>
                <el-input id="txt" style="width:78%" v-model="down" type="text" readonly="readonly"></el-input>
                <el-button type="primary" @click="copy()">复制</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      down: '',
      gametable: [{
        gameImg: '',
        orderName: '',
        orderGameid: ''
      }]
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    this.loadData()
  },
  methods: {
    handleOpen (index, row) {
      // if (row.orderGameid) {
      var readyData = JSON.stringify({
        gameName: row.orderName
      })
      this.$axios.post('/game/showonegame', readyData)
        .then((res) => {
          if (res) {
            this.down = res.data.gameDown
            this.dialog = true
          }
        })
        .catch((err) => { console.log('err', err); return err })
      // } else {
      //   this.$message({ message: '游戏已经不存在了', type: 'error' })
      // }
    },
    copy () {
      var text = document.getElementById('txt')
      text.select()
      document.execCommand('copy')
    },
    loadData () {
      var readyData = JSON.stringify({
        orderUserid: this.userId
      })
      this.$axios.post('/order/ordernorepeat', readyData)
        .then((res) => {
          if (res && res.status === 200) {
            this.gametable = res.data
          }
        })
        .catch((err) => { console.log('err', err); return err })
    }
  }

}
</script>

<style lang="less" scoped>
.gamebox{
    width: 800px;
}
</style>
