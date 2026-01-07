import { defineStore } from 'pinia'
import User from '../models/userModel'
import { usersList, createUser as apiCreateUser } from '../api/modoApi'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: [],
    loggedUserId: null,
    nextId: 0,
  }),

  getters: {
    /* currentUser: (state) => state.users.find((u) => u.id === state.loggedUserId), */
    currentUser: (state) => state.users.find((u) => String(u.id) === String(state.loggedUserId)),
  },

  actions: {
    async fetchUsers() {
      try {
        const res = await usersList()
        this.users = res.map((u) => new User(u))
        const numericIds = this.users.map((u) => Number(u.id)).filter((n) => !Number.isNaN(n))
        this.nextId = numericIds.length ? Math.max(...numericIds) + 1 : 0
        this.saveToLocalStorage()
      } catch (e) {
        console.warn('Failed to fetch users from API, keeping local data:', e)
      }
    },

    saveToLocalStorage() {
      const serial = JSON.stringify(this.users.map((u) => (u.toJSON ? u.toJSON() : u)))
      localStorage.setItem('users', serial)
    },

    loadFromLocalStorage() {
      const raw = localStorage.getItem('users')
      if (!raw) return
      try {
        const arr = JSON.parse(raw)
        this.users = arr.map((u) => new User(u))
        const numericIds = this.users.map((u) => Number(u.id)).filter((n) => !Number.isNaN(n))
        this.nextId = numericIds.length ? Math.max(...numericIds) + 1 : this.nextId
      } catch (e) {
        console.warn('Failed to load users from localStorage', e)
      }
      const storedLogged = localStorage.getItem('loggedUserId')
      if (storedLogged != null) {
        this.loggedUserId = storedLogged
      }
    },

    async addUser(userData) {
      try {
        const payload = {
          ...userData,
          createdAt: new Date().toISOString(),
          points: userData.points ?? 0,
          priority: userData.priority ?? 1,
          habits: userData.habits ?? [],
        }
        const created = await apiCreateUser(payload)
        const newUser = new User(created)
        this.users.push(newUser)
        const idNum = Number(created.id)
        if (!Number.isNaN(idNum)) this.nextId = Math.max(this.nextId, idNum + 1)
        this.saveToLocalStorage()
        return newUser
      } catch (e) {
        console.warn('API create failed, falling back to local add:', e)
        const newUser = new User({
          id: this.nextId,
          ...userData,
          createdAt: new Date().toISOString(),
          habits: userData.habits ?? [],
        })
        this.users.push(newUser)
        this.nextId++
        this.saveToLocalStorage()
        return newUser
      }
    },

    async loginByEmail(email, password) {
      try {
        await this.fetchUsers()
      } catch (e) {
        console.warn('fetchUsers failed', e)
      }

      if (!this.users || this.users.length === 0) {
        const stored = localStorage.getItem('users')
        if (stored) {
          try {
            this.users = JSON.parse(stored).map((u) => new User(u))
          } catch (e) {
            console.warn('Failed to parse users from localStorage', e)
          }
        }
      }

      const user = this.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
      )

      if (!user) return false

      this.loggedUserId = user.id
      localStorage.setItem('loggedUserId', String(this.loggedUserId))
      return true
    },

    getUserById(id) {
      return this.users.find((u) => String(u.id) === String(id))
    },

    logout() {
      this.loggedUserId = null
      localStorage.removeItem('loggedUserId')
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        key: 'userStore',
      },
    ],
  },
})
