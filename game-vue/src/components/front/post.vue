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
                        <postcontent v-bind:postid = "postid"></postcontent>
                    </div>
                </el-main>
                <asides v-if="this.userId"></asides>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import indexheader from '@/components/front/indexheader.vue'
import postcontent from '@/components/front/postcontent.vue'
import asides from '@/components/front/aside.vue'

export default {
  components: {
    indexheader, postcontent, asides
  },
  data () {
    return {
      postid: '',
      userId: ''
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    this.getPostid()
  },
  methods: {
    getPostid () {
      if (this.$route.query) {
        this.postid = this.$route.query.postid
      }
    }
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

</style>
