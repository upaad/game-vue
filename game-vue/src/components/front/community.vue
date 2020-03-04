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
                    <postlist></postlist>
                  </div>
                </el-main>
                <asides v-if="this.userId"></asides>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import indexheader from '@/components/front/indexheader.vue'
import postlist from '@/components/front/postlist.vue'
import asides from '@/components/front/aside.vue'

export default {
  components: {
    indexheader, postlist, asides
  },
  data () {
    return {
      data () {
        return {
          userId: ''
        }
      }
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
  }

}
</script>

<style lang="less" scoped>
.main{
    width: 100%;
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
  padding-top: 50px;
  padding-bottom: 400px;
}

</style>
