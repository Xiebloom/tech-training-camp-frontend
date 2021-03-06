import Vue from 'vue'
import VueRouter from 'vue-router'
// import Header from '../components/header.vue'
import Home from '../views/home/Home.vue'
import Refence from '../components/Refence.vue'
import Files from '../components/files.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      { path: '/refence', component: Refence },
      { path: '/files', component: Files}
    ]
  },
  {
    // 重定向的使用
    path: '/header',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes
})

export default router
