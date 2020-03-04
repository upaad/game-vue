<template>
    <div>
        <el-container>
            <el-header>
                <indexheader></indexheader>
            </el-header>
            <el-container>
                <el-main class="main">
                  <hr class="line"/>
                  <div>
                    <div class="list" >
                        <el-tabs type="border-card">
                          <div class="title">
                            <span>搜索到的游戏</span>
                          </div>
                              <el-table :data="gamelist.slice((currpage-1)*pagesize,currpage*pagesize)" class="block">
                                <el-table-column width="960px">
                                  <template slot-scope="props">
                                    <el-card :body-style="{ padding: '0px' }">
                                        <img :src="props.row.gameImg" class="image">
                                        <div class="box" style="padding: 14px;">
                                                <el-button class="gamename" @click="skip(props.$index,props.row)" type="text">{{props.row.gameName}}</el-button>
                                                <div>
                                                    <el-tag class="tag" >{{props.row.gameCharacter}}</el-tag>
                                                </div>
                                            </div>
                                            <div class="gameprice">
                                                <div class="pricetag">
                                                    <el-tag v-if="props.row.gamePromotion" color="Orange" effect="dark" type="warning">{{props.row.gameDiscount*100}}%</el-tag>
                                                </div>
                                                <div class="nowprice2" v-if="!props.row.gamePromotion">¥ {{props.row.gamePrice}}</div>
                                                <div class="nowprice" v-if="props.row.gamePromotion">¥ {{props.row.gamePrice*props.row.gameDiscount}}</div>
                                                <div class="oldprice" v-if="props.row.gamePromotion">¥ {{props.row.gamePrice}}</div>
                                            </div>
                                    </el-card>
                                  </template>
                                </el-table-column>
                              </el-table>
                              <el-pagination
                                  background
                                  layout="total,sizes,prev, pager, next,jumper"
                                  :total="gamelist.length"
                                  :page-sizes="[5, 10, 20]"
                                  :page-size="pagesize"
                                  :current-page="currpage"
                                  style="padding-top:20px;float:right;"
                                  @size-change="handleSizeChange"
                                  @current-change="handleCurrentChange">
                              </el-pagination>
                        </el-tabs>
                    </div>
                  </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import indexheader from '@/components/front/indexheader.vue'

export default {
  inject: ['reload'],
  components: {
    indexheader
  },
  data () {
    return {
      Sel: '',
      pagesize: 5,
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
    this.getSortname()
    this.loadSelgame()
  },
  beforeRouteUpdate (to, from, next) {
    if (to.fullPath !== from.fullPath) {
      this.reload()
      next()
    }
  },
  methods: {
    getSortname () {
      if (this.$route.query) {
        this.Sel = this.$route.query.sel
      }
    },
    loadSelgame () {
      var readyData = JSON.stringify({
        gameName: this.Sel
      })
      this.$axios.post('/game/showlike', readyData)
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
    skip (index, row) {
      this.$router.push({ path: '/detailedgame', query: { gameid: row.gameId } })
    }
  }
}
</script>

<style lang="less" scoped>
.main{
    margin: 0px;
    padding: 0px;
    height: 100%;
    background-color:#f0f0f0
}
.line{
    margin: 0px;
    padding: 0px;
    height:0px;
    border:none;
    border-top:5px groove skyblue;
}
.title{
    font-size: 24px;
    text-align: left;
}
.list{
    padding-left: 24%;
    width: 1000px;
    padding-bottom: 500px;
    padding-top: 50px;
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
    color: #000;
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
