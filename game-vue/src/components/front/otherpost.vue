<template>
    <div class="box">
        <el-table
            :data="otherpost"
            style="width: 100%;">
            <el-table-column width="1000px;">
                <template slot-scope="props">
                  <p><el-button @click="skip(props.$index,props.row)" class="title" type="text">{{ props.row.postTitle }}</el-button></p>
                  <p class="content"><span >{{ props.row.postContent }}</span></p>
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
      otherpost: [{
        postTitle: '',
        postContent: ''
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
          postUserid: this.thisId
        })
        this.$axios.post('/post/showpost', readyData)
          .then((res) => {
            if (res && res.status === 200) {
              this.otherpost = res.data
              console.log(this.otherpost)
            }
          })
          .catch((err) => { console.log('err', err); return err })
      } else {
        this.otherpost = null
      }
    },
    skip (index, row) {
      this.$router.push({ path: '/post', query: { postid: row.postId } })
    }
  }
}
</script>

<style lang="less" scoped>
.box{
    padding-top: 0px;
    padding: 0px;
    width: 1000px;
    padding-bottom: 100px;
}
.title{
    font-size: 20px;
    padding-left: 20px;
    color: #4F4F4F;
}
.content{
    width: 950px;
    height: 10x;
    padding-left: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
