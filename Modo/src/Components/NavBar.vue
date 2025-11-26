<script setup>
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const userStore = useUserStore()
const router = useRouter()

// Utilizador autenticado
const user = computed(() => userStore.currentUser)

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-3 shadow-sm">
    <a class="navbar-brand fw-bold" href="/">HabitTracker</a>

    <div class="ms-auto d-flex align-items-center" v-if="user">
      <!-- Avatar -->
      <img
        v-if="user.avatar"
        :src="user.avatar"
        alt="avatar"
        class="rounded-circle me-2"
        style="width: 40px; height: 40px; object-fit: cover"
      />

      <!-- Nome -->
      <span class="me-3 fw-semibold">{{ user.name }}</span>

      <!-- Botão de logout -->
      <button class="btn btn-outline-danger btn-sm" @click="logout">Logout</button>
    </div>

    <div v-else class="ms-auto">
      <RouterLink class="btn btn-primary btn-sm" to="/login">Login</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
</style>
