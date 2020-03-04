<template>
    <div class="chart">
        <div style="width:400px;height:400px;" ref="sexchart">
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      man: '',
      woman: '',
      undefine: ''
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
      axios.post('/user/getsex')
        .then((res) => {
          this.man = res.data.man
          this.woman = res.data.woman
          this.undefine = res.data.undefine
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
      var myChart = this.$echarts.init(this.$refs.sexchart)
      myChart.setOption({
        title: {
          text: '男女比例图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: ['男', '女', '未知']
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
            name: '所占人数和百分比',
            type: 'pie',
            radius: '65',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [
              { value: this.man, name: '男' },
              { value: this.woman, name: '女' },
              { value: this.undefine, name: '未知' }
            ],
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
    }
  }
}
</script>

 <style></style>
