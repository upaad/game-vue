<template>
    <div class="list">
        <el-tabs type="border-card">
            <el-tab-pane label="最新">
                <el-col class="block" v-for="(o, index) in gamelist" :key="index" >
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
            </el-tab-pane>

            <el-tab-pane label="促销">
                <el-col class="block" v-for="(i,index) in promotion" :key="index" >
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="i.gameImg" class="image">
                        <div class="box" style="padding: 14px;">
                            <el-button class="gamename" @click="skips(index)" type="text">{{i.gameName}}</el-button>
                            <div>
                                <el-tag class="tag">{{i.gameCharacter}}</el-tag>
                            </div>
                        </div>
                        <div class="gameprice">
                            <div class="pricetag">
                                <el-tag color="Orange" effect="dark" type="warning">{{i.gameDiscount*100}}%</el-tag>
                            </div>
                            <div class="nowprice">¥ {{i.gamePrice*i.gameDiscount}}</div>
                            <div class="oldprice">¥ {{i.gamePrice}}</div>
                        </div>
                    </el-card>
                </el-col>
            </el-tab-pane>
        </el-tabs>
        <el-button class="more" @click="more()">查看更多</el-button>
    </div>
</template>

<script>
export default {
  data () {
    return {
      gamelist: [{
        gameId: '',
        gameImg: '',
        gameName: '',
        gameCharacter: '',
        gameDiscount: '',
        gamePrice: '',
        gamePromotion: ''
      }],
      promotion: [{
        gameId: '',
        gameImg: '',
        gameName: '',
        gameCharacter: '',
        gameDiscount: '',
        gamePrice: ''
      }]
    }
  },
  created () {
    this.loadListData()
    this.loadeSaleData()
  },
  methods: {
    loadListData () {
      this.$axios.post('/game/shownewgame')
        .then((res) => {
          if (res && res.status === 200) {
            this.gamelist = res.data
          }
        })
    },
    loadeSaleData () {
      this.$axios.post('/game/showsale')
        .then((res) => {
          if (res && res.status === 200) {
            this.promotion = res.data
          }
        })
    },
    skip (index) {
      this.$router.push({ path: '/detailedgame', query: { gameid: this.gamelist[index].gameId } })
    },
    skips (index) {
      this.$router.push({ path: '/detailedgame', query: { gameid: this.promotion[index].gameId } })
    },
    more () {
      this.$router.push({ path: '/allgame' })
    }
  }

}
</script>

<style lang="less" scoped>
.list{
    padding-left: 250px;
    width: 1000px;
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
.more{
    width: 1000px;
    height: 50px;
    background-color: rgb(226, 226, 226);
    margin-top: 20px;
}
</style>
