<template>
  <el-container style="height: 960px; border: 1px solid #eee">
    <adbar></adbar>
    <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <adheader></adheader>
        </el-header>
        <el-main class="main">
            <el-row style="margin-left:100px;margin-top:200px;">
                <el-col :span="10">
                    <div style="width:400px;height:400px;">
                        <SortChart></SortChart>
                    </div>
                </el-col>
                <el-col :span="14">
                    <div style="width:800px;height:400px;">
                      <SaleChart></SaleChart>
                    </div>
                </el-col>
            </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import adbar from './admin_sidebar.vue'
import SortChart from '@/components/photo/SortPhoto.vue'
import SaleChart from '@/components//photo/SalePhoto.vue'
import adheader from './ad_header.vue'

// 性别图表

export default {
  components: {
    adbar, SortChart, SaleChart, adheader
  },
  data () {
    return {}
  }
}
</script>

<style>
.el-header {
  background-color: #7D7DFF;
  color: #333;
  line-height: 60px;
}

.main{
    text-align: center;
    margin:0px;
    padding:0px;
}

.el-row {
    margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}
</style>
