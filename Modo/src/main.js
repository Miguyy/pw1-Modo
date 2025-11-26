import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap"

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

import { useUserStore } from './stores/userStore'
const userStore = useUserStore()

userStore.loadFromLocalStorage()

app.use(router)

app.mount('#app')
