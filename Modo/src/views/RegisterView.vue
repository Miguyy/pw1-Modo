<template>
  <div
    class="register-container"
    style="background: linear-gradient(113deg, #ededed 0.02%, #97dbb4 24.02%, #355d4c 100.02%)"
  >
    <div class="register-form">
      <div class="register-image">
        <a href="/"><img src="../images/M.png" alt="Register Image" class="register-img" /></a>
      </div>
      <p class="register-text">
        Sign up to build <span class="highlight2">better</span> habits and
        <span class="highlight2">achieve</span> your objectives.
      </p>

      <input v-model="name" type="text" placeholder="Enter your username" id="reg-name-user" />
      <input
        v-model="email"
        type="email"
        placeholder="Enter your email address"
        id="reg-email-user"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Enter your password"
        id="reg-password-user"
      />

      <button @click="registerUser">Sign Up</button>

      <p class="register-login">
        Already have an account?
        <a
          href="/login"
          style="text-decoration: none; font-family: Heebo; font-weight: bold; color: #f19640"
          >Login</a
        >
      </p>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/userStore'

export default {
  name: 'RegisterView',
  data() {
    return {
      name: '',
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
        const maxId = this.userStore.users.reduce((max, u) => Math.max(max, Number(u.id)), -1)
        this.userStore.nextId = maxId + 1
      } catch {
        console.log('Failed to parse users from localStorage')
      }
    }

    this.userStore.fetchUsers().catch(() => {})
  },
  methods: {
    async registerUser() {
      if (!this.name || !this.email || !this.password) {
        alert('Please fill in all fields.')
        return
      }

      const passwordChar = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
      if (!passwordChar.test(this.password)) {
        alert(
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
        )
        return
      }

      if (this.userStore.users.some((user) => user.email === this.email)) {
        alert('Email is already registered.')
        return
      }

      try {
        await this.userStore.addUser({
          name: this.name,
          email: this.email,
          password: this.password,
          avatar: null,
          points: 0,
          priority: 1,
        })

        localStorage.setItem('users', JSON.stringify(this.userStore.users))

        alert('User registered successfully!')
        this.name = ''
        this.email = ''
        this.password = ''
        this.$router.push('/login')
      } catch (e) {
        console.error(e)
        alert('Failed to register user.')
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
<style src="../css/styles.css"></style>
