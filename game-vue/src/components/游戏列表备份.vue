<template>
    <div class="list">
        <el-tabs type="border-card">
            <el-col class="block" v-for="(o,index) in gamelist" :key="index" >
                <el-card :body-style="{ padding: '0px' }">
                    <img :src="o.gameImg" class="image">
                    <div class="box" style="padding: 14px;">
                            <el-button class="gamename" @click="skip(index)" type="text">{{o.gameName}}</el-button>
                            <div>
                                <el-tag class="tag" >{{o.gameCharacter}}</el-tag>
                            </div>
                        </div>
                        <div class="gameprice">
                            <div class="pricetag">
                                <el-tag v-if="o.gamePromotion" color="Orange" effect="dark" type="warning">{{o.gameDiscount*100}}%</el-tag>
                            </div>
                            <div class="nowprice2" v-if="!o.gamePromotion">¥ {{o.gamePrice}}</div>
                            <div class="nowprice" v-if="o.gamePromotion">¥ {{o.gamePrice*o.gameDiscount}}</div>
                            <div class="oldprice" v-if="o.gamePromotion">¥ {{o.gamePrice}}</div>
                        </div>
                </el-card>
            </el-col>
        </el-tabs>
    </div>
</template>

<script>
export default {
  props: ['sortname'],
  data () {
    return {
      currpagePage1: 1,
      pagesize: 10,
      currpage: 1,
      gamelist: [{
        gameId: '',
        gameImg: '',
        gameName: '',
        gameCharacter: '',
        gameDiscount: '',
        gamePrice: '',
        gamePromotion: ''
      }]
    }
  },
  created () {
    if (this.sortname) {
      if (this.sortname === '所有') {
        this.loadListData()
      } else {
        this.loadSortGame()
      }
    } else {
      this.$message({ message: '出错了可能是sortName为空', type: 'error' })
    }
  },
  methods: {
    loadListData () {
      this.$axios.post('/game/showallgame')
        .then((res) => {
          if (res && res.status === 200) {
            this.gamelist = res.data
          }
        })
    },
    loadSortGame () {
      var readyData = JSON.stringify({
        gameCharacter: this.sortname
      })
      this.$axios.post('/game/showsortgame', readyData)
        .then((res) => {
          if (res && res.status === 200) {
            this.gamelist = res.data
          }
        })
    },
    handleSizeChange (val) {
      this.pagesize = val
    },
    handleCurrentChange (val) {
      this.currpage = val
    },
    skip (index) {
      this.$router.push({ path: '/detailedgame', query: { gameid: this.gamelist[index].gameId } })
    }
  }

}
</script>

<style lang="less" scoped>
.list{
    padding-left: 250px;
    width: 1000px;
    padding-bottom: 500px;
}
.block {
    width: 100%;
}
.image {
    width: 200px;
    height: 150px;
    display: block;
    float: left;
}
.box{
    float: left;
}
.gamename {
    font-size: 24px;
    color: #4F4F4F;
    font-family: "微软雅黑";
}
.tag{
    margin-top: 50px;
    float: left;
}
.gameprice {
    padding-top: 60px;;
}
.pricetag{
    float: right;
}
.oldprice{
    float: right;
    padding-top: 5px;
    padding-right: 20px;
    text-decoration:line-through;
    color: #8E8E8E;
}
.nowprice{
    float: right;
    padding-right: 50px;
    font-size: 24px;
    color: red;
}
.nowprice2{
    float: right;
    padding-right: 100px;
    font-size: 24px;
    color: red;
}
</style>
