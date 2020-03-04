<template>
    <div>
        <el-container>
            <el-header>
                <indexheader></indexheader>
            </el-header>
            <el-container>
                <el-main class="main">
                    <hr class="line"/>
                    <box v-bind:gameid = "gameid"></box>
                </el-main>
                <asides v-if="this.userId"></asides>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import indexheader from '@/components/front/indexheader.vue'
import box from '@/components/front/orderPaybox.vue'
import asides from '@/components/front/aside.vue'

export default {
  components: {
    indexheader, box, asides
  },
  data () {
    return {
      gameid: '',
      userId: ''
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    this.getGameid()
  },
  methods: {
    getGameid () {
      if (this.$route.query) {
        this.gameid = this.$route.query.gameid
      }
    }
  }
}
</script>

<style lang="less" scoped>
.line{
    margin: 0px;
    padding: 0px;
    height:0px;
    border:none;
    border-top:5px groove skyblue;
}
.main{
    margin: 0px;
    padding: 0px;
    height: 100%;
    background-color:#f0f0f0
}
</style>
