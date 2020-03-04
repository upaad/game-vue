<template>
    <div class="chart">
        <div style="width:400px;height:400px;" ref="sortchart">
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      sort: [{
        value: '',
        name: ''
      }]
    }
  },
  mounted () {
    this.drawCharts()
    const timer = setInterval(() => {
    // 某些定时器操作
      this.drawCharts()
    }, 3000)
    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
    })
  },
  methods: {
    drawCharts () {
      var myChart = this.$echarts.init(this.$refs.sortchart)
      var option = ({
        title: {
          text: '游戏分类图',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
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
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, 0.1]
        },
        series: [
          {
            data: [],
            type: 'bar',
            barWidth: '40%'
          }
        ]
      })
      this.$axios.post('/game/getsort')
        .then((res) => {
          if (res) {
            var myArray = res.data
            var namedata = []
            var coundata = []
            for (var i = 0; i < myArray.length; i++) {
              namedata.push(myArray[i].sortName)
              coundata.push(myArray[i].sortCount)
            }
            option.xAxis.data = namedata
            option.series[0].data = coundata
            // console.log('x轴：' + namedata)
            // console.log('y轴：' + coundata)
          }
          myChart.setOption(option)
        })
        .catch((err) => { console.log('err', err); return err })
    }
  }
}
</script>

 <style></style>
