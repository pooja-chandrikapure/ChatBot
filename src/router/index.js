import { createRouter, createWebHistory } from 'vue-router'
import Login from "../views/Auth.vue";
import Dashboard from '../views/Dashboard/Dashboard.vue';
import Home from '../views/Dashboard/Home.vue';
import Chat from '../views/Dashboard/Chat.vue';
import MainLayout from '../views/Layout/Main-Layout.vue';
import Strategy from '../views/Dashboard/Strategy.vue';
import Your_strategy from '../views/Dashboard/Your_strategy.vue';
import Public_strategy from '../views/Dashboard/Public_strategy.vue';
import Your_strategyAdd from '../views/Dashboard/Your_strategyAdd.vue';
// import { useAuthStore } from '../stores/auth';
import ChatBox from '../views/Dashboard/ChatBox.vue';
import ChatList from '../views/Dashboard/ChatList.vue';
// import { authStore } from '../stores/auth';

// router.beforeEach((to, from, next) => {
//   const auth = useAuthStore()

//   if (to.meta.requiresAuth && !auth.isAuthenticated) {
//     next('/login')   // 🚫 not logged in → redirect
//   } else if (to.path === '/login' && auth.isAuthenticated) {
//     next('/')        // 🔁 already logged in → dashboard
//   } else {
//     next()
//   }
// })

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'MainLayout',
      component: MainLayout,
      meta: { requiresAuth: true },//protect
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: Dashboard,
          // beforeEnter: useProtected,
        },
        {
          path: 'home',
          name: 'Home',
          component: Home,
        },
        {
          path: 'chat',    
          name: 'Chat',
          component: Chat,
        },
        
        {
          path: 'your_strategy',
          name: 'Your_strategy',
          component: Your_strategy,
        },
        {
          path: 'public_strategy',
          name: 'Public_strategy',
          component: Public_strategy,
        },
      ],

    },
    {
        path: '/login',
        name: 'Auth',
        component: Login,
    },
    {
      path: '/your_strategy_add',
      name: 'Your_strategyAdd',
      component: Your_strategyAdd,
      meta: { requiresAuth: true },
    },
    
  ],
})

export default router;