import SignUp from './components/SignUp.vue'
import loginComponent from './components/loginComponent.vue'
import UserAccount from './components/UserAccount.vue'

import MainComponent from './components/MainComponent.vue'


import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        name:'Main',
        component: MainComponent,
        path:'/',

    },
    {
        name:'UserAccount',
        component: UserAccount,
        path:'/account',

    },
    {
        name:'SignUp',
        component: SignUp,
        path:'/signup',
    },
    {
        name:'loginComponent',
        component: loginComponent,
        path:'/login',

    }

]

const router=createRouter({
    history:createWebHistory(),
    routes

});

export default router