import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: { name: 'index' }, component: () => import('@/components/front/index.vue') },

  { path: '/home', name: 'home', component: Home },
  { path: '/about', name: 'about', component: () => import(/* webpackChunkName: "about" */ '../views/About.vue') },

  // 前台显示页面
  { path: '/us_login', name: 'us_login', component: () => import('@/components/login/us_login.vue') },
  { path: '/index', name: 'index', component: () => import('@/components/front/index.vue') },
  { path: '/selgame', name: 'selgame', component: () => import('@/components/front/selgame.vue') },
  { path: '/allgame', name: 'allgame', component: () => import('@/components/front/allgame.vue') },
  { path: '/community', name: 'community', component: () => import('@/components/front/community.vue') },
  { path: '/post', name: 'post', component: () => import('@/components/front/post.vue') },
  { path: '/insertpost', meta: { requireAuth: true }, name: 'insertpost', component: () => import('@/components/front/insertpost.vue') },
  { path: '/detailedgame', name: 'detailedgame', component: () => import('@/components/front/detailedgame.vue') },
  { path: '/mydata', meta: { requireAuth: true }, name: 'mydata', component: () => import('@/components/front/mydata.vue') },
  { path: '/othersdata', name: 'othersdata', component: () => import('@/components/front/othersdata.vue') },
  { path: '/mygame', meta: { requireAuth: true }, name: 'mygame', component: () => import('@/components/front/mygame.vue') },
  { path: '/myinfo', meta: { requireAuth: true }, name: 'myinfo', component: () => import('@/components/front/myinfo.vue') },
  { path: '/mysafe', meta: { requireAuth: true }, name: 'mysafe', component: () => import('@/components/front/mysafe.vue') },
  { path: '/updatepwd', meta: { requireAuth: true }, name: 'updatepwd', component: () => import('@/components/front/updatepwd.vue') },
  { path: '/updateemail', meta: { requireAuth: true }, name: 'updateemail', component: () => import('@/components/front/updateemail.vue') },
  { path: '/updatephone', meta: { requireAuth: true }, name: 'updatephone', component: () => import('@/components/front/updatephone.vue') },
  { path: '/bindemail', meta: { requireAuth: true }, name: 'bindemail', component: () => import('@/components/front/bindemail.vue') },
  { path: '/bindphone', meta: { requireAuth: true }, name: 'bindphone', component: () => import('@/components/front/bindphone.vue') },
  { path: '/shoppingCart', meta: { requireAuth: true }, name: 'shoppingCart', component: () => import('@/components/front/shoppingcart.vue') },
  { path: '/orderPay', meta: { requireAuth: true }, name: 'orderPay', component: () => import('@/components/front/orderPay.vue') },
  { path: '/pay', meta: { requireAuth: true }, name: 'pay', component: () => import('@/components/front/pay.vue') },
  { path: '/favorites', meta: { requireAuth: true }, name: 'favorites', component: () => import('@/components/front/favorites.vue') },
  { path: '/privatemsg', meta: { requireAuth: true }, name: 'privatemsg', component: () => import('@/components/front/privatemsg.vue') },

  // 管理员界面
  { path: '/ad_login', name: 'ad_login', component: () => import('@/components/login/ad_login.vue') },
  { path: '/ad_game', meta: { require: true }, name: 'ad_game', component: () => import('@/components/admin/ad_game.vue') },
  { path: '/ad_post', meta: { require: true }, name: 'ad_post', component: () => import('@/components/admin/ad_post.vue') },
  { path: '/ad_userinfo', meta: { require: true }, name: 'ad_userinfo', component: () => import('@/components/admin/ad_userinfo.vue') },
  { path: '/ad_comment', meta: { require: true }, name: 'ad_comment', component: () => import('@/components/admin/ad_comment.vue') },
  { path: '/ad_order', meta: { require: true }, name: 'ad_order', component: () => import('@/components/admin/ad_order.vue') },
  { path: '/add_game', meta: { require: true }, name: 'add_game', component: () => import('@/components/admin/add_game.vue') },
  { path: '/add_user', meta: { require: true }, name: 'add_user', component: () => import('@/components/admin/add_user.vue') },
  { path: '/add_post', meta: { require: true }, name: 'add_post', component: () => import('@/components/admin/add_post.vue') },
  { path: '/game_photo', meta: { require: true }, name: 'game_photo', component: () => import('@/components/admin/game_photo.vue') },
  { path: '/user_photo', meta: { require: true }, name: 'user_photo', component: () => import('@/components/admin/user_photo.vue') }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
