import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "main",
        component: () => import('@/pages/MainPage.vue'),
    },
    {
        path: '/route/:id',
        name: 'RouteDetail',
        component: () => import('@/components/route-info.vue'),
    },
    {
        path: '*',
        name: 'NotFound',
        component: () => import('@/pages/NotFoundPage.vue'),
    }
]

const router = new VueRouter({
    mode: 'history',
    routes,
})



export default router;