<template>
    <div>
        <el-container>
            <el-header>
                <indexheader></indexheader>
            </el-header>
            <el-container>
                <el-main class="main">
                    <hr class="line"/>
                    <div style="padding-top: 100px;">
                        <detail v-bind:gameid = "gameid"></detail>
                    </div>
                </el-main>
                <asides v-if="this.userId"></asides>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import indexheader from '@/components/front/indexheader.vue'
import detail from '@/components/front/detail.vue'
import asides from '@/components/front/aside.vue'

export default {
  components: {
    indexheader, detail, asides
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

<style>
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
.aside{
    width: 20px;
    padding: 0px;
    margin: 0px;
}
.cartbtn{
    width: 20px;
    padding: 0px;
    margin: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-top: 400px;
    border-radius: 0px;
}
.collectionbtn{
    width: 20px;
    padding: 0px;
    margin: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 0px;
}

</style>
