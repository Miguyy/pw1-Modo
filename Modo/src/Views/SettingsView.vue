<template>
  <NavBar />
  <main class="page">
    <div class="page-title">
      <h2>SETTINGS</h2>
    </div>

    <section class="settings-card">
      <header class="profile-header">
        <div class="avatar" id="avatar" v-show="showAvatar">
          <img
            src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=400"
            alt="Profile"
          />
          <button class="card-button btn-avatar-edit" @click="openDecoration">✎</button>
          <img
            v-if="selectedDecoration"
            :src="selectedDecoration"
            class="avatar-decoration"
            alt=""
          />
        </div>

        <div class="swiper" id="avatar-decoration" v-show="!showAvatar">
          <div class="card-wrapper">
            <button class="card-button btn-avatar-exit" @click="closeDecoration">✕</button>
            <ul
              class="card-list swiper-wrapper" :style="{ transform: `translateX(-${currentIndex * slideWidth}px)` }"
            >
              <li
                v-for="item in decorations"
                :key="item.name"
                class="card-item swiper-slide"
              >
                <button class="card-button btn-avatar-check" @click="selectDecoration(item.src)">✓</button>
                <img :src="item.src" :alt="item.name" />
              </li>
            </ul>

            <button class="swiper-button-prev" @click="prevSlide">←</button>
            <button class="swiper-button-next" @click="nextSlide">→</button>
          </div>
        </div>
        
        <div class="profile-info">
          <h2>Welcome back, {{ user.name }}</h2>
          <p>{{user.email}}</p>
        </div>
        <button class="change-picture">Change picture</button>
      </header>

      <div class="settings-content">
        <aside class="sidebar">
          <div class="nav-item"><span>Notifications</span> →</div>
          <div class="nav-item"><span>Help</span> →</div>
          <div class="nav-item"><span>About</span> →</div>
          <div class="nav-item danger">Logout</div>
          <div class="nav-item danger">Delete account</div>
        </aside>

        <div class="form-section">
          <div class="field-group">
            <label>Name</label>
            <div class="row">
              <input type="text" value="Rui" />
              <input type="text" value="Rodrigues" />
            </div>
          </div>

          <div class="field-group">
            <label>Email address</label>
            <div class="inline">
              <input type="email" value="ruirodrigues@gmail.com" />
              <button class="btn-change">Change</button>
            </div>
          </div>

          <div class="field-group">
            <label>Password</label>
            <div class="inline">
              <input type="password" value="password" />
              <button class="btn-change">Change</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="footer-grid">
      <div>
        <p>The best tracker to change who you are.</p>
      </div>
      <div>
        <h4>Products</h4>
        <a href="#">iOS App</a>
        <a href="#">Android App</a>
        <a href="#">Web App</a>
        <a href="#">Updates</a>
      </div>
      <div>
        <h4>About</h4>
        <a href="#">Our Team</a>
        <a href="#">Our Mission</a>
      </div>
      <div>
        <h4>Legal</h4>
        <a href="#">Privacy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { computed } from 'vue'
import { ref } from 'vue'
import NavBar from '@/Components/NavBar.vue'

const userStore = useUserStore()
const user = computed(() => userStore.currentUser)

defineOptions({             // export default {
  name: 'SettingsView',     //  name: 'SettingsView',
})                          //}

// ESTADO
const showAvatar = ref(true)
const currentIndex = ref(0)
const slideWidth = 96

const selectedDecoration = ref(null)

// LISTA DE DECORAÇÕES
const decorations = [
  { name: 'solarSystem', src: '/src/images/avatar_decoration/solarSystem.png' },
  { name: 'garden', src: '/src/images/avatar_decoration/garden.png' },
  { name: 'olives', src: '/src/images/avatar_decoration/olives.png' },
  { name: 'cat', src: '/src/images/avatar_decoration/cat.png' },
  { name: 'summer', src: '/src/images/avatar_decoration/summer.png' },
  { name: 'zoo', src: '/src/images/avatar_decoration/zoo.png' }
]

// FUNÇÕES
const openDecoration = () => {
  showAvatar.value = false
}

const closeDecoration = () => {
  showAvatar.value = true
}

