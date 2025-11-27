import { defineStore } from 'pinia'
import User from '../models/userModel'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: [],
    loggedUserId: null,
    nextId: 0,
  }),

  getters: {
    currentUser: (state) =>
      state.users.find((u) => u.id === state.loggedUserId),
  },

  actions: {
    addUser(userData) {
      const newUser = new User({
        id: this.nextId,
        ...userData,
      })

      this.users.push(newUser)
      this.nextId++
    },

    loginByEmail(email, password) {
      const user = this.users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      )

      if (!user) return false

      this.loggedUserId = user.id
      return true
    },

    logout() {
      this.loggedUserId = null
    },
  },


  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        key: "userStore",
      },
    ],
  },
})
