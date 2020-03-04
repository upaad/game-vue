<template>
    <div class="safebox">
        <el-card>
            <el-table
                :data="safetable"
                style="width: 880px;">
                <el-table-column width="80">
                    <template slot-scope="scope">
                        <span class="tag">
                            <i v-if="scope.row.bol" class="el-icon-circle-check"/>
                            <i v-if="!scope.row.bol"  class="el-icon-warning-outline"/>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" width="140">
                </el-table-column>
                <el-table-column prop="msg" width="420">
                </el-table-column>
                <el-table-column prop="txt" width="110">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="handleClick(scope.$index, scope.row)" round>{{scope.row.txt}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      userId: '',
      safetable: [{
        bol: '',
        title: '设置密码',
        msg: '',
        txt: ''
      },
      {
        bol: '',
        title: '绑定邮箱',
        msg: '',
        txt: ''
      },
      {
        bol: '',
        title: '绑定手机',
        msg: '',
        txt: ''
      }]

    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    this.loadDate()
  },
  methods: {
    loadDate () {
      var readyData = JSON.stringify({
        userinfoId: this.userId
      })
      this.$axios.post('/user/showuser', readyData)
        .then((res) => {
          if (res) {
            this.safetable[0].bol = res.data.userinfoPwd
            this.safetable[1].bol = res.data.userinfoEmail
            this.safetable[2].bol = res.data.userinfoPhone
            if (this.safetable[0].bol) {
              this.safetable[0].txt = '修改密码'
            }
            if (this.safetable[1].bol) {
              this.safetable[1].txt = '修改邮箱'
            } else if (!this.safetable[1].bol) {
              this.safetable[1].txt = '绑定邮箱'
            }
            if (this.safetable[2].bol) {
              this.safetable[2].txt = '修改手机'
            } else if (!this.safetable[2].bol) {
              this.safetable[2].txt = '绑定手机'
            }
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    handleClick (index, row) {
      if (row.txt === '修改密码') {
        this.$router.push({ path: '/updatepwd' })
      } else if (row.txt === '修改邮箱') {
        this.$router.push({ path: '/updateemail' })
      } else if (row.txt === '修改手机') {
        this.$router.push({ path: '/updatephone' })
      } else if (row.txt === '绑定邮箱') {
        this.$router.push({ path: '/bindemail' })
      } else if (row.txt === '绑定手机') {
        this.$router.push({ path: '/bindphone' })
      } else {
        this.$alert('发生了意料之外的错误', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    }
  }

}
</script>

<style lang="less" scoped>
.safebox{
    width: 800px;
}
.tag{
    font-size: 50px;
}
.title{
    margin-left: 50px;
}
</style>
