import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'

// 全局过滤器
Vue.filter('dateFmt', (input, formatString = 'YYYY-MM-DD') => {
  // es5函数参数设置默认值
  // const lastFormatString = formatString || ''
  /**
      * moment(input) 把时间字符串转成时间对象
      * format(formatString) 把时间对象，按照指定格式，格式化成符合条件的字符串
      */
  return moment(input).format(formatString)
})

Vue.prototype.$axios = axios
// Vue.prototype.$router = router
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)

Vue.config.productionTip = false

// axios 配置
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.baseURL = 'http://localhost:8215/'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (!sessionStorage.getItem('userId')) {
      next({
        path: '/us_login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
  if (to.meta.require) {
    if (!sessionStorage.getItem('adminName')) {
      next({
        path: '/ad_login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
