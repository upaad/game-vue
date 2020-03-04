<template>
    <div>
        <span style="font-size:16px;">{{adminName}} </span>
        <el-button style="color:red;" v-if="adminName" @click="out()" type="text">| 退出</el-button>
        <el-button style="color:red;" v-if="!adminName" @click="out()" type="text">登陆</el-button>
    </div>
</template>

<script>
export default {
  data () {
    return {
      adminName: ''
    }
  },
  created () {
    this.adminName = sessionStorage.getItem('adminName')
  },
  methods: {
    out () {
      this.$router.push({ path: '/ad_login' })
      sessionStorage.removeItem('adminName')
    }
  }
}
</script>
