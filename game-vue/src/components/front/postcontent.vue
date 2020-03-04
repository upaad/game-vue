<template>
    <div class="postbox">
        <el-row>
            <el-col :span="16">
                <el-card class="box1">
                    <p><span class="title">{{title}}</span></p>
                    <div>
                        <span class="time">发表于{{time}}</span>
                        <span style="padding-left: 450px;"><i class="el-icon-thumb"/> {{thumbs}}</span>
                        <span style="padding-left: 10px;">回复: {{reply}}</span>
                    </div>
                    <hr/>
                    <div class="content">
                        <span>{{content}}</span>
                    </div>
                        <el-button :disabled="pubol" size="medium" type="warning" @click="puthumb()" class="btn" circle>
                            <i style="font-size:20px;" class="el-icon-thumb"/>
                        </el-button>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box2">
                    <span v-if="this.thisid">
                        <el-avatar :size="60" @error="errorHandler">
                            <img v-if="!this.pimg" @click="skip()" src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                            <img v-if="this.pimg" :src="pimg" @click="skip()"/>
                        </el-avatar>
                        <div>
                            <span class="username">{{username}}</span>
                            <span style="padding-left:10px;">
                              <el-button size="mini" type="danger" @click="opendialog()" circle="">
                                <i class="el-icon-chat-dot-square"/>
                              </el-button>
                            </span>
                        </div>
                    </span>
                    <h1 v-if="!this.thisid" style="padding-top:50px;color:red;">用户已经不存在</h1>
                </el-card>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <el-card class="box3">
                    <h3>评论</h3>
                    <div class="demo-type">
                        <el-row v-if="this.userId">
                            <el-col :span="3">
                                <el-avatar :size="60" :src="myimg" @error="errorHandler">
                                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                                </el-avatar>
                            </el-col>
                            <el-col :span="21" style="margin-top:20px;">
                                <el-input
                                    maxlength="60"
                                    type="textarea"
                                    :rows="3"
                                    style="font-size: 20px;"
                                    placeholder="请输入60字以内的内容"
                                    v-model="textarea">
                                </el-input>
                            </el-col>
                            <el-col :span="24">
                                <el-button style="margin-top:10px;float:right;" @click="discuss()" type="primary">评论</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <el-table
                        :data="comments"
                        style="width: 100%">
                        <el-table-column prop="title">
                            <template slot-scope="scope">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <div>
                                        <el-row >
                                            <el-col :span="3">
                                                    <el-avatar :size="60" @error="errorHandler">
                                                        <img v-if="!scope.row.commentUserimg" @click="skips(scope.$index,scope.row)" src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                                                        <img v-if="scope.row.commentUserimg" :src="scope.row.commentUserimg" @click="skips(scope.$index,scope.row)"/>
                                                    </el-avatar>
                                            </el-col>
                                            <el-col :span="8">
                                                    <span v-if="!scope.row.userinfoName" style="color:red;">用户已经不存在</span>
                                                    <span v-if="scope.row.userinfoName">{{scope.row.userinfoName}}</span>
                                                    <span style="padding-left:20px;">发表于{{scope.row.commentTime | dateFmt('YYYY-MM-DD HH:mm:ss')}}</span>
                                            </el-col>
                                        </el-row>
                                        <div>
                                            <span class="commontx">{{scope.row.commentContent}}</span>
                                        </div>
                                    </div>
                                </el-form>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <div>
          <el-dialog title="私信" :visible.sync="msgdialog" width="20%" :before-close="closeDialog">
              <el-form :model="msgform" ref="msgform">
                  <el-form-item prop="userName">
                      <el-input v-model="msgform.name" autocomplete="off" placeholder="请输入用户名"></el-input>
                  </el-form-item>
                  <el-form-item prop="msg">
                      <el-input @keyup.enter.native="send()" maxlength="60" type="textarea" :rows="3" placeholder="不超过60字" v-model="msgform.msg"></el-input>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="send()">发 送</el-button>
              </div>
          </el-dialog>
        </div>
    </div>
</template>

<script>

