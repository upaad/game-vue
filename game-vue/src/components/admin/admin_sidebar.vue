<template>
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1','2','3']"
      router>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-s-goods"></i>商品管理
          </template>
          <el-menu-item-group>
            <el-menu-item index="/ad_game">商品列表</el-menu-item>
            <el-menu-item index="/add_game">添加商品</el-menu-item>
            <el-menu-item index="/game_photo">图表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-order"></i>其他管理
          </template>
          <el-menu-item-group>
            <el-menu-item index="/ad_post">帖子列表</el-menu-item>
            <el-menu-item index="/ad_comment">评论列表</el-menu-item>
            <el-menu-item index="/ad_order">订单列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-s-custom"></i>用户管理
          </template>
          <el-menu-item-group>
            <el-menu-item index="/ad_userinfo">用户列表</el-menu-item>
            <el-menu-item index="/add_user">添加用户</el-menu-item>
            <el-menu-item index="/user_photo">图表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
</template>

<script>
export default {

}
</script>

<style>
.el-aside {
  color: #333;
}

.item {
  text-align: center;
  padding-top: 100px;
  font-size: 50px;
  color: #00ffff;
}
</style>
