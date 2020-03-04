<template>
    <div class="gameblock">
        <el-row>
            <h1 class="title">促销游戏</h1>
        </el-row>
        <el-row>
            <el-col class="block" v-for="(o, index) in block" :key="index" :offset="index > 0 ? 1 : 1">
                <el-card :body-style="{ padding: '0px' }" shadow="always">
                    <el-image class="image" :src="o.gameImg"></el-image>
                    <div class="gamename">
                        <el-button style="color:#4F4F4F;" type="text" @click="jump(index)">{{o.gameName}}</el-button>
                    </div>
                    <el-row :gutter="16" class="row">
                        <el-col :span="16">
                            <div>
                                <el-tag color="Orange" effect="dark" type="warning">{{o.gameDiscount*100}}%</el-tag>
                            </div>
                        </el-col>
                        <el-col :span="2">
                            <div class="price">
                                <!-- <span>¥{{o.gamePrice*o.gameDiscount | numFilter}}</span> -->
                                <span>¥{{o.gamePrice*o.gameDiscount}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import pic from '@/assets/timg.jpg'
export default {
  data () {
    return {
      url: pic,
      block: [{
        gameId: '',
        gameImg: '',
        gameName: '',
        gameDiscount: '',
        gamePrice: ''
      }]
    }
  },
  created () {
    this.loadBlockDate()
  },
  // 保留小数点后两位
  //   filters: {
  //     numFilter (value) {
  //       let realVal = ''
  //       if (value) {
  //         realVal = parseFloat(value).toFixed(2)
  //       } else {
  //         realVal = '--'
  //       }
  //       return realVal
  //     }
  //   },
  methods: {
    loadBlockDate () {
      this.$axios.post('/game/showblock')
        .then((res) => {
          if (res && res.status === 200) {
            this.block = res.data
          }
        })
    },
    jump (index) {
      this.$router.push({ path: '/detailedgame', query: { gameid: this.block[index].gameId } })
    }
  }
}
</script>

<style lang="less" scoped>
.gameblock{
    padding-left: 250px;
}
.title{
    text-align: left
}
.block {
    width: 200px;
}
.image {
    width: 100%;
    height: 120px;
    display: block;
}
.gamename{
    padding-top: 10px;
    text-align: left;
    padding-left: 20px;
    font-size: 80%
}
.price{
    padding-top: 10px;
}
.row{
    padding-top: 20px;
}
</style>
