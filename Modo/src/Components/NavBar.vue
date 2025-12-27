<script setup>
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const userStore = useUserStore()
const router = useRouter()

const user = computed(() => userStore.currentUser)

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="navbar-wrapper">
    <nav class="navbar navbar-expand-lg custom-navbar px-3">
      <a class="navbar-brand" href="/">
        <img src="../images/modoIcon.png" alt="Logo" class="navbar-logo" />
      </a>

      <div class="navbar-center">
        <a href="#" class="nav-link-custom">Case Studies</a>
        <a href="#" class="nav-link-custom">About</a>
        <a href="#" class="nav-link-custom">Information</a>
      </div>

      <div class="ms-auto d-flex align-items-center" v-if="user">
        <img
          v-if="user.avatar"
          :src="user.avatar"
          alt="avatar"
          class="rounded-circle me-2"
          style="width: 40px; height: 40px; object-fit: cover"
        />

        <span class="me-3 fw-semibold">{{ user.name }}</span>

        <button class="btn btn-outline-danger btn-sm" @click="logout">Logout</button>
      </div>

      <div v-else class="ms-auto">
        <RouterLink class="login-btn" to="/login"> Login </RouterLink>
      </div>
    </nav>
  </div>
</template>

<style scoped></style>
<style src="../css/styles.css"></style>
