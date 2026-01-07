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

      <div class="navbar-center" v-if="!user">
        <a href="#" class="nav-link-custom">Case Studies</a>
        <a href="#" class="nav-link-custom">About</a>
        <a href="#" class="nav-link-custom">Information</a>
      </div>

      <div class="ms-auto d-flex align-items-center" v-if="user">
        <div class="navbar-center">
          <RouterLink
            to="/statistics"
            class="nav-link-custom me-3"
            title="Statistics"
            aria-label="Statistics"
          >
            <svg
              class="nav-icon"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
            >
              <rect x="3" y="12" width="3.8" height="8" rx="0.9" fill="currentColor" />
              <rect x="9.6" y="7.5" width="3.8" height="12.5" rx="0.9" fill="currentColor" />
              <rect x="16.2" y="3" width="3.8" height="17" rx="0.9" fill="currentColor" />
            </svg>
          </RouterLink>

          <RouterLink
            to="/settings"
            class="nav-link-custom me-3"
            title="Settings"
            aria-label="Settings"
          >
            <svg
              class="nav-icon"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
            >
              <path fill="currentColor" d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
              <path
                fill="currentColor"
                d="M19.4 13.3c.04.3.06.6.06.9s-.02.6-.06.9l2.1 1.6a.5.5 0 0 1 .11.66l-2 3.4a.5.5 0 0 1-.61.22l-2.5-1a7.2 7.2 0 0 1-1.6.9l-.4 2.7a.5.5 0 0 1-.5.42h-4a.5.5 0 0 1-.5-.42l-.4-2.7c-.56-.2-1.1-.5-1.6-.9l-2.5 1a.5.5 0 0 1-.61-.22l-2-3.4a.5.5 0 0 1 .11-.66l2.1-1.6c-.04-.3-.06-.6-.06-.9s.02-.6.06-.9L2.6 9.1a.5.5 0 0 1-.11-.66l2-3.4a.5.5 0 0 1 .61-.22l2.5 1c.5-.4 1.04-.7 1.6-.9l.4-2.7A.5.5 0 0 1 11.5 2h4a.5.5 0 0 1 .5.42l.4 2.7c.56.2 1.1.5 1.6.9l2.5-1a.5.5 0 0 1 .61.22l2 3.4a.5.5 0 0 1-.11.66l-2.1 1.6z"
              />
            </svg>
          </RouterLink>
        </div>
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

<style scoped>
.nav-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  color: #355d4c;
}
.nav-link-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}
.nav-link-custom:hover .nav-icon {
  color: #1f3d30;
}
</style>
<style src="../css/styles.css"></style>
