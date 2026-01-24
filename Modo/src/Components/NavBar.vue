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
            to="/habitsmanager"
            class="nav-link-custom me-3"
            title="Habits Manager"
            aria-label="Habits Manager"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="svg-icon" 
              style="width: 1.5em; height: 1.5em;vertical-align: middle;fill: currentColor;overflow: hidden;" 
              viewBox="0 0 1000 1000" version="1.1">
              <path d="M337.066667 430.933333l-59.733334 59.733334L469.333333 682.666667 896 256l-59.733333-59.733333-366.933334 366.933333-132.266666-132.266667zM810.666667 810.666667H213.333333V213.333333h426.666667V128H213.333333c-46.933333 0-85.333333 38.4-85.333333 85.333333v597.333334c0 46.933333 38.4 85.333333 85.333333 85.333333h597.333334c46.933333 0 85.333333-38.4 85.333333-85.333333v-341.333334h-85.333333v341.333334z"/>
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
            to="/statistics"
            class="nav-link-custom me-3"
            title="Statistics"
            aria-label="Statistics"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="svg-icon" 
              style="width: 1.5em; height: 1.5em;vertical-align: middle;fill: currentColor;overflow: hidden;" 
              viewBox="0 0 1000 1000" 
              version="1.1">
              <path d="M918.025138 862.417905l-811.443431 0c-23.205442 0-41.972623-18.789948-41.972623-41.971927l0-671.513994c0-23.180955 18.767181-41.959647 41.972623-41.959647 23.158368 0 41.972623 18.778692 41.972623 41.959647l0 531.617803 0 97.925287 769.470807 0c23.158368 0 41.973647 18.789948 41.973647 41.970904C959.997761 843.626933 941.182483 862.417905 918.025138 862.417905M820.072302 736.50417l-83.945247 0c-23.158368 0-41.972623-18.778692-41.972623-41.959647L694.154432 400.75843c0-23.193235 18.814255-41.970904 41.972623-41.970904l83.945247 0c23.206465 0 41.973647 18.778692 41.973647 41.970904l0 293.786093C862.044925 717.725478 843.278767 736.50417 820.072302 736.50417M582.242104 736.50417l-83.945247 0c-23.181905 0-41.973647-18.778692-41.973647-41.959647L456.32321 232.874815c0-23.180955 18.791742-41.970904 41.973647-41.970904l83.945247 0c23.180882 0 41.972623 18.789948 41.972623 41.970904l0 461.669708C624.214727 717.725478 605.424009 736.50417 582.242104 736.50417M344.411906 736.50417l-83.945247 0c-23.205442 0-41.972623-18.778692-41.972623-41.959647l0-83.941807c0-23.179932 18.767181-41.970904 41.972623-41.970904l83.945247 0c23.181905 0 41.973647 18.789948 41.973647 41.970904l0 83.941807C386.384529 717.725478 367.593811 736.50417 344.411906 736.50417"/>
            </svg>
            <!-- <svg
              class="nav-icon"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
            >
              <rect x="3" y="12" width="3.8" height="8" rx="0.9" fill="currentColor" />
              <rect x="9.6" y="7.5" width="3.8" height="12.5" rx="0.9" fill="currentColor" />
              <rect x="16.2" y="3" width="3.8" height="17" rx="0.9" fill="currentColor" />
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
              style="width: 1.5em; height: 1.5em;vertical-align: middle;fill: currentColor;overflow: hidden;" 
              viewBox="0 0 1000 1000" 
              version="1.1">
              <path d="M658.285714 512q0-60.571429-42.857143-103.428571t-103.428571-42.857143-103.428571 42.857143-42.857143 103.428571 42.857143 103.428571 103.428571 42.857143 103.428571-42.857143 42.857143-103.428571zm292.571429-62.285714l0 126.857143q0 6.857143-4.571429 13.142857t-11.428571 7.428571l-105.714286 16q-10.857143 30.857143-22.285714 52 20 28.571429 61.142857 78.857143 5.714286 6.857143 5.714286 14.285714t-5.142857 13.142857q-15.428571 21.142857-56.571429 61.714286t-53.714286 40.571429q-6.857143 0-14.857143-5.142857l-78.857143-61.714286q-25.142857 13.142857-52 21.714286-9.142857 77.714286-16.571429 106.285714-4 16-20.571429 16l-126.857143 0q-8 0-14-4.857143t-6.571429-12.285714l-16-105.142857q-28-9.142857-51.428571-21.142857l-80.571429 61.142857q-5.714286 5.142857-14.285714 5.142857-8 0-14.285714-6.285714-72-65.142857-94.285714-96-4-5.714286-4-13.142857 0-6.857143 4.571429-13.142857 8.571429-12 29.142857-38t30.857143-40.285714q-15.428571-28.571429-23.428571-56.571429l-104.571429-15.428571q-7.428571-1.142857-12-7.142857t-4.571429-13.428571l0-126.857143q0-6.857143 4.571429-13.142857t10.857143-7.428571l106.285714-16q8-26.285714 22.285714-52.571429-22.857143-32.571429-61.142857-78.857143-5.714286-6.857143-5.714286-13.714286 0-5.714286 5.142857-13.142857 14.857143-20.571429 56.285714-61.428571t54-40.857143q7.428571 0 14.857143 5.714286l78.857143 61.142857q25.142857-13.142857 52-21.714286 9.142857-77.714286 16.571429-106.285714 4-16 20.571429-16l126.857143 0q8 0 14 4.857143t6.571429 12.285714l16 105.142857q28 9.142857 51.428571 21.142857l81.142857-61.142857q5.142857-5.142857 13.714286-5.142857 7.428571 0 14.285714 5.714286 73.714286 68 94.285714 97.142857 4 4.571429 4 12.571429 0 6.857143-4.571429 13.142857-8.571429 12-29.142857 38t-30.857143 40.285714q14.857143 28.571429 23.428571 56l104.571429 16q7.428571 1.142857 12 7.142857t4.571429 13.428571z"/>
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
        <span class="me-3 fw-semibold">Points: {{ user.points }} </span>
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
