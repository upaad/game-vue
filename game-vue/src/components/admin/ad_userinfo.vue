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
            <el-table-column prop="userinfoId" label="用戶ID" width="80px"></el-table-column>
            <el-table-column prop="userinfoName" label="用戶名"></el-table-column>
            <el-table-column prop="userinfoPwd" label="密码"></el-table-column>
            <el-table-column prop="userinfoEmail" label="电子邮箱"></el-table-column>
            <el-table-column prop="userinfoPhone" label="手机号"></el-table-column>
            <el-table-column prop="userinfoSex" label="性别"></el-table-column>
            <el-table-column prop="userinfoBirthday" label="出生年月日"></el-table-column>
            <el-table-column prop="userinfoCreatetime" label="创建时间" :formatter="setDate"></el-table-column>
            <el-table-column align="right">
              <template slot="header" slot-scope="scope" >
                <el-input v-model="sel" @keyup.enter.native="select(scope.$index,scope.row)" size="mini" placeholder="输入关键字" />
              </template>
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row),dialogFormVisible = true">修改</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
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
    <el-dialog title="修改用户" :visible.sync="dialogFormVisible" width="500px" :center='bol' top="9vh">
      <el-form :model="updateForm" :label-width="formLabelWidth">
          <el-form-item label="照片">
              <el-upload
                  class="avatar-uploader"
                  action="#"
                  :http-request="httpRequest"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="updateForm.userinfoImg" :src="updateForm.userinfoImg" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
          <el-form-item label="用户名" prop="name2">
          <el-input v-model="updateForm.name2" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd2">
              <el-input v-model="updateForm.pwd2"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email2">
              <el-input v-model="updateForm.email2"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone2">
              <el-input v-model="updateForm.phone2"></el-input>
          </el-form-item>
          <el-form-item label="性别">
          <el-select v-model="updateForm.sex2" placeholder="请选择分类">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="出生年月日">
              <el-col :span="11">
              <el-form-item prop="birthday">
                  <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="updateForm.birthday2" style="width: 220px;"></el-date-picker>
              </el-form-item>
              </el-col>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('updateForm')">修改用户</el-button>
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
      adminName: '',
      dialogFormVisible: false,
      formLabelWidth: '200px',
      userId2: '',
      bol: true,
      currpagePage1: 1,
      pagesize: 10,
      currpage: 1,
      sel: '',
      updateForm: {
        userinfoImg: '',
        name2: '',
        pwd2: '',
        email2: '',
        phone2: '',
        sex2: '',
        birthday2: ''
      },
      tableData: [
        {
          userinfoId: '',
          userinfoName: '',
          userinfoPwd: '',
          userinfoEmail: '',
          userinfoPhone: '',
          userinfoSex: '',
          userinfoBirthday: '',
          userinfoCreatetime: '',
          userinfoImg: ''
        }
      ]
    }
  },
  created () {
    this.loadData()
    this.adminName = sessionStorage.getItem('adminName')
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
        userinfoName: this.sel
      })
      this.$axios.post('/user/showlike', readyData)
        .then((res) => {
          if (res) {
            this.tableData = res.data
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    handleEdit: function (index, row) {
      this.userId2 = row.userinfoId
      this.updateForm.userinfoImg = row.userinfoImg
      this.updateForm.name2 = row.userinfoName
      this.updateForm.pwd2 = row.userinfoPwd
      this.updateForm.email2 = row.userinfoEmail
      this.updateForm.phone2 = row.userinfoPhone
      this.updateForm.sex2 = row.userinfoSex
      this.updateForm.birthday2 = row.userinfoBirthday
    },
    handleDelete: function (index, row) {
      var readyData = JSON.stringify({
        userinfoId: row.userinfoId
      })
      this.$axios.post('/user/deleteuser', readyData)
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
      this.$axios.post('/user/showalluser')
        .then((res) => {
          if (res && res.status === 200) {
            this.tableData = res.data
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    handleAvatarSuccess (res, file) {
      this.updateForm.userinfoImg = URL.createObjectURL(file.raw)
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
        this.updateForm.userinfoImg = rd.result
      }
    },
    submitForm (formName) {
      var readyData = JSON.stringify({
        userinfoId: this.userId2,
        userinfoImg: this.updateForm.userinfoImg,
        userinfoName: this.updateForm.name2,
        userinfoPwd: this.updateForm.pwd2,
        userinfoEmail: this.updateForm.email2,
        userinfoPhone: this.updateForm.phone2,
        userinfoSex: this.updateForm.sex2,
        userinfoBirthday: this.updateForm.birthday2
      })
      console.log('更新之前的数据：' + readyData)
      this.$axios.post('/user/updateuser', readyData)
        .then((res) => {
          console.log('更新之后的数据：' + readyData)
          if (res.data === 'success') {
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

.el-aside {
  color: #333;
}

.item {
  text-align: center;
  padding-top: 100px;
  font-size: 50px;
  color: #00ffff;
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