export default {
  props: ['postid'],
  inject: ['reload'],
  data () {
    return {
      postId: '',
      userId: '',
      thisid: '',
      msgdialog: false,
      title: '',
      content: '',
      pubol: '',
      time: '',
      thumbs: '',
      reply: '',
      pimg: '',
      myimg: '',
      myname: '',
      username: '',
      textarea: '',
      comments: [{
        userinfoId: '',
        commentUserimg: '',
        userinfoName: '',
        commentTime: '',
        commentContent: ''
      }],
      msgform: [{
        name: '',
        msg: ''
      }]
    }
  },
  created () {
    this.postId = this.postid
    this.userId = sessionStorage.getItem('userId')
    this.loadPostData()
    this.loadCommonData()
    if (this.userId) {
      this.puthumbol()
      this.loadImgData()
    }
    console.log(this.comments.commentUserimg)
  },
  methods: {
    loadPostData () {
      var readyData = JSON.stringify({
        postId: this.postId
      })
      this.$axios.post('/post/showpostdetail', readyData)
        .then((res) => {
          if (res && res.status === 200) {
            this.title = res.data.postTitle
            this.content = res.data.postContent
            this.time = res.data.postTime
            this.thumbs = res.data.postThumbs
            this.reply = res.data.postCommons
            this.pimg = res.data.userinfoImg
            this.username = res.data.userinfoName
            this.thisid = res.data.userinfoId
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    loadCommonData () {
      var readyData = JSON.stringify({
        commentPostid: this.postId
      })
      this.$axios.post('/post/showpostcommon', readyData)
        .then((res) => {
          if (res && res.status === 200) {
            this.comments = res.data
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    loadImgData () {
      var readyData = JSON.stringify({
        userinfoId: this.userId
      })
      this.$axios.post('/user/showuser', readyData)
        .then((res) => {
          if (res && res.status === 200) {
            this.myimg = res.data.userinfoImg
            this.myname = res.data.userinfoName
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    puthumbol () {
      var readyData = JSON.stringify({
        puthumbPostid: this.postId,
        puthumbUserid: this.userId
      })
      console.log(readyData)
      this.$axios.post('/thumb/puthumbol', readyData)
        .then((res) => {
          if (res.data === 'success') {
            this.pubol = false
          } else if (res.data === 'error') {
            this.pubol = true
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    closeDialog () {
      this.$nextTick(() => {
        this.msgdialog = false
        this.$refs['msgform'].resetFields()
      })
    },
    puthumb () {
      var readyData = JSON.stringify({
        puthumbPostid: this.postId,
        puthumbUserid: this.userId
      })
      this.$axios.post('/thumb/addthumb', readyData)
        .then((res) => {
          if (res.data === 'success') {
            this.pubol = true
            this.$message({ message: '点赞成功', type: 'success' })
            this.reload()
          } else if (res.data === 'error') {
            this.pubol = false
            this.$message({ message: '点赞失败', type: 'error' })
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    discuss () {
      var readyData = JSON.stringify({
        commentPostname: this.title,
        commentUserimg: this.myimg,
        commentContent: this.textarea,
        commentUserid: this.userId,
        commentPostid: this.postId
      })
      this.$axios.post('/comment/insertcomment', readyData)
        .then((res) => {
          if (res.data === 'success') {
            this.$message({ message: '评论成功', type: 'success' })
            this.reload()
          } else if (res.data === 'error') {
            this.$message({ message: '评论失败', type: 'error' })
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    opendialog () {
      if (this.userId) {
        this.msgform.name = this.username
        this.msgdialog = true
      } else {
        this.$message({ message: '请先登陆', type: 'error' })
      }
    },
    send () {
      if (this.myname === this.msgform.name) {
        this.$message({ message: '不能和自己私信', type: 'error' })
      } else {
        var readyData = JSON.stringify({
          privatemsgSendid: this.userId,
          privatemsgSendname: this.myname,
          privatemsgAcceptid: this.thisid,
          privatemsgAcceptname: this.msgform.name,
          privatemsgContent: this.msgform.msg
        })
        this.$axios.post('/msg/send', readyData)
          .then((res) => {
            if (res) {
              this.closeDialog()
              this.$message({ message: '发送成功', type: 'success' })
            } else {
              this.$message({ message: '发送失败', type: 'error' })
              this.msgdialog = true
            }
          })
          .catch((err) => { console.log('err', err); return err })
      }
    },
    errorHandler () {
      return true
    },
    skip () {
      if (this.thisid) {
        this.$router.push({ path: '/othersdata', query: { thisId: this.thisid } })
      } else {
        this.$message({ message: '用户已经不存在', type: 'error' })
      }
    },
    skips (index, row) {
      if (row.userinfoId) {
        this.$router.push({ path: '/othersdata', query: { thisId: row.userinfoId } })
      } else {
        this.$message({ message: '用户已经不存在', type: 'error' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.postbox{
    padding-bottom: 100px;
    margin-top: 50px;
    width: 100%;
}
.box1{
    width: 880px;
    margin-left: 350px;
}
.box2{
    width: 300px;
    height: 200px;
}
.box3{
    width: 880px;
    margin-left: 350px;
}
.title{
  text-align: left;
    font-size: 40px;
}
.username{
    padding-top: 20px;
    padding-left: 25px;
    text-align: center;
}
.time{
    float: left;
    padding-left: 20px;
}
.thums{
    padding-left: 450px;
}
.content{
    padding-left: 20px;
    padding-right: 20px;
    text-align: left;
}
.btn{
    margin-top: 50px;
}
.commontx{
    float: left;
    text-align: left;
    padding-right: 50px;
    padding-left: 100px;
}
</style>
