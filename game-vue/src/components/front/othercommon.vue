<template>
    <div class="box">
        <el-table
            :data="othercommon"
            style="width: 100%;">
            <el-table-column width="1000px;">
                <template slot-scope="props">
                    <p><el-button @click="skip(props.$index,props.row)" class="title" type="text">{{ props.row.commentPostname }}</el-button></p>
                    <p>
                        <i class="el-icon-chat-square"/>：
                        <span class="content">{{ props.row.commentContent }}</span>
                        <span class="times">{{ props.row.commentTime | dateFmt('YYYY-MM-DD HH:mm:ss') }}</span>
                    </p>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

export default {
  props: ['thisId'],
  data () {
    return {
      othercommon: [{
        commentPostid: '',
        commentPostname: '',
        commentContent: '',
        commentTime: ''
      }]
    }
  },
  created () {
    this.loadDate()
  },
  methods: {
    loadDate () {
      if (this.thisId) {
        var readyData = JSON.stringify({
          commentUserid: this.thisId
        })
        this.$axios.post('/comment/showcomment', readyData)
          .then((res) => {
            if (res && res.status === 200) {
              this.othercommon = res.data
            }
          })
          .catch((err) => { console.log('err', err); return err })
      } else {
        this.othercommon = null
      }
    },
    skip (index, row) {
      if (row.commentPostid) {
        this.$router.push({ path: '/post', query: { postid: row.commentPostid } })
      } else {
        this.$message({ message: '你评论的帖子已经被删除了', type: 'error' })
      }
    }
  }

}
</script>

<style lang="less" scoped>
.box{
    padding-top: 0px;
    width: 1000px;
}
.title{
    font-size: 20px;
    padding-left: 20px;
    color: #4F4F4F;
}
.content{
    padding-left: 10px;
    padding-right: 10px;
    height: 20x;
    overflow: hidden;
    text-overflow: ellipsis;
}
.times{
    padding-right: 10px;
    float: right;
}
</style>
