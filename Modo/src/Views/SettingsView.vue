<template>
  <NavBar />
  <main class="page">
    <h1>SETTINGS</h1>

    <section v-if="currentUser" class="settings-card">
      <header class="profile-header">
        <div class="avatar">
          <img :src="avatarPreview" alt="Profile" />
          <h2>{{ firstName || 'friend' }}!</h2>
        </div>
        <div class="profile-info">
        </div>
        <button class="change-picture" @click="promptAvatar">Change picture</button>
      </header>

      <div class="settings-content">
        <aside class="sidebar">
          <div class="nav-item"><FontAwesomeIcon icon="bell" /> <span>Notifications</span> <FontAwesomeIcon icon="arrow-right" /></div>
          <div class="nav-item"><FontAwesomeIcon icon="question-circle" /> <span>Help</span> <FontAwesomeIcon icon="arrow-right" /></div>
          <div class="nav-item"><FontAwesomeIcon icon="info-circle" /> <span>About</span> <FontAwesomeIcon icon="arrow-right" /></div>
          <div class="nav-item danger" @click="handleLogout"> <span>Logout</span> <FontAwesomeIcon icon="sign-out-alt" /> </div>
          <div class="nav-item danger" @click="handleDelete"> <span>Delete account</span> <FontAwesomeIcon icon="trash" /></div>
        </aside>

        <div class="form-section">
          <div class="field-group">
            <label><FontAwesomeIcon icon="user" /> Name</label>
            <div class="inline">
              <input v-model="firstName" type="text" placeholder="First name" />
              <input v-model="lastName" type="text" placeholder="Last name" />
            </div>
          </div>

          <div class="field-group">
            <label><FontAwesomeIcon icon="envelope" /> Email address</label>
            <div class="inline">
              <input v-model="email" type="email" placeholder="Your email" />
              <button class="btn-change" @click="saveChanges">Save</button>
            </div>
          </div>

          <div class="field-group">
            <label><FontAwesomeIcon icon="lock" /> Password</label>
            <div class="inline">
              <input
                v-model="currentPassword"
                type="password"
                placeholder="Current password"
              />
              <input v-model="newPassword" type="password" placeholder="New password" />
              <button class="btn-change" @click="saveChanges">Update</button>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-primary" @click="saveChanges">Save changes</button>
          </div>
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
<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import NavBar from '../Components/NavBar.vue'
import { useUserStore } from '../stores/userStore'

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=400'

export default {
  name: 'SettingsView',
  components: {
    NavBar,
  },
  data() {
    return {
      userStore: null,
      firstName: '',
      lastName: '',
      email: '',
      avatar: '',
      currentPassword: '',
      newPassword: '',
    }
  },
  computed: {
    currentUser() {
      return this.userStore?.currentUser
    },
    avatarPreview() {
      return this.avatar || this.currentUser?.avatar || DEFAULT_AVATAR
    },
  },
  watch: {
    currentUser(newVal) {
      if (newVal) this.populateForm(newVal)
    },
  },
  created() {
    this.userStore = useUserStore()
    this.bootstrapUser()
  },
  methods: {
    async bootstrapUser() {
      // First, restore the logged-in user ID from localStorage
      const storedLoggedId = localStorage.getItem('loggedUserId')
      if (storedLoggedId) {
        this.userStore.loggedUserId = storedLoggedId
      }

      // Then load users from localStorage
      this.userStore.loadFromLocalStorage()

      // If we have a logged-in user, populate the form
      if (this.userStore.currentUser) {
        this.populateForm(this.userStore.currentUser)
      } else {
        // Try fetching from API as backup
        await this.userStore.fetchUsers().catch(() => {})
        
        if (this.userStore.currentUser) {
          this.populateForm(this.userStore.currentUser)
        } else {
          // No user found, redirect to login
          this.$router.push('/login')
        }
      }
    },

    populateForm(user) {
      const parts = (user.name || '').split(' ')
      this.firstName = parts.shift() || ''
      this.lastName = parts.join(' ')
      this.email = user.email || ''
      this.avatar = user.avatar || ''
    },

    async saveChanges() {
      if (!this.firstName || !this.email) {
        alert('Please fill in your name and email.')
        return
      }

      const fullName = `${this.firstName} ${this.lastName}`.trim()
      const updates = { name: fullName, email: this.email, avatar: this.avatar || null }

      if (this.newPassword) {
        if (!this.currentPassword) {
          alert('Enter your current password to change it.')
          return
        }
        if (this.currentPassword !== (this.currentUser?.password || '')) {
          alert('Current password is incorrect.')
          return
        }
        if (this.newPassword.length < 8) {
          alert('New password must be at least 8 characters long.')
          return
        }
        updates.password = this.newPassword
      }

      try {
        await this.userStore.updateUserProfile(updates)
        this.currentPassword = ''
        this.newPassword = ''
        alert('Profile updated successfully.')
      } catch (e) {
        console.error(e)
        alert('Failed to update profile.')
      }
    },

    promptAvatar() {
      const url = prompt('Paste an image URL for your avatar', this.avatar || this.avatarPreview)
      if (url !== null) this.avatar = url.trim()
    },

    handleLogout() {
      this.userStore.logout()
      this.$router.push('/login')
    },

    async handleDelete() {
      if (!confirm('This will delete your account and data. Continue?')) return
      try {
        await this.userStore.deleteAccount()
        this.$router.push('/register')
      } catch (e) {
        console.error(e)
        alert('Unable to delete account.')
      }
    },
  },
}
</script>

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

    h1 {
      font-size: 14px;
      letter-spacing: 0.3em;
      color: #444;
      margin-bottom: 16px;
    }

    /* Card */
    .settings-card {
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
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: #fff;
      overflow: hidden;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }

    .avatar:hover {
      transform: scale(1.05);
    }

    .avatar img {
      width: 100%;
      height: 100%;
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

    .inline input { flex: 1; }

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
</style>
