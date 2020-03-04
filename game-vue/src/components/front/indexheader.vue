<template>
    <el-row :gutter="21" class="row">
        <el-col :span="3">
            <el-image style="width: 100px; height: 50px; padding-top: 5px;"
            :src="url"
					fit="contain"></el-image>
        </el-col>
        <el-col :span="6">
            <el-menu router :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                <el-menu-item index="/index">首页</el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">游戏</template>
                          <el-menu-item v-for="(o, k) in sort" :key="k" @click="jump(k)">{{o.sortName}}</el-menu-item>
                        <hr>
                        <el-menu-item index="/allgame">查看所有游戏</el-menu-item>
                    </el-submenu>
                <el-menu-item index="/community">社区</el-menu-item>
            </el-menu>
        </el-col>
        <el-col :span="6">
            <el-input class="sel" v-model="sel" @keyup.enter.native="search()" placeholder="请输入关键字"></el-input>
        </el-col>
        <el-col :span="4">
            <div class="selbtn">
                <el-button type="primary" @click="search()" icon="el-icon-search" plain>搜索</el-button>
            </div>
        </el-col>
        <el-col :span="5">
            <div v-if="!loginbol" style="padding-top:10px;">
                <el-button type="text" @click="out()">登陆注册</el-button>
            </div>
            <div v-if="loginbol" class="demo-type">
                <el-popover
                    placement="top-start"
                    class="popover"
                    trigger="hover">
                  <el-avatar size="medium" :plain="true" @error="errorHandler" slot="reference">
                      <img v-if="!loginbol" @click="skips()" src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                      <img v-if="loginbol" @click="skips()" :src="userpic"/>
                  </el-avatar>
                  <el-button v-if="loginbol" @click="toMydata()" type="primary">个人中心</el-button>
                  <el-button @click="out()" type="danger">
                      <span v-if="loginbol">登出</span>
                  </el-button>
                </el-popover>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import logo from '@/assets/logo.jpg'

export default {
  data () {
    return {
      url: logo,
      activeIndex: '/index',
      sel: '',
      userpic: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png',
      userId: '',
      msgs: '',
      thisName: '',
      refash: false,
      loginbol: false,
      sort: [{
        sortName: ''
      }]
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    this.loadSort()
    this.loadAvatar()
    this.loadMsgData()
  },
  mounted () {
    const timer = setInterval(() => {
    // 某些定时器操作
      this.loadMsgData2()
      if (this.refash) {
        this.ShowMsg()
      }
    }, 3000)
    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
    })
  },
  methods: {
    loadAvatar () {
      var readyData = JSON.stringify({
        userinfoId: this.userId
      })
      this.$axios.post('/user/showuser', readyData)
        .then((res) => {
          if (res.data) {
            if (res.data.userinfoImg) {
              this.userpic = res.data.userinfoImg
            }
            this.loginbol = true
          } else {
            this.loginbol = false
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    loadSort () {
      this.$axios.post('/sort/showsort')
        .then((res) => {
          if (res) {
            this.sort = res.data
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    loadMsgData () {
      var readyData = JSON.stringify({
        privatemsgAcceptid: this.userId
      })
      this.$axios.post('/msg/refreshmsg', readyData)
        .then((res) => {
          if (res) {
            if (this.msgs !== res.data.privatemsgContent) {
              this.msgs = res.data.privatemsgContent
              this.thisName = res.data.privatemsgSendname
            }
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    loadMsgData2 () {
      var readyData = JSON.stringify({
        privatemsgAcceptid: this.userId
      })
      this.$axios.post('/msg/refreshmsg', readyData)
        .then((res) => {
          if (res) {
            if (this.msgs !== res.data.privatemsgContent) {
              this.msgs = res.data.privatemsgContent
              this.thisName = res.data.privatemsgSendname
              this.refash = true
            } else {
              this.refash = false
            }
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    ShowMsg () {
      this.$notify({
        title: this.thisName,
        iconClass: 'el-icon-chat-dot-round',
        message: this.msgs
      })
    },
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    out () {
      this.$router.push({ path: '/us_login' })
      sessionStorage.removeItem('userId')
    },
    search () {
      this.$router.push({ path: '/selgame', query: { sel: this.sel } })
    },
    errorHandler () {
      return true
    },
    jump (index) {
      this.$router.push({ path: '/allgame', query: { sortname: this.sort[index].sortName } })
    },
    skips () {
      if (this.loginbol) {
        this.$router.push({ path: '/othersdata', query: { thisId: this.userId } })
      } else {
        this.$message.error('请先登陆')
      }
    },
    toMydata () {
      if (this.loginbol) {
        this.$router.push({ path: '/mydata' })
      } else {
        this.$message.error('请先登陆')
      }
    }
  }
}
</script>

<style>
.el-row {
    margin-bottom: 20px;
}
.el-col {
    border-radius: 4px;
}
.el-menu{
    margin-left: 0px;
}
.sel{
    padding-top: 10px;
    padding-left: 50px;
}
.selbtn{
    padding-top: 10px;
    margin-left: -90px;
}
.demo-type{
    padding-top: 10px;
}
.popover{
    width: 100%; /* 180px */
    padding: 0px;
    margin: 0px;
}
</style>
