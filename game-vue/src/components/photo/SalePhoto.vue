<template>
    <div class="chart">
        <div style="width:800px;height:400px;" ref="salechart">
        </div>
    </div>
</template>
<script>
export default {
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
      var myChart = this.$echarts.init(this.$refs.salechart)
      var option = ({
        title: {
          text: '游戏销量前十图',
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
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: []
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
        series: [
          {
            data: [],
            type: 'bar',
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      this.$axios.post('/game/getsale')
        .then((res) => {
          if (res) {
            var myArray = res.data
            var xdata = []
            var ydata = []
            for (var i = 0; i < myArray.length; i++) {
              ydata.push(myArray[i].gameName)
              xdata.push(myArray[i].gameSale)
            }
            option.yAxis.data = ydata
            option.series[0].data = xdata
          }
          myChart.setOption(option)
        })
        .catch((err) => { console.log('err', err); return err })
    }
  }
}
</script>

 <style></style>
