<template>
    <div>
        <el-container>
            <el-header>
                <indexheader></indexheader>
            </el-header>
            <el-container>
                <el-main class="main">
                  <hr class="line"/>
                  <div class="list">
                    <gamelist v-bind:sortname = "sortname"></gamelist>
                  </div>
                </el-main>
                <asides v-if="this.userId"></asides>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import indexheader from '@/components/front/indexheader.vue'
import gamelist from '@/components/front/allgamelist.vue'
import asides from '@/components/front/aside.vue'

export default {
  inject: ['reload'],
  components: {
    indexheader, gamelist, asides
  },
  data () {
    return {
      sortname: '所有',
      userId: ''
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    this.getSortname()
  },
  beforeRouteUpdate (to, from, next) {
    if (to.fullPath !== from.fullPath) {
      this.reload()
      next()
    }
  },
  methods: {
    getSortname () {
      if (this.$route.query.sortname) {
        this.sortname = this.$route.query.sortname
      }
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
.list{
  padding-top: 30px;
}
</style>
