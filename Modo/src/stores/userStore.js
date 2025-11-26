import { defineStore } from 'pinia'
import User from '../models/userModel'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: [],
    loggedUserId: null,
    nextId: 0,
  }),

  getters: {
    currentUser: (state) => state.users.find((u) => u.id === state.loggedUserId),
  },

  actions: {
    addUser(userData) {
      const newUser = new User({
        id: this.nextId,
        ...userData,
      })

      this.users.push(newUser)
      this.nextId += 1
    },

    loginByEmail(email, password) {
      const user = this.users.find((u) => u.email === email && u.password === password)
      if (!user) return false

      this.loggedUserId = user.id
      return true
    },

    logout() {
      this.loggedUserId = null
    },

    loadFromLocalStorage() {
      const storedUsers = localStorage.getItem('users')
      if (storedUsers) {
        this.users = JSON.parse(storedUsers)
        const maxId = this.users.reduce((max, u) => Math.max(max, Number(u.id)), -1)
        this.nextId = maxId + 1
      }
    },

    saveToLocalStorage() {
      localStorage.setItem('users', JSON.stringify(this.users))
    },
  },
})
