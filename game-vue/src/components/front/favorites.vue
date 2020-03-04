<template>
    <div>
        <el-container>
            <el-header>
                <indexheader></indexheader>
            </el-header>
            <el-container>
                <el-main class="main">
                    <hr class="line"/>
                    <fav></fav>
                </el-main>
                <asides v-if="this.userId"></asides>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import indexheader from '@/components/front/indexheader.vue'
import fav from '@/components/front/favoritesbox.vue'
import asides from '@/components/front/aside.vue'

export default {
  components: {
    indexheader, fav, asides
  },
  data () {
    return {
      userId: ''
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
