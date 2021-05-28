import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Profile from '../views/student/Profile.vue'
import Results from '../views/student/Results.vue'
import HomeStudent from '../views/student/StudentHome.vue'
import Quiz from '../views/student/Quiz.vue'
import QuizSubmit from "@/views/student/QuizSubmit";
import CreateQuiz from '../views/teacher/CreateQuiz.vue'
import HomeTeacher from '../views/teacher/TeacherHome.vue'
import TeachersQuizOverview from '../views/teacher/TeachersQuizOverview.vue';
import StudentOverview from '../views/teacher/StudentOverview.vue';
import StudentsQuizOverview from "@/views/student/StudentsQuizOverview.vue";
import RepetitionOverview from "@/views/student/RepetitionOverview.vue";
import LiveQuiz from "@/views/student/LiveQuiz";
import LiveQuizTeacher from "@/views/teacher/LiveQuizTeacher";

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
        path: '/student/profile',
        name: 'Profile',
        component: Profile,
        meta: {authorize: [Role.Student]},
        props: true
    },
    {
        path: '/student/results',
        name: 'Results',
        component: Results,
        meta: {authorize: [Role.Student]},
        props: true
    },
    {
        path: '/student/home',
        name: 'Home-student',
        component: HomeStudent,
        meta: {authorize: [Role.Student]},
        props: true
    },
    {
        path: '/student/quiz/:id?',
        name: 'Quiz',
        component: Quiz ,
        meta: {authorize: [Role.Student]},
        props: true
    },
    {
        path: '/student/single-result',
        name: 'QuizSubmit',
        component: QuizSubmit,
        meta: {authorize: [Role.Student]},
        props: true
    },
    {
        path: '/teacher/create/:id?',
        name: 'Create',
        component: CreateQuiz,
        meta: {authorize: [Role.Teacher]},
        props: true

    },
    {
        path: '/teacher/home',
        name: 'Home-Teacher',
        component: HomeTeacher,
        meta: {authorize: [Role.Teacher]},
        props: true
    },
    {
        path: '/teacher/quiz-overview/:id',
        name: 'TeachersQuizOverview',
        component: TeachersQuizOverview,
        meta: {authorize: [Role.Teacher]},
        props: true
    },
    {
        path: '/student/quiz-overview/:id',
        name: 'StudentQuizOverview',
        component: StudentsQuizOverview,
        meta: {authorize: [Role.Student]},
        props: true
    },
    {
        path: '/student-overview/:id',
        name: 'StudentOverview',
        component: StudentOverview,
        meta: {authorize: [Role.Teacher]},
        props: true
    },
    {
        path: '/student/repetition',
        name: 'Repetition',
        component: RepetitionOverview,
        meta: {authorize: [Role.Student]},
        props: true
    },
    {
        path: '/student/live',
        name: 'LiveQuiz',
        component: LiveQuiz,
        meta: {authorize: [Role.Student]},
        props: true
    },
    {
        path: '/teacher/live',
        nam: 'LiveQuizTeacher',
        component: LiveQuizTeacher,
        meta: {authorize: [Role.Teacher]},
        props: true
    }
];


const router = new VueRouter({
    routes
});

export default router;