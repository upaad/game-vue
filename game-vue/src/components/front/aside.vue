<template>
    <div class="box">
        <div class="aside">
            <div>
                <el-tooltip class="item" effect="light" content="前往购物车" placement="left">
                    <el-button class="cartbtn" @click="skipcart()" type="primary">
                        <i class="el-icon-shopping-cart-full"></i>
                    </el-button>
                </el-tooltip>
            </div>
            <div>
                <el-tooltip class="item" effect="light" content="前往收藏夹" placement="left">
                    <el-button class="collectionbtn" @click="skipfav()" type="primary">
                        <i class="el-icon-collection-tag"></i>
                    </el-button>
                </el-tooltip>
            </div>
            <div>
                <el-tooltip class="item" effect="light" content="前往消息" placement="left">
                    <el-button class="cartbtn" @click="skipmsg()" type="primary">
                        <i class="el-icon-chat-line-round"/>
                    </el-button>
                </el-tooltip>
            </div>
            <!-- <el-drawer
                title="消息"
                :visible.sync="drawer"
                :direction="direction"
                header-background="#EBEEF5">
                <hr/>
                <span>我来啦!</span>
            </el-drawer> -->
        </div>
    </div>
</template>

<script>
export default {
  inject: ['reload'],
  data () {
    return {
    //   drawer: false,
    //   direction: 'rtl',
      userId: ''
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
  },
  methods: {
    skipcart () {
      this.$router.push({ path: '/shoppingCart' })
    },
    skipfav () {
      this.$router.push({ path: '/favorites' })
    },
    skipmsg () {
      this.$router.push({ path: '/privatemsg' })
    }
  }
}
</script>

<style lang="less" scoped>
.box{
    height: 100%;
    overflow:auto;
    margin:0;
    margin-right: 20px;
}
.aside{
    position:fixed;
    *position:absolute;
    width: 30px;
    padding: 0px;
    margin: 0px;
    top:40%;
    height: auto;
    margin:0 auto;
}
.cartbtn{
    width: 25px;
    padding: 0px;
    margin: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 0px;
}
.collectionbtn{
    width: 25px;
    padding: 0px;
    margin: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 0px;
}
.message{
    width: 25px;
    padding: 0px;
    margin: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 0px;
}
</style>
