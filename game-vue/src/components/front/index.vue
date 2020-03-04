<template>
    <div>
        <el-container>
            <el-header>
                <indexheader></indexheader>
            </el-header>
            <el-container>
                <el-main class="main">
                    <hr class="line"/>
                    <up></up>
                    <roll></roll>
                    <gameblock></gameblock>
                    <el-row>
                        <el-col :span="17">
                            <gamelist></gamelist>
                        </el-col>
                        <el-col :span="7">
                            <rank></rank>
                        </el-col>
                    </el-row>
                </el-main>
                <asides v-if="this.userId"></asides>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import indexheader from '@/components/front/indexheader.vue'
import roll from '@/components/front/scrollpicture.vue'
import gameblock from '@/components/front/gameblock.vue'
import gamelist from '@/components/front/gamelist.vue'
// import up from '@/components/front/up.vue'
import rank from '@/components/front/ranklist.vue'
import asides from '@/components/front/aside.vue'

export default {
  components: {
    indexheader, roll, gameblock, gamelist, rank, asides
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
  },
  methods: {}
}
</script>

<style>
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
