<script setup>
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const userStore = useUserStore()
const router = useRouter()

const user = computed(() => userStore.currentUser)

const isAdmin = computed(() => user.value && user.value.priority === 2)

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
            to="/habitsmanager"
            class="nav-link-custom me-3"
            title="Habits Manager"
            aria-label="Habits Manager"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="nav-icon"
              style="
                width: 1.5em;
                height: 1.5em;
                vertical-align: middle;
                fill: currentColor;
                overflow: hidden;
              "
              viewBox="0 0 1000 1000"
              version="1.1"
            >
              <path
                d="M337.066667 430.933333l-59.733334 59.733334L469.333333 682.666667 896 256l-59.733333-59.733333-366.933334 366.933333-132.266666-132.266667zM810.666667 810.666667H213.333333V213.333333h426.666667V128H213.333333c-46.933333 0-85.333333 38.4-85.333333 85.333333v597.333334c0 46.933333 38.4 85.333333 85.333333 85.333333h597.333334c46.933333 0 85.333333-38.4 85.333333-85.333333v-341.333334h-85.333333v341.333334z"
              />
            </svg>
            <!-- <svg
              class="nav-icon"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
            >
              <path fill="currentColor" d="M9 16.2L4.8 12 3.4 13.4 9 19l12-12-1.4-1.4z" />
            </svg> -->
          </RouterLink>

          <RouterLink
            to="/settings"
            class="nav-link-custom me-3"
            title="Settings"
            aria-label="Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="nav-icon"
              style="
                width: 1.5em;
                height: 1.5em;
                vertical-align: middle;
                fill: currentColor;
                overflow: hidden;
              "
              viewBox="0 0 1000 1000"
              version="1.1"
            >
              <path
                d="M658.285714 512q0-60.571429-42.857143-103.428571t-103.428571-42.857143-103.428571 42.857143-42.857143 103.428571 42.857143 103.428571 103.428571 42.857143 103.428571-42.857143 42.857143-103.428571zm292.571429-62.285714l0 126.857143q0 6.857143-4.571429 13.142857t-11.428571 7.428571l-105.714286 16q-10.857143 30.857143-22.285714 52 20 28.571429 61.142857 78.857143 5.714286 6.857143 5.714286 14.285714t-5.142857 13.142857q-15.428571 21.142857-56.571429 61.714286t-53.714286 40.571429q-6.857143 0-14.857143-5.142857l-78.857143-61.714286q-25.142857 13.142857-52 21.714286-9.142857 77.714286-16.571429 106.285714-4 16-20.571429 16l-126.857143 0q-8 0-14-4.857143t-6.571429-12.285714l-16-105.142857q-28-9.142857-51.428571-21.142857l-80.571429 61.142857q-5.714286 5.142857-14.285714 5.142857-8 0-14.285714-6.285714-72-65.142857-94.285714-96-4-5.714286-4-13.142857 0-6.857143 4.571429-13.142857 8.571429-12 29.142857-38t30.857143-40.285714q-15.428571-28.571429-23.428571-56.571429l-104.571429-15.428571q-7.428571-1.142857-12-7.142857t-4.571429-13.428571l0-126.857143q0-6.857143 4.571429-13.142857t10.857143-7.428571l106.285714-16q8-26.285714 22.285714-52.571429-22.857143-32.571429-61.142857-78.857143-5.714286-6.857143-5.714286-13.714286 0-5.714286 5.142857-13.142857 14.857143-20.571429 56.285714-61.428571t54-40.857143q7.428571 0 14.857143 5.714286l78.857143 61.142857q25.142857-13.142857 52-21.714286 9.142857-77.714286 16.571429-106.285714 4-16 20.571429-16l126.857143 0q8 0 14 4.857143t6.571429 12.285714l16 105.142857q28 9.142857 51.428571 21.142857l81.142857-61.142857q5.142857-5.142857 13.714286-5.142857 7.428571 0 14.285714 5.714286 73.714286 68 94.285714 97.142857 4 4.571429 4 12.571429 0 6.857143-4.571429 13.142857-8.571429 12-29.142857 38t-30.857143 40.285714q14.857143 28.571429 23.428571 56l104.571429 16q7.428571 1.142857 12 7.142857t4.571429 13.428571z"
              />
            </svg>
          </RouterLink>

          <RouterLink
            v-if="isAdmin"
            class="nav-link-custom me-3"
            to="/adminpanel"
            data-title="Admin Panel"
            aria-label="Admin Panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="nav-icon"
              style="
                width: 1.5em;
                height: 1.5em;
                vertical-align: middle;
                fill: currentColor;
                overflow: hidden;
              "
              viewBox="0 0 24 24"
              role="img"
              aria-hidden="true"
            >
              <path
                d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 20.201 4.665 24 6 15.596 0 9.748l8.332-1.730z"
              />
            </svg>
          </RouterLink>
        </div>

        <span class="me-3 fw-semibold">{{ user.name }}</span>
        <img
          v-if="user.avatar"
          :src="user.avatar"
          alt="avatar"
          class="rounded-circle me-2"
          style="width: 40px; height: 40px; object-fit: cover"
        />
        <button class="fa logout-btn" @click="logout">&#xf08b;</button>
      </div>

      <div v-else class="ms-auto">
        <RouterLink class="login-btn" to="/login"> Login </RouterLink>
      </div>
    </nav>
  </div>
</template>

<style>
.nav-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  color: #355d4c;
  text-decoration: none;
}
.nav-link-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}
.nav-link-custom:hover .nav-icon,
.nav-link-custom:hover {
  color: #f19640;
}

/* Glass navbar */
.custom-navbar {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 6px 20px rgba(16, 24, 32, 0.08);
  backdrop-filter: blur(8px) saturate(120%);
  -webkit-backdrop-filter: blur(8px) saturate(120%);
  transition:
    background 0.2s ease,
    transform 0.12s ease;
}

.custom-navbar .nav-link-custom,
.custom-navbar .nav-icon {
  color: #355d4c;
  transition:
    color 0.16s ease,
    transform 0.12s ease;
}

.custom-navbar .nav-link-custom:hover,
.custom-navbar .nav-link-custom:focus {
  color: #f19640;
}

.custom-navbar .nav-link-custom:hover .nav-icon {
  color: #f19640;
  transform: translateY(-2px);
}

.custom-navbar {
  position: relative;
}

.navbar-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 8px;
  align-items: center;
  pointer-events: auto;
}

.logout-btn {
  color: brown;
  font-size: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* pra Safari */

  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  cursor: pointer;
  transition: all 0.3s ease;
}
.logout-btn:hover {
  color: #f19640;
  transform: translateY(-3px);
  background: rgba(241, 150, 64, 0.06);
}
.login-btn {
  color: #355d4c;
  padding: 8px 12px;
  border-radius: 8px;
  transition:
    color 0.16s ease,
    background 0.16s ease,
    transform 0.12s ease;
}
.login-btn:hover {
  color: #f19640;
  transform: translateY(-2px);
}
</style>
<style src="../css/styles.css"></style>
