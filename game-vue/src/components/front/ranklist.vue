<template>
    <div class="rank">
        <el-table
        :data="rankdata"
        style="width:400px;">
        <el-table-column label="游戏销量总排行榜" prop="rimgs" width="200px">
            <template slot-scope="scope">
                <el-image class="rimge" :src="scope.row.gameImg"></el-image>
            </template>
        </el-table-column>
        <el-table-column width="200px;">
          <template slot-scope="scope">
            <el-button class="rname" @click="skip(scope.$index,scope.row)" type="text">{{scope.row.gameName}}</el-button>
          </template>
        </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  data () {
    return {
      rankdata: [{
        gameId: '',
        gameImg: '',
        gameName: ''
      }]
    }
  },
  created () {
    this.loadRankDate()
  },
  methods: {
    loadRankDate () {
      this.$axios.post('/game/getsale')
        .then((res) => {
          if (res && res.status === 200) {
            this.rankdata = res.data
          }
        })
    },
    skip (index, row) {
      this.$router.push({ path: '/detailedgame', query: { gameid: row.gameId } })
    }
  }
}
</script>

<style lang="less" scoped>
.rank{
    width: 400px;
}
.rimge{
    width:100%;
    height: 120px;
    display: block;
}
.rname{
  text-align: left;
  font-size: 20px;
  color: #4F4F4F;
}

</style>
