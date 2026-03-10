import { createRouter, createWebHistory } from 'vue-router';
import Index from '../views/Index.vue';
import Login from '../views/Login.vue';

const routes = [
    { path: '/login', component: Login },
    { path: '/', component: Index },
    { path: '/stations', component: () => import('../views/Stations.vue') },
    { path: '/graphics', component: () => import('../views/Graphics.vue') },
    { path: '/alerts', component: () => import('../views/Alerts.vue') },
];

import { useAuthStore } from '../stores/auth';

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    if (to.path !== '/login' && !isAuthenticated) {
        next('/login');
    } else if (to.path === '/login' && isAuthenticated) {
        next('/stations'); // Redirect to dashboard if logged in
    } else {
        next();
    }
});

export default router;
