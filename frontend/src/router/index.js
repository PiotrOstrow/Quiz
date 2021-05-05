import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/profile',
    name: 'Profile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Profile.vue')
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import(/* webpackChunkName: "about" */ '../views/Results.vue')
},
  { path: '/quiz',
    name: 'Quiz',
    component: () => import(/* webpackChunkName: "about" */ '../views/Quiz.vue')
}

]

const router = new VueRouter({
  routes
})

export default router
