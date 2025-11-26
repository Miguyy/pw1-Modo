<template>
  <div class="login-container">
    <div class="login-form">
      <p class="login-text">Log in to stay on top of your tasks and objectives.</p>

      <input
        v-model="email"
        type="email"
        placeholder="Enter your email address"
        id="login-email-user"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Enter your password"
        id="login-password-user"
      />

      <button @click.prevent="loginUser">Login</button>

      <p class="login-register">
        Don't have an account?
        <a
          href="/signin"
          style="
            text-decoration: none;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: bold;
            color: #434343;
          "
          >Sign Up</a
        >
      </p>
    </div>

    <div class="login-image"></div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

export default {
  name: 'LoginView',
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()
    const userStore = useUserStore()

    const storedUsers = localStorage.getItem('users')
    if (storedUsers) {
      userStore.users = JSON.parse(storedUsers)
    }

    const loginUser = () => {
      if (!email.value || !password.value) {
        alert('Please fill in both email and password.')
        return
      }

      const user = userStore.users.find(
        (u) => u.email === email.value && u.password === password.value,
      )

      if (!user) {
        alert('Invalid email or password.')
        return
      }

      userStore.loggedUserId = user.id

      router.push('/habitsmanager')
    }

    return {
      email,
      password,
      loginUser,
    }
  },
}
</script>

<style lang="scss" scoped></style>
<style src="../css/styles.css"></style>
