import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Results from '../views/Results.vue'
import HomeStudent from '../views/Home-student.vue'
import Quiz from '../views/Quiz.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        props: true
    },
    {
        path: '/profile',
        name: 'Profile',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: Profile,
        props: true
    },
    {
        path: '/results',
        name: 'Results',
        component: Results,
        props: true
    },
    {
        path: '/home-student',
        name: 'Home-student',
        component: HomeStudent,
        props: true
    },
    {
        path: '/quiz/:id',
        name: 'Quiz',
        component: Quiz ,
        props: true
    }

]

const router = new VueRouter({
    routes
})

export default router