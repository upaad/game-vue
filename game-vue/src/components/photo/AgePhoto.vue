<template>
  <div class="chart">
      <div style="width:400px;height:400px;" ref="agechart">
      </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      year00: '',
      year90: '',
      year80: '',
      year70: '',
      year60: '',
      year50: '',
      unknow: ''
    }
  },
  mounted () {
    this.getData()
    const timer = setInterval(() => {
    // 某些定时器操作
      this.getData()
    }, 3000)
    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
    })
  },
  methods: {
    getData () {
      axios.post('/user/getage')
        .then((res) => {
          this.year00 = res.data.year00
          this.year90 = res.data.year90
          this.year80 = res.data.year80
          this.year70 = res.data.year70
          this.year60 = res.data.year60
          this.year50 = res.data.year50
          this.unknow = res.data.unknow
          // console.log(res.data)
          this.drawCharts()
        })
        .catch((err) => {
          this.$alert('发生了意料之外的错误', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
          console.log('err', err); return err
        })
    },
    drawCharts () {
      var myChart = this.$echarts.init(this.$refs.agechart)
      myChart.setOption({
        title: {
          text: '用户各年龄段比例',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: ['00后', '90后', '80后', '70后', '60后', '60之前', '未知']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel']
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        series: [
          {
            name: '所占人数和百分比',
            type: 'pie',
            radius: [30, 110],
            center: ['50%', '50%'],
            roseType: 'area',
            data: [
              { value: this.year00, name: '00后' },
              { value: this.year90, name: '90后' },
              { value: this.year80, name: '80后' },
              { value: this.year70, name: '70后' },
              { value: this.year60, name: '60后' },
              { value: this.year50, name: '60之前' },
              { value: this.unknow, name: '未知' }
            ]
          }
        ]
      })
    }
  }
}
</script>

 <style></style>
