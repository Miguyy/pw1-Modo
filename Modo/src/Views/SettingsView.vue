<template>
  <NavBar />
  <main class="page">
    <div class="page-title">
      <h2>SETTINGS</h2>
    </div>

    <section v-if="user" class="settings-card">
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
            <img
            src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=400"
            alt="Profile"
            />
          </div>
        </div>

        <div class="profile-info">
          <h2>Welcome back, {{ user.name }}</h2>
          <p>{{user.email}}</p>
        </div>
        <button class="change-picture" @click="promptAvatar">Change picture</button>
      </header>

      <div class="settings-content">
        <aside class="sidebar">
          <div class="nav-item" id="notification-btn"><span>Notifications</span> →</div>
          <div class="nav-item" id="help-btn"><span>Help</span> →</div>
          <div class="nav-item" id="about-btn"><span>About</span> →</div>
          <div class="nav-item danger" id="logout-btn">Logout</div>
          <div class="nav-item danger" id="delete-btn">Delete account</div>
        </aside>

        <div class="form-section">
          <div class="field-group">
            <label>Name</label>
            <div class="inline">
              <input 
                type="text" 
                v-model="userName"
                :readonly="!isEditingName"
                :style="{ opacity: isEditingName ? 1 : 0.5 }"
              />
              <button 
                id="toggle-name" 
                type="button" 
                class="btn-change change-name" 
                @click="toggleEditName"
              >
                {{ isEditingName ? 'Ok' : 'Change' }}
              </button>
            </div>
          </div>

          <div class="field-group">
            <label><FontAwesomeIcon icon="envelope" /> Email address</label>
            <div class="inline">
              <input 
                id="change-email" 
                type="email" 
                v-model="userEmail" 
                :readonly="!isEditingEmail" 
                :style="{ opacity: isEditingEmail ? 1 : 0.5 }"
              />

              <button 
                id="toggle-email" 
                type="button" 
                class="btn-change change-email" 
                @click="toggleEditEmail"
              >
                {{ isEditingEmail ? 'Ok' : 'Change' }}
              </button>
            </div>
          </div>

          <div class="field-group">
            <label><FontAwesomeIcon icon="lock" /> Password</label>
            <div class="inline">
              <input 
                :type="isEditingPassword ? 'text' : 'password'" 
                v-model="userPassword"
                :readonly="!isEditingPassword"
                :style="{ opacity: isEditingPassword ? 1 : 0.5 }"
              />
              <button 
                id="toggle-password" 
                type="button" 
                class="btn-change change-password" 
                @click="toggleEditPassword"
              >
                {{ isEditingPassword ? 'Ok' : 'Change' }}
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-primary" @click="saveChanges">Save changes</button>
          </div>
        </div>

        <div class="form-section" id="notification-section" hidden>
          <div class="notification-card" id="notification">
            <h3 class="notification-title">Wellcome to MODO!</h3>
            <p class="notification-content">
              🎉 Welcome aboard, {{userName}}! We're thrilled to have you in MODO with us.
            </p>
            <button class="clear-notification-btn" id="clear-notification">Clear</button>
          </div>
        </div>

        <div class="form-section" id="help-section" hidden>

        </div>

        <div class="form-section" id="about-section" hidden>
          <h3>What about MODO?</h3>
          <p>
            MODO is a minimalist and powerful habit tracker built to help you take control of your daily routine. Whether you're trying to develop healthier habits, stay focused on personal goals, or simply bring more structure to your day, MODO keeps you on track with clarity and ease.
            Designed with simplicity in mind, MODO lets you create habits, track your progress, and celebrate your streaks—all in a clean, distraction-free interface. Smart reminders and visual insights help you stay motivated, showing you how small, consistent actions lead to meaningful change.
            MODO isn't just about checking off tasks. It's about building momentum, staying intentional, and becoming the best version of yourself, one habit at a time.
            Live with purpose. Grow with consistency. Move with MODO.
          </p>
        </div>
      </div>
    </section>

    <section v-else class="settings-card">
      <p>Please log in to access your settings.</p>
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
import { computed, ref } from 'vue'
import NavBar from '@/Components/NavBar.vue'

defineOptions({
  name: 'SettingsView',
})

const userStore = useUserStore()
const user = computed(() => userStore.currentUser)

// name
const isEditingName = ref(false)
const userName = ref(user.value?.name || '')

const toggleEditName = () => {
  if (isEditingName.value) {
    if (userName.value !== user.value.name) {
      
      // Verifica se já existe o nome para outro utilizador
      const nameExists = userStore.users.find(u => 
        u.name === userName.value && u.id !== user.value.id
      )

      if (nameExists) {
        alert(`O nome "${userName.value}" já está a ser utilizado por outro utilizador!`)
        return
      }
      
      // Se não existe, atualiza
      user.value.name = userName.value
    }

    isEditingName.value = false
  } else {
    userName.value = user.value.name
    isEditingName.value = true
  }
}

// email
const isEditingEmail = ref(false)
const userEmail = ref(user.value?.email || '') 

const toggleEditEmail = () => {
  if (isEditingEmail.value) {
    if (userEmail.value !== user.value.email) {

      // Verifica se já existe o email para outro utilizador
      const emailExists = userStore.users.find(u => 
        u.email === userEmail.value && u.id !== user.value.id
      )

      if (emailExists) {
        alert(`O email "${userEmail.value}" já está registado!`)
        return
      }

      // Se não existe, atualiza
      user.value.email = userEmail.value
    }
    
    isEditingEmail.value = false
    console.log('Email atualizado com sucesso.')
  } else {
    userEmail.value = user.value.email
    isEditingEmail.value = true
  }
}

