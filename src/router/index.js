import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "@/views/LoginView.vue";
import MainView from "@/views/MainView.vue";
import WalletView from "@/views/WalletView.vue";
import InvoiceHistoryView from "@/views/InvoiceHistoryView.vue";
import QuestView from "@/views/QuestView.vue";
import FinishedQuestView from "@/views/FinishedQuestView.vue";
import MarketView from "@/views/MarketView.vue";
import ShelterView from "@/views/ShelterView.vue";
import PriceView from "@/views/PriceView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'main',
      component: MainView
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: WalletView
    },
    {
      path: '/price',
      name: 'price',
      component: PriceView
    },
    {
      path: '/history',
      name: 'history',
      component: InvoiceHistoryView
    },
    {
      path: '/quests',
      name: 'quests',
      component: QuestView
    },
    {
      path: '/finished_quests',
      name: 'finished_quests',
      component: FinishedQuestView
    },
    {
      path: '/market',
      name: 'market',
      component: MarketView
    },
    {
      path: '/shelter',
      name: 'shelter',
      component: ShelterView
    }
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
