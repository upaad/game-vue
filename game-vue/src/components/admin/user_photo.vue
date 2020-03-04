<template>
  <el-container style="height: 960px; border: 1px solid #eee">
    <adbar></adbar>
    <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <adheader></adheader>
        </el-header>
        <el-main class="main">
            <el-row style="margin-left:100px;margin-top:200px;">
                <el-col :span="12">
                    <div style="width:400px;height:400px;">
                        <SexChart></SexChart>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div style="width:400px;height:400px;">
                        <AgeChart></AgeChart>
                    </div>
                </el-col>
            </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import adbar from './admin_sidebar.vue'
import SexChart from '@/components//photo/SexPhoto'
import AgeChart from '@/components//photo/AgePhoto'
import adheader from './ad_header.vue'

export default {
  components: {
    adbar, SexChart, AgeChart, adheader
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
