<template>
  <div
    class="login-container"
    style="background: linear-gradient(113deg, #ededed 0.02%, #97dbb4 24.02%, #355d4c 100.02%)"
  >
    <div class="login-form">
      <div class="register-image">
        <a href="/"><img src="../images/M.png" alt="Register Image" class="register-img" /></a>
      </div>
      <p class="login-text">
        Log in to stay <span class="highlight2">on top</span> of your tasks and objectives.
      </p>

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
          style="text-decoration: none; font-family: Heebo; font-weight: bold; color: #f19640"
          >Sign Up</a
        >
      </p>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/userStore'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      userStore: null,
    }
  },
  created() {
    this.userStore = useUserStore()
    const storedUsers = localStorage.getItem('users')
    if (storedUsers && (!this.userStore.users || this.userStore.users.length === 0)) {
      try {
        this.userStore.users = JSON.parse(storedUsers)
      } catch {
        console.log('Failed to parse users from localStorage')
      }
    }

    this.userStore.fetchUsers().catch(() => {})
  },
  methods: {
    async loginUser() {
      if (!this.email || !this.password) {
        alert('Please fill in both email and password.')
        return
      }

      const ok = await this.userStore.loginByEmail(this.email, this.password)

      if (!ok) {
        alert('Invalid email or password.')
        return
      }

      this.$router.push('/habitsmanager')
    },
  },
}
</script>

<style lang="scss" scoped></style>
<style src="../css/styles.css"></style>
