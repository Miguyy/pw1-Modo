<template>
  <div class="register-container">
    <div class="register-form">
      <p class="register-text">Sign up to build better habits and achieve your objectives.</p>

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
          style="
            text-decoration: none;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: bold;
            color: #434343;
          "
          >Login</a
        >
      </p>
    </div>

    <div class="register-image"></div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

export default {
  name: 'RegisterView',
  setup() {
    const name = ref('')
    const email = ref('')
    const password = ref('')

    const userStore = useUserStore()
    const router = useRouter()

    const storedUsers = localStorage.getItem('users')
    if (storedUsers) {
      userStore.users = JSON.parse(storedUsers)
      const maxId = userStore.users.reduce((max, u) => Math.max(max, Number(u.id)), -1)
      userStore.nextId = maxId + 1
    }

    const registerUser = () => {
      if (!name.value || !email.value || !password.value) {
        alert('Please fill in all fields.')
        return
      }

      const passwordChar = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
      if (!passwordChar.test(password.value)) {
        alert(
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
        )
        return
      }

      if (userStore.users.some((user) => user.email === email.value)) {
        alert('Email is already registered.')
        return
      }

      userStore.addUser({
        name: name.value,
        email: email.value,
        password: password.value,
        avatar: null,
        points: 0,
        priority: 1,
      })

      localStorage.setItem('users', JSON.stringify(userStore.users))

      alert('User registered successfully!')

      name.value = ''
      email.value = ''
      password.value = ''

      router.push('/login')
    }

    return {
      name,
      email,
      password,
      registerUser,
    }
  },
}
</script>

<style lang="scss" scoped></style>
<style src="../css/styles.css"></style>
