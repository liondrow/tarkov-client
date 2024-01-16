import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "@/views/LoginView.vue";
import MainView from "@/views/MainView.vue";
import WalletView from "@/views/WalletView.vue";
import InvoiceHistoryView from "@/views/InvoiceHistoryView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/main',
      name: 'main',
      component: MainView
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: WalletView
    },
    {
      path: '/history',
      name: 'history',
      component: InvoiceHistoryView
    },
  ]
})
router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router
