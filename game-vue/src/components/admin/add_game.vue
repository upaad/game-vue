<template>
<div>
  <el-container style="height: 960px; border: 1px solid #eee">
    <adbar></adbar>
    <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <adheader></adheader>
        </el-header>
        <el-main class="main">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="addForm">
                <el-form-item label="游戏名" prop="name" required>
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="addForm.price"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input type="textarea" v-model="addForm.desc"></el-input>
                </el-form-item>
                <el-form-item label="是否打折" prop="promotion">
                    <el-switch v-model="addForm.promotion" active-text="打折" inactive-text="不打折"></el-switch>
                </el-form-item>
                <transition name="el-fade-in-linear">
                    <div v-show="this.addForm.promotion">
                        <el-form-item label="折扣" prop="discount">
                            <el-input v-model="addForm.discount"></el-input>
                        </el-form-item>
                    </div>
                </transition>
                <el-form-item label="分类" prop="character">
                    <el-select v-model="addForm.character" placeholder="请选择活动区域">
                        <el-option v-for="(o, k) in sort" :key="k" :label="o.sortName" :value="o.sortName"></el-option>
                    </el-select>
                    <span><el-button type="primary" @click="dialog=true,sortname =''">分类</el-button></span>
                </el-form-item>
                <el-form-item label="照片" required>
                    <el-upload
                        class="avatar-uploader"
                        action="#"
                        :http-request="httpRequest"
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="img" :src="img" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="下载链接" prop="down">
                    <el-input v-model="addForm.down"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('addForm')">添加商品</el-button>
                    <el-button @click="resetForm('addForm')">重置数据</el-button>
                </el-form-item>
          </el-form>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog title="添加分类" width="30%" :visible.sync="dialog">
    <el-input v-model="sortname" placeholder="请输入分类" autocomplete="off" style="width:150px;"></el-input>
    <el-button style="margin-top:20px;" type="primary" @click="addscort()">添  加</el-button>
    <el-table :data="sort.slice((currpage-1)*pagesize,currpage*pagesize)">
      <el-table-column property="sortName" label="类别名"></el-table-column>
      <el-table-column property="sortCount" label="游戏数量"></el-table-column>
      <el-table-column >
        <template slot-scope="scope">
          <el-button slot="reference" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
  </el-table>
  <el-pagination
    background
    layout="total, prev, pager, next,jumper"
    :total="sort.length"
    :page-size="pagesize"
    :current-page="currpage"
    style="padding-top:20px;"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange">
  </el-pagination>
  </el-dialog>
</div>
</template>

<script>
import adbar from './admin_sidebar.vue'
import adheader from './ad_header.vue'

export default {
  inject: ['reload'],
  components: {
    adbar, adheader
  },
  data: function () {
    var validateName = (rule, value, callback) => {
      var readyData = JSON.stringify({
        gameName: this.addForm.name
      })
      this.$axios.post('/game/duplicate', readyData)
        .then((res) => {
          if (res.data === 'error') {
            this.duplicate = true
          } else if (res.data === 'success') {
            this.duplicate = false
          }
        })
        .catch((err) => { console.log('err', err); return err })
      if (value === '') {
        callback(new Error('请输入游戏名名'))
      } else if (this.duplicate) {
        callback(new Error('用户名重复'))
        this.duplicate = false
      } else {
        callback()
      }
    }
    return {
      adminName: '',
      img: '',
      duplicate: '',
      dialog: false,
      sortname: '',
      currpagePage1: 1,
      pagesize: 4,
      currpage: 1,
      addForm: {
        name: '',
        price: '',
        desc: '',
        promotion: false,
        discount: '1',
        character: '',
        down: '',
        sale: '0'
      },
      sort: [{
        sortId: '',
        sortName: '',
        sortCount: ''
      }],
      rules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入游戏价格', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入游戏描述', trigger: 'blur' }
        ],
        character: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        down: [
          { required: true, message: '请输入下载链接', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
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
    httpRequest (date) {
      let rd = new FileReader() // 创建文件读取对象
      let file = date.file
      rd.readAsDataURL(file) // 文件读取装换为base64类型
      rd.onload = () => {
        console.log('file 转 base64结果：' + rd.result)
        this.img = rd.result
      }
    },
    submitForm (formName) {
      if (this.addForm.promotion === false) {
        this.addForm.discount = 1
      }
      if (this.img) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var readyData = JSON.stringify({
              gameName: this.addForm.name,
              gamePrice: this.addForm.price,
              gameDescription: this.addForm.desc,
              gameDiscount: this.addForm.discount,
              gamePromotion: this.addForm.promotion,
              gameCharacter: this.addForm.character,
              gameImg: this.img,
              gameDown: this.addForm.down,
              gameSale: this.addForm.sale
            })
            this.$axios.post('/game/insertgame', readyData)
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
              .catch((err) => { console.log('err', err); return err })
          }
        })
      } else {
        this.$message.error('请上传图片!')
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
    addscort () {
      if (this.sortname) {
        var readyData = JSON.stringify({
          sortName: this.sortname,
          sortCount: '0'
        })
        this.$axios.post('/sort/insertsort', readyData)
          .then((res) => {
            if (res.data === 'success') {
              this.dialog = false
              this.reload()
            }
          })
          .catch((err) => { console.log('err', err); return err })
      } else {
        this.$message.error('请输入分类')
      }
    },
    handleDelete (index, row) {
      if (row.sortCount) {
        this.$message.error('该分类还有商品，删除失败！')
      } else {
        var readyData = JSON.stringify({
          sortId: row.sortId
        })
        this.$axios.post('/sort/deletesort', readyData)
          .then((res) => {
            if (res.data === 'success') {
              this.$message.success('删除成功')
              this.reload()
            }
          })
          .catch((err) => { console.log('err', err); return err })
      }
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

.main{
    text-align: center;
    margin:0px;
    padding:0px;
}

.addForm{
    margin-top: 30px;
    padding-left: 30%;
    width: 500px;
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