// password
const isEditingPassword = ref(false)
const userPassword = ref(user.value?.password || '********') // Valor inicial ou da store

const toggleEditPassword = () => {
  if (isEditingPassword.value) {
    
    if (user.value) user.value.password = userPassword.value
    isEditingPassword.value = false
  } else {
    // Ao clicar em change, garante que o rascunho tem a senha atual
    userPassword.value = user.value?.password || ''
    isEditingPassword.value = true
  }
}

// avatar
const showAvatar = ref(true)
const currentIndex = ref(0)
const slideWidth = 96
const selectedDecoration = ref(null)

const decorations = [
  { name: 'solarSystem', src: '/src/images/avatar_decoration/solarSystem.png' },
  { name: 'garden', src: '/src/images/avatar_decoration/garden.png' },
  { name: 'olives', src: '/src/images/avatar_decoration/olives.png' },
  { name: 'cat', src: '/src/images/avatar_decoration/cat.png' },
  { name: 'summer', src: '/src/images/avatar_decoration/summer.png' },
  { name: 'zoo', src: '/src/images/avatar_decoration/zoo.png' }
]

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
      transition: transform 0.3s ease;
    }

    .avatar:hover {
      transform: scale(1.05);
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
      transition: all 0.3s ease;
    }

    .change-picture:hover {
      background: rgba(255,255,255,0.25);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
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
      transition: all 0.3s ease;
      gap: 10px;
    }

    .nav-item svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .nav-item:hover {
      background: rgba(255,255,255,0.18);
      transform: translateX(4px);
    }

    .nav-item span { opacity: 0.85; }

    .danger {
      background: var(--danger);
      color: #fff;
    }

    /* Form */
    .form-section {
      right: 0px;
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
      display: flex;
      align-items: center;
      gap: 6px;
    }

    label svg {
      font-size: 14px;
    }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      width: 100%;
    }

    .row input {
      min-width: 0;
    }

    input {
      width: 100%;
      padding: 12px 14px;
      border-radius: 10px;
      border: none;
      outline: none;
      background: #e7efe9;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    input:hover {
      background: #f5f9f7;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    input:focus {
      background: #fff;
      box-shadow: 0 0 0 3px rgba(79, 111, 95, 0.1);
    }

    .inline {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .inline input {
      flex: 1;
      max-width: 650px;
    }

    .btn-change {
      padding: 10px 16px;
      border-radius: 999px;
      border: none;
      background: rgba(255,255,255,0.18);
      color: #fff;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .btn-change:hover {
      background: rgba(255,255,255,0.28);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .btn-change:active {
      transform: translateY(0);
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
      transition: all 0.3s ease;
    }

    footer a:hover {
      color: var(--text-light);
      transform: translateX(4px);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
    }

    .btn-primary {
      padding: 12px 18px;
      border: none;
      border-radius: 999px;
      background: #2f4f40;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .btn-primary:hover {
      background: #1f3f30;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }

    .btn-primary:active {
      transform: translateY(0);
    }

    @media (max-width: 900px) {
      .settings-content {
        grid-template-columns: 1fr;
      }

      .row {
        grid-template-columns: 1fr 1fr;
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
      color: #fff;

      border-radius: 50%;

      /* estilo glass */
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px); /* pra Safari */

      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);

      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-avatar-exit:hover {
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0 6px 10px rgba(0,0,0,0.15);
    }

    .btn-avatar-check {
      position: absolute;
      top: 0px;
      right: 0px;
      z-index: 2;
      color: #fff;

      border-radius: 50%;

      /* estilo glass */
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px); /* pra Safari */

      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);

      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-avatar-check:hover {
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0 6px 10px rgba(0,0,0,0.15);
    }

    .swiper-button-prev {
      position: absolute;
      bottom: 0px;
      left: 0px;
      z-index: 2;
      color: #fff;

      border-radius: 50%;

      /* estilo glass */
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px); /* pra Safari */

      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);

      cursor: pointer;
      transition: all 0.3s ease;
    }

    .swiper-button-prev:hover {
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0 6px 10px rgba(0,0,0,0.15);
    }

    .swiper-button-next{
      position: absolute;
      bottom: 0px;
      right: 0px;
      z-index: 2;
      color: #fff;

      border-radius: 50%;

      /* estilo glass */
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px); /* pra Safari */

      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);

      cursor: pointer;
      transition: all 0.3s ease;
    }

    .swiper-button-next:hover {
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0 6px 10px rgba(0,0,0,0.15);
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
      color: #fff;

      border-radius: 50%;

      /* estilo glass */
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px); /* pra Safari */

      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);

      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-avatar-edit:hover {
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0 6px 10px rgba(0,0,0,0.15);
      transform: scale(1.1);
    }

    .avatar-decoration {
      position: absolute;
      inset: 0;
      pointer-events: none;
      transform: scale(1.3);
      transform-origin: center;
    }

    .notification-card{
      width: 100%;
      height: 80px;
      padding: 10px 15px 10px 15px;
      position: relative;
      border: 1px solid var(--green);
      border-radius: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .notification-card h3 {
      font-size: 20px;
      transition: all 0.4s ease;
      cursor: pointer;
    }

    .notification-card h3:hover {
      transform: scale(1.1);
    }

    .clear-notification-btn {
      width: 50px;
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 2;
      color: #fff;

      border-radius: 10px;

      /* estilo glass */
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px); /* pra Safari */

      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);

      cursor: pointer;
      transition: all 0.3s ease;
    }

    .clear-notification-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0 6px 10px rgba(0,0,0,0.15);
      transform: scale(1.1);
    }

</style>
