import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import LandingPageView from '../views/LandingPageView.vue'
import HabitManagerView from '../views/HabitManagerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPageView,
    },
    {
      path: '/signin',
      name: 'signin',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/habitsmanager',
      name: 'habitsmanager',
      component: HabitManagerView,
    },
  ],
})

export default router
