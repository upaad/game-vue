<template>
    <div class="box">
        <el-tabs type="border-card">
            <el-button style="float:right;" @click="insertpost()" type="primary">发布帖子</el-button>
            <el-tab-pane label="最新">
                <el-table
                    :data="postlist.slice((currpage-1)*pagesize,currpage*pagesize)"
                    style="width: 100%">
                    <el-table-column prop="title" width="960">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item>
                                            <el-button @click="skip(props.$index,props.row)" class="title" type="text">{{ props.row.postTitle }}</el-button>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item>
                                            <span class="content">{{ props.row.postContent }}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="1">
                                        <el-form-item>
                                            <el-avatar size="small" :src="props.row.userinfoImg" @error="errorHandler">
                                                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                                            </el-avatar>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-form-item>
                                            <span class="username">{{ props.row.userinfoName }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="15">
                                        <el-form-item>
                                            <span class="time" >{{ props.row.postTime | dateFmt('YYYY-MM-DD HH:mm:ss')}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-form-item>
                                            <i style="font-size: 20px" :class="icon"/>
                                            <span class="thums" > {{ props.row.postThumbs }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-form-item>
                                            <span class="common">{{msg}}</span>{{ props.row.postCommons }}
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    layout="total,sizes,prev, pager, next,jumper"
                    :total="postlist.length"
                    :page-sizes="[5, 10, 20]"
                    :page-size="pagesize"
                    :current-page="currpage"
                    style="padding-top:20px;float:right;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange">
                </el-pagination>
            </el-tab-pane>

            <el-tab-pane label="最热">
                <el-table
                    :data="postlist2.slice((currpage2-1)*pagesize2,currpage2*pagesize2)"
                    style="width: 100%">
                    <el-table-column prop="title" width="960">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item>
                                            <el-button @click="skip(props.$index,props.row)" class="title" type="text">{{ props.row.postTitle }}</el-button>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item>
                                            <span class="content">{{ props.row.postContent }}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="1">
                                        <el-form-item>
                                            <el-avatar size="small" :src="props.row.userinfoImg" @error="errorHandler">
                                                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                                            </el-avatar>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-form-item>
                                            <span class="username">{{ props.row.userinfoName }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="15">
                                        <el-form-item>
                                            <span class="time" >{{ props.row.postTime | dateFmt('YYYY-MM-DD HH:mm:ss')}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-form-item>
                                            <i style="font-size: 20px" :class="icon"/>
                                            <span class="thums" > {{ props.row.postThumbs }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-form-item>
                                            <span class="common">{{msg}}</span>{{ props.row.postCommons }}
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    layout="total,sizes,prev, pager, next,jumper"
                    :total="postlist2.length"
                    :page-sizes="[5, 10, 20]"
                    :page-size="pagesize2"
                    :current-page="currpage2"
                    style="padding-top:20px;float:right;"
                    @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2">
                </el-pagination>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

export default {
  data () {
    return {
      userId: '',
      icon: '',
      msg: '',
      pagesize: 5,
      currpage: 1,
      pagesize2: 5,
      currpage2: 1,
      postlist: [{
        postId: '',
        postTitle: '',
        postContent: '',
        userinfoImg: '',
        userinfoName: '',
        postTime: '',
        postThumbs: '',
        postCommons: ''
      }],
      postlist2: [{
        postId: '',
        postTitle: '',
        postContent: '',
        userinfoImg: '',
        userinfoName: '',
        postTime: '',
        postThumbs: '',
        postCommons: ''
      }]
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    this.loadNowDate()
    this.loadHotDate()
  },
  mounted () {
    const timer = setInterval(() => {
    // 某些定时器操作
      this.loadNowDate()
      this.loadHotDate()
    }, 3000)
    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
    })
  },
  methods: {
    loadNowDate () {
      this.$axios.post('/post/shownowpost')
        .then((res) => {
          if (res && res.status === 200) {
            this.postlist = res.data
            if (res.data.postCommons) {
              this.msg = '回复：'
            }
            this.icon = 'el-icon-thumb'
          }
        })
        .catch((err) => { console.log('err', err); return err })
    },
    loadHotDate () {
      this.$axios.post('/post/showhotpost')
        .then((res) => {
          if (res && res.status === 200) {
            this.postlist2 = res.data
            this.msg = '回复：'
            this.icon = 'el-icon-thumb'
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
    handleSizeChange2 (val) {
      this.pagesize2 = val
    },
    handleCurrentChange2 (val) {
      this.currpage2 = val
    },
    errorHandler () {
      return true
    },
    skip (index, row) {
      this.$router.push({ path: '/post', query: { postid: row.postId } })
    },
    insertpost () {
      if (this.userId) {
        this.$router.push({ path: '/insertpost' })
      } else {
        this.$alert('请先登陆', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    }
  }

}
</script>

<style lang="less" scoped>
.box{
    width: 1000px;
    margin-left: 24%
}
.title{
    font-size: 20px;
    color: #4F4F4F;
}
.content{
    width: 900px;
    height: 10x;
    overflow: hidden;
    text-overflow: ellipsis;
}
.username{
    padding-left: 10px;
}
</style>
