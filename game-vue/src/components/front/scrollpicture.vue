<template>
  <el-carousel height="400px" :interval="5000" arrow="always">
    <el-carousel-item v-for="(img,index) in imglist" :key="index">
      <el-image :src="img.url"></el-image>
    </el-carousel-item>
  </el-carousel>
</template>
<script>
export default {
  data () {
    return {
      url: '',
      imglist: [
        { url: require('@/assets/img1.jpg') },
        { url: require('@/assets/img2.jpg') },
        { url: require('@/assets/img3.jpg') },
        { url: require('@/assets/img4.jpg') },
        { url: require('@/assets/img5.jpg') }
      ]
    }
  },
  methods: {
  }
}
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
