<template>
    <div>
        <el-card class="databox">
            <el-table
                :data="ordertabel" style="width: 800px">
                <el-table-column prop="gameImg" label="商品图片" width="200" align="center">
                    <template slot-scope="scope">
                      <img :src="scope.row.gameImg" width="200" height="120" />
                    </template>
                </el-table-column>
                <el-table-column prop="orderName" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="orderTime" label="下单日期" :formatter="setDate" width="200" align="center"></el-table-column>
                <el-table-column prop="orderId" label="订单号" align="center"></el-table-column>
                <el-table-column prop="orderPrice" label="价格" align="center"></el-table-column>
          </el-table>
        </el-card>
    </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      userId: '',
      ordertabel: [
        {
          gameImg: '',
          orderName: '',
          orderTime: '',
          orderId: '',
          orderPrice: ''
        }
      ]
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    this.loadData()
  },
  mounted () {},
  methods: {
    loadData () {
      var readyData = JSON.stringify({
        orderUserid: this.userId
      })
      this.$axios.post('/order/showorder', readyData)
        .then((res) => {
          if (res && res.status === 200) {
            this.ordertabel = res.data
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    setDate (row, column) {
      var newdate = row[column.property]
      if (newdate === undefined) {
        return ''
      };
      return moment(newdate).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="less" scoped>
.databox{
    width: 800px;
}
</style>
