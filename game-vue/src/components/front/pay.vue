<template>
    <div>
      <el-container>
            <el-header>
                <indexheader></indexheader>
            </el-header>
            <el-container>
                <el-main class="main">
                    <hr class="line"/>
                    <div style="margin-top:100px;padding-bottom:500px;">
                      <el-image
                        style="width: 300px; height: 300px;border-radius: 150px"
                        :src="url"
                        :preview-src-list="srcList">
                      </el-image>
                      <div style="margin-top:60px;"><el-button @click="skip()" type="warning">查看下载地址</el-button></div>
                    </div>
                </el-main>
                <asides v-if="this.userId"></asides>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import indexheader from '@/components/front/indexheader.vue'
import asides from '@/components/front/aside.vue'
import pic from '@/assets/success.jpg'

export default {
  components: {
    indexheader, asides
  },
  data () {
    return {
      data: [],
      userId: '',
      url: pic
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
  },
  methods: {
    skip () {
      this.$router.push({ path: '/mygame' })
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
