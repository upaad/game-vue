<template>
  <div>
    <el-container style="height: 960px; border: 1px solid #eee;">
      <adbar></adbar>
      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <adheader></adheader>
        </el-header>
        <el-main style="margin:0px;padding:0px;">
          <el-table
            :data="tableData.slice((currpage-1)*pagesize,currpage*pagesize)"
            :header-cell-style="{background:'#F4F4F4',color:'#3C3C3C'}" style="width: 100%" id="tableData">
            <el-table-column prop="gameId" label="游戏ID" width="80px"></el-table-column>
            <el-table-column prop="gameName" label="游戏名"></el-table-column>
            <el-table-column prop="gamePrice" label="价格"></el-table-column>
            <el-table-column prop="gameDescription" label="描述" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="gameDiscount" label="折扣"></el-table-column>
            <el-table-column prop="gamePromotion" label="是否打折" :formatter="formatBoolean"></el-table-column>
            <el-table-column prop="gameCharacter" label="分类"></el-table-column>
            <el-table-column prop="gameDown" label="下载链接" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="gameTime" label="上架时间" :formatter="setDate"></el-table-column>
            <el-table-column label="操作" align="right">
              <template slot="header" slot-scope="scope">
                <el-input v-model ="sel" @keyup.enter.native="select(scope.$index,scope.row)" size="mini" placeholder="输入关键字" />
              </template>
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row),dialogFormVisible = true">修改</el-button>
                <el-button slot="reference" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="修改商品" :visible.sync="dialogFormVisible" width="500px" :center='bol' >
      <el-form :model="updateForm" :label-width="formLabelWidth">
          <el-form-item label="游戏名称" prop="name2">
          <el-input v-model="updateForm.name2" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
              <el-input v-model="updateForm.price2"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
              <el-input type="textarea" v-model="updateForm.desc2"></el-input>
          </el-form-item>
          <el-form-item label="是否打折" prop="promotion">
              <el-switch v-model="updateForm.promotion2" active-text="打折" inactive-text="不打折"></el-switch>
          </el-form-item>
          <transition name="el-fade-in-linear">
              <div v-show="this.updateForm.promotion2">
                  <el-form-item label="折扣" prop="discount">
                      <el-input v-model="updateForm.discount2"></el-input>
                  </el-form-item>
              </div>
          </transition>
          <el-form-item label="分类" >
          <el-select v-model="updateForm.character2" placeholder="请选择分类">
              <el-option v-for="(o, k) in sort" :key="k" :label="o.sortName" :value="o.sortName"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="照片">
              <el-upload
                  class="avatar-uploader"
                  action="#"
                  :http-request="httpRequest"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="img2" :src="img2" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
          <el-form-item label="下载链接" prop="down">
              <el-input v-model="updateForm.down2"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('updateForm')">修改商品</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import adbar from './admin_sidebar.vue'
import adheader from './ad_header.vue'
import moment from 'moment'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  inject: ['reload'],
  components: {
    adbar, adheader
  },
  data: function () {
    return {
      dialogFormVisible: false,
      formLabelWidth: '200px',
      bol: true,
      img2: '',
      gameId2: '',
      currpagePage1: 1,
      pagesize: 10,
      currpage: 1,
      sel: '',
      updateForm: {
        name2: '',
        price2: '',
        desc2: '',
        discount2: '',
        promotion2: '',
        character2: '',
        down2: ''
      },
      tableData: [
        {
          gameId: '',
          gameName: '',
          gamePrice: '',
          gameDescription: '',
          gameDiscount: '',
          gamePromotion: '',
          gameCharacter: '',
          gameImg: '',
          gameDown: '',
          gameTime: ''
        }
      ],
      sort: [{
        sortId: '',
        sortName: ''
      }]
    }
  },
  created () {
    this.loadData()
    this.loadSort()
  },
  methods: {
    loadSort () {
      this.$axios.post('/sort/showsort')
        .then((res) => {
          if (res) {
            this.sort = res.data
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    handleSizeChange (val) {
      this.pagesize = val
    },
    handleCurrentChange (val) {
      this.currpage = val
    },
    select (index, row) {
      var readyData = JSON.stringify({
        gameName: this.sel
      })
      this.$axios.post('/game/showlike', readyData)
        .then((res) => {
          if (res) {
            this.tableData = res.data
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    formatBoolean: function (row, column, cellValue) {
      this.gamePromotion = ''
      if (cellValue) {
        this.gamePromotion = '是'
      } else {
        this.gamePromotion = '否'
      }
      return this.gamePromotion
    },
    beforeAvatarUpload (file) {
      // 文件类型进行判断
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    httpRequest (date) {
      let rd = new FileReader() // 创建文件读取对象
      let file = date.file
      rd.readAsDataURL(file) // 文件读取装换为base64类型
      rd.onload = () => {
        console.log('file 转 base64结果：' + rd.result)
        this.img2 = rd.result
      }
    },
    submitForm (formName) {
      var readyData = JSON.stringify({
        gameId: this.gameId2,
        gameName: this.updateForm.name2,
        gamePrice: this.updateForm.price2,
        gameDescription: this.updateForm.desc2,
        gameDiscount: this.updateForm.discount2,
        gamePromotion: this.updateForm.promotion2,
        gameCharacter: this.updateForm.character2,
        gameImg: this.img2,
        gameDown: this.updateForm.down2
      })
      console.log(readyData)
      this.$axios.post('/game/updategame', readyData)
        .then((res) => {
          if (res.data === 'success') {
            console.log(readyData)
            this.dialogFormVisible = false
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
    handleEdit: function (index, row) {
      this.gameId2 = row.gameId
      this.updateForm.promotion2 = row.gamePromotion
      this.updateForm.name2 = row.gameName
      this.updateForm.price2 = row.gamePrice
      this.updateForm.discount2 = row.gameDiscount
      this.updateForm.desc2 = row.gameDescription
      this.updateForm.character2 = row.gameCharacter
      this.updateForm.down2 = row.gameDown
      this.img2 = row.gameImg
      console.log(this.gameId2)
    },
    handleDelete: function (index, row) {
      var readyData = JSON.stringify({
        gameId: row.gameId
      })
      this.$axios.post('/game/deletegame', readyData)
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
      this.$axios.post('/game/showallgame')
        .then((res) => {
          if (res && res.status === 200) {
            this.tableData = res.data
            console.log(this.total)
            if (res.data.gamePromotion) {
              this.tableData.gamePromotion = '0'
            } else {
              this.tableData.gamePromotion = '1'
            }
          }
        })
        .catch((err) => { console.log('err', err); return err })
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

<style>
.el-header {
  background-color: #7D7DFF;
  color: #333;
  line-height: 60px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 120px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 120px;
    display: block;
  }
</style>
