<template>
  <div>
    <el-container style="height: 960px; border: 1px solid #eee">
      <adbar></adbar>
      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <adheader></adheader>
        </el-header>
        <el-main style="margin:0px;padding:0px;">
          <el-table
            :data="tableData.slice((currpage-1)*pagesize,currpage*pagesize)"
            :header-cell-style="{background:'#F4F4F4',color:'#3C3C3C'}" style="width: 100%" id="tableData">
            <el-table-column prop="orderId" label="订单ID" width="80px"></el-table-column>
            <el-table-column prop="orderName" label="游戏名"></el-table-column>
            <el-table-column prop="orderPrice" label="价格" ></el-table-column>
            <el-table-column prop="orderTime" label="下单时间" :formatter="setDate" ></el-table-column>
            <el-table-column prop="orderGameid" label="游戏ID"></el-table-column>
            <el-table-column prop="orderUserid" label="用户ID"></el-table-column>
            <el-table-column prop="orderStatus" label="是否付款" :formatter="formatBoolean"></el-table-column>
            <el-table-column align="right" width="200px;">
              <template slot="header" slot-scope="scope">
                <el-input v-model="sel" @keyup.enter.native="select(scope.$index,scope.row)" size="mini"  placeholder="输入关键字" />
              </template>
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button style="float:right;margin-top:20px;" size="mini" type="success" plain @click="exportExcel">点击Excel</el-button>
          <el-pagination
            background
            layout="total,sizes,prev, pager, next,jumper"
            :total="tableData.length"
            :page-sizes="[5, 10, 20]"
            :page-size="pagesize"
            :current-page="currpage"
            style="padding-top:20px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
          </el-pagination>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import adbar from './admin_sidebar.vue'
import moment from 'moment'
import adheader from './ad_header.vue'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  inject: ['reload'],
  components: {
    adbar, adheader
  },
  data: function () {
    return {
      currpagePage1: 1,
      pagesize: 10,
      currpage: 1,
      sel: '',
      tableData: [
        {
          orderId: '',
          orderName: '',
          orderPrice: '',
          orderTime: '',
          orderGameid: '',
          orderUserid: '',
          orderStatus: ''
        }
      ]
    }
  },
  created () {
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
    handleSizeChange (val) {
      this.pagesize = val
    },
    handleCurrentChange (val) {
      this.currpage = val
    },
    select (index, row) {
      var readyData = JSON.stringify({
        orderName: this.sel
      })
      this.$axios.post('/order/showlike', readyData)
        .then((res) => {
          if (res) {
            this.tableData = res.data
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    handleSee: function (index, row) {
      this.postContent2 = row.postContent
      console.log(this.postContent2)
    },
    handleDelete: function (index, row) {
      var readyData = JSON.stringify({
        orderId: row.orderId
      })
      this.$axios.post('/order/deleteorder', readyData)
        .then((res) => {
          if (res.data === 'success') {
            this.reload()
          } else if (res.data === 'error') {
            this.$alert('发生了意料之外的错误', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            })
          }
        })
        .catch((err) => {
          this.$alert('发生了意料之外的错误', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
          console.log('err', err); return err
        })
    },
    loadData () {
      this.$axios.post('/order/showallorder')
        .then((res) => {
          if (res && res.status === 200) {
            this.tableData = res.data
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    formatBoolean: function (row, column, cellValue) {
      this.orderStatus = ''
      if (cellValue) {
        this.orderStatus = '是'
      } else {
        this.orderStatus = '否'
      }
      return this.orderStatus
    },
    setDate (row, column) {
      var newdate = row[column.property]
      if (newdate === undefined) {
        return ''
      };
      return moment(newdate).format('YYYY-MM-DD HH:mm:ss')
    },
    exportExcel () {
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector('#tableData'))
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          // Blob 对象表示一个不可变、原始数据的类文件对象。
          // Blob 表示的不一定是JavaScript原生格式的数据。
          // File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: 'application/octet-stream' }),
          // 设置导出文件名称
          'sheetjs.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    }
  }
}
</script>

<style>
.el-header {
  background-color: #7D7DFF;
  color: #333;
  line-height: 60px;
}
</style>
