import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Results from '../views/Results.vue'
import HomeStudent from '../views/Home-student.vue'
import Quiz from '../views/Quiz.vue'
import QuizSubmit from "@/views/QuizSubmit";
import CreateQuiz from '../views/Create-quiz.vue'
import HomeTeacher from '../views/Home-teacher.vue'
import Role from '../roles.js'

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
        meta: {authorize: [Role.Student]},
        props: true
    },
    {
        path: '/results',
        name: 'Results',
        component: Results,
        meta: {authorize: [Role.Student]},
        props: true
    },
    {
        path: '/home-student',
        name: 'Home-student',
        component: HomeStudent,
        meta: {authorize: [Role.Student]},
        props: true
    },
    {
        path: '/quiz/:id',
        name: 'Quiz',
        component: Quiz ,
        meta: {authorize: [Role.Student]},
        props: true
    },
    {
        path: '/single-result',
        name: 'QuizSubmit',
        component: QuizSubmit,
        meta: {authorize: [Role.Student]},
        props: true
    },
    {
        path: '/create',
        name: 'Create',
        component: CreateQuiz,
        meta: {authorize: [Role.Teacher]},
        props: true

    },
    {
        path: '/home-teacher',
        name: 'Home-Teacher',
        component: HomeTeacher,
        meta: {authorize: [Role.Teacher]},
        props: true
    }
];


const router = new VueRouter({
    routes
})

// eslint-disable-next-line no-unused-vars
// router.beforeEach((to, from, next) => {
//     next();
// });

export default router