const nextSlide = () => {
  if (currentIndex.value < decorations.length - 1) {
    currentIndex.value++
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const selectDecoration = (src) => {
  selectedDecoration.value = src
  showAvatar.value = true
}
</script>

<style src="../css/styles.css"></style>
<style>
  :root {
      --bg: #f3f3f1;
      --green-dark: #3f5f4f;
      --green: #4f6f5f;
      --green-light: #dff3e4;
      --card: #466555;
      --text-light: #e9efe9;
      --text-muted: #b9c7bf;
      --danger: #b4554d;
      --radius: 18px;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: 'Heebo', sans-serif;
      background: var(--bg);
      color: #1e1e1e;
    }

    .page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px 80px;
    }


    /* Card */
    .settings-card {
      max-width: 1080px;
      margin: 0 auto 0 auto;
      background: var(--card);
      border-radius: var(--radius);
      padding: 24px;
      color: var(--text-light);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }

    /* Header */
    .profile-header {
      display: flex;
      gap: 20px;
      align-items: center;
      padding-bottom: 24px;
      border-bottom: 1px dashed rgba(255,255,255,0.25);
    }

    .avatar {
      position: relative;
      display: flex;
      width: 96px;
      height: 96px;
      flex-shrink: 0;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .profile-info h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 500;
    }

    .profile-info p {
      margin: 4px 0 0;
      font-size: 14px;
      color: var(--text-muted);
    }

    .change-picture {
      margin-left: auto;
      background: rgba(255,255,255,0.15);
      border: none;
      color: #fff;
      padding: 8px 14px;
      border-radius: 999px;
      cursor: pointer;
      font-size: 13px;
    }

    /* Content */
    .settings-content {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 24px;
      margin-top: 24px;
    }

    /* Sidebar */
    .sidebar {
      background: rgba(255,255,255,0.08);
      border-radius: 14px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .nav-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 14px;
      border-radius: 10px;
      background: rgba(255,255,255,0.12);
      cursor: pointer;
      font-size: 14px;
    }

    .nav-item span { opacity: 0.85; }

    .danger {
      background: var(--danger);
      color: #fff;
    }

    /* Form */
    .form-section {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .field-group {
      border-bottom: 1px dashed rgba(255,255,255,0.25);
      padding-bottom: 20px;
    }

    .field-group:last-child { border-bottom: none; }

    label {
      display: block;
      font-size: 13px;
      margin-bottom: 8px;
      color: var(--text-muted);
    }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    input {
      width: 100%;
      padding: 12px 14px;
      border-radius: 10px;
      border: none;
      outline: none;
      background: #e7efe9;
      font-size: 14px;
    }

    .inline {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .inline input { flex: 1; }

    .btn-change {
      padding: 10px 16px;
      border-radius: 999px;
      border: none;
      background: rgba(255,255,255,0.18);
      color: #fff;
      cursor: pointer;
      font-size: 13px;
    }

    /* Footer */
    footer {
      margin-top: 80px;
      padding: 40px 24px;
      background: var(--green-dark);
      color: var(--text-light);
    }

    .footer-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 24px;
    }

    footer p { font-size: 14px; opacity: 0.85; }

    footer h4 { margin-bottom: 10px; font-size: 14px; }

    footer a {
      display: block;
      font-size: 13px;
      color: var(--text-muted);
      text-decoration: none;
      margin-bottom: 6px;
    }

    @media (max-width: 900px) {
      .settings-content {
        grid-template-columns: 1fr;
      }
    }

    /* Changes */

    .page-title {
      width: 100%;
      max-width: 1080px;
      margin: 10px auto 50px auto;
      padding-top: 10px;
      border-top: 2px dotted #355D4C;
    }

    .page-title h2 {
      color: #355D4C;
      letter-spacing: 0.3em;
    }

    .swiper {
      display: flex;
      width: 96px;
      height: 96px;
      overflow: hidden;
    }

    .swiper img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .card-list img {
      width: 96px;
      height: 96px;
    }

    .card-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 0px;
    }

    .swiper-wrapper {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      list-style: none;
      padding: 0;
      margin: 0;
      transition: transform 0.3s ease;
    }

    .btn-avatar-exit {
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 2;
    }

    .btn-avatar-check {
      position: absolute;
      top: 0px;
      right: 0px;
      z-index: 2;
    }

    .swiper-button-prev {
      position: absolute;
      bottom: 0px;
      left: 0px;
      z-index: 2;
    }

    .swiper-button-next{
      position: absolute;
      bottom: 0px;
      right: 0px;
      z-index: 2;
    }

    .swiper-slide {
      width: 96px;
      height: 96px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .btn-avatar-edit {
      position: absolute;
      bottom: -10px;
      right: -10px;
      z-index: 2;
    }

    .avatar-decoration {
      position: absolute;
      inset: 0;
      pointer-events: none;
      transform: scale(1.3);
      transform-origin: center;
    }

</style>
