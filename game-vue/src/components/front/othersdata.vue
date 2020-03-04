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
                        <otherdetail v-bind:thisId="thisId"></otherdetail>
                    </div>
                </el-main>
                <asides v-if="this.userId"></asides>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import indexheader from '@/components/front/indexheader.vue'
import otherdetail from '@/components/front/otherdetail.vue'
import asides from '@/components/front/aside.vue'

export default {
  inject: ['reload'],
  components: {
    indexheader, otherdetail, asides
  },
  data () {
    return {
      userId: ''
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    this.getThisid()
    if (!this.thisId) {
      this.$message({ message: '用户不存在', type: 'error' })
      this.$router.push({ path: '/post' })
    }
  },
  methods: {
    getThisid () {
      if (this.$route.query) {
        this.thisId = this.$route.query.thisId
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

</style>
