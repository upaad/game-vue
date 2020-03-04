<template>
    <div>
        <el-card class="asidebox">
            <el-aside width="200px">
                <el-menu router>
                        <h3 style="margin-left:-100px;">订单中心</h3>
                        <el-menu-item class="meauitem" index="/mydata">我的订单</el-menu-item>
                        <el-menu-item class="meauitem" index="/mygame">我的游戏</el-menu-item>
                        <h3 style="margin-left:-100px;">我的账号</h3>
                    <el-menu-item-group>
                        <el-menu-item class="meauitem" index="/myinfo">基本信息</el-menu-item>
                        <el-menu-item class="meauitem" index="/mysafe">账户安全</el-menu-item>
                    </el-menu-item-group>
                </el-menu>
            </el-aside>
        </el-card>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.asidebox{
    width: 200px;
    height: 400px;
    border-radius: 25px;
    margin-left: 400px;
}
.meauitem{
    margin-left:-30px;
}
</style>
