<template>
  <div class="admin-panel">
    <NavBar />
    <div class="container">
      <div class="page-title">
        <h2>ADMIN PANEL</h2>
      </div>
    </div>

    <div class="container">
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3"
      >
        <div class="d-flex gap-2 w-100 w-md-auto">
          <div class="input-group input-group-sm search-group me-2">
            <span class="input-group-text bg-white border-end-0 search-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#355D4C"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.156a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
                />
              </svg>
            </span>
            <input
              v-model="search"
              class="form-control form-control-sm border-start-0 search-input"
              placeholder="Search users"
              aria-label="Search users"
            />
          </div>
          <div class="total-badge align-self-center">
            Total: <strong>{{ users.length }}</strong>
          </div>
        </div>
      </div>

      <div class="card shadow-sm border-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 admin-table">
            <thead>
              <tr>
                <th style="width: 90px" class="sortable" @click="toggleSort('id')">
                  ID
                  <span class="sort-indicator" v-if="sortKey === 'id'">{{
                    sortDir === 'asc' ? '▲' : '▼'
                  }}</span>
                </th>
                <th class="sortable" @click="toggleSort('name')">
                  Name
                  <span class="sort-indicator" v-if="sortKey === 'name'">{{
                    sortDir === 'asc' ? '▲' : '▼'
                  }}</span>
                </th>
                <th style="width: 90px" class="sortable" @click="toggleSort('points')">
                  Points
                  <span class="sort-indicator" v-if="sortKey === 'points'">{{
                    sortDir === 'asc' ? '▲' : '▼'
                  }}</span>
                </th>
                <th style="width: 110px" class="sortable" @click="toggleSort('priority')">
                  Priority
                  <span class="sort-indicator" v-if="sortKey === 'priority'">{{
                    sortDir === 'asc' ? '▲' : '▼'
                  }}</span>
                </th>
                <th style="width: 140px" class="sortable" @click="toggleSort('email')">
                  Email
                  <span class="sort-indicator" v-if="sortKey === 'email'">{{
                    sortDir === 'asc' ? '▲' : '▼'
                  }}</span>
                </th>
                <th style="width: 180px" class="sortable" @click="toggleSort('createdAt')">
                  Date Created
                  <span class="sort-indicator" v-if="sortKey === 'createdAt'">{{
                    sortDir === 'asc' ? '▲' : '▼'
                  }}</span>
                </th>
                <th style="width: 120px">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in pagedUsers" :key="user.id">
                <td class="text-muted">{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.points ?? '-' }}</td>
                <td>{{ user.priority }}</td>
                <td class="text-truncate" style="max-width: 140px">{{ user.email }}</td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <button
                    class="action-icon action-edit me-2"
                    @click="openEditModal(user)"
                    title="Edit"
                  >
                    <i class="bi bi-pencil" aria-hidden="true"></i>
                  </button>
                  <button
                    class="action-icon action-delete"
                    @click="deleteUser(user.id)"
                    title="Delete"
                  >
                    <i class="bi bi-trash" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="pagedUsers.length === 0">
                <td colspan="7" class="text-center py-4 text-muted">No users found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card-footer d-flex justify-content-between align-items-center footer-clean">
          <div class="d-flex align-items-center">
            <div class="page-label">Page {{ pageLabel }}</div>
          </div>

          <nav aria-label="Pagination">
            <ul class="pagination pagination-sm mb-0 d-flex gap-2">
              <li class="page-item">
                <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">
                  Previous
                </button>
              </li>
              <li class="page-item">
                <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- Avatar Decorations Section -->
      <div
        class="d-flex flex-row justify-content-between align-items-center gap-3 mb-3 mt-5"
      >
        <div class="d-flex gap-2 align-items-center flex-nowrap">
          <h5 class="mb-0 decoration-title">Avatar Decorations</h5>
          <div class="total-badge">
            Total: <strong>{{ decorations.length }}</strong>
          </div>
        </div>
        <button class="btn btn-add-decoration flex-shrink-0" @click="openAddDecorationModal">
          <i class="bi bi-plus-lg me-1"></i>Add
        </button>
      </div>

      <div class="card shadow-sm border-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 admin-table">
            <thead>
              <tr>
                <th style="width: 80px">Preview</th>
                <th class="sortable" @click="toggleDecorationSort('name')">
                  Name
                  <span class="sort-indicator" v-if="decorationSortKey === 'name'">{{ decorationSortDir === 'asc' ? '▲' : '▼' }}</span>
                </th>
                <th style="width: 100px" class="sortable" @click="toggleDecorationSort('requiredLevel')">
                  Req. Level
                  <span class="sort-indicator" v-if="decorationSortKey === 'requiredLevel'">{{ decorationSortDir === 'asc' ? '▲' : '▼' }}</span>
                </th>
                <th style="width: 250px">Path</th>
                <th style="width: 120px">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="decoration in sortedDecorations" :key="decoration.name">
                <td>
                  <img 
                    :src="decoration.src" 
                    :alt="decoration.name" 
                    class="decoration-preview"
                  />
                </td>
                <td class="fw-medium">{{ decoration.name }}</td>
                <td>
                  <span class="level-badge">Lv. {{ decoration.requiredLevel ?? 0 }}</span>
                </td>
                <td class="text-muted text-truncate" style="max-width: 250px">{{ decoration.src }}</td>
                <td>
                  <button
                    class="action-icon action-edit me-2"
                    @click="editDecoration(decoration)"
                    title="Edit"
                  >
                    <i class="bi bi-pencil" aria-hidden="true"></i>
                  </button>
                  <button
                    class="action-icon action-delete"
                    @click="deleteDecoration(decoration.name)"
                    title="Delete"
                  >
                    <i class="bi bi-trash" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="decorations.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">No decorations found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit User Modal -->
  <div v-if="modalVisible" class="modal-backdrop">
    <div class="modal-panel">
      <h5 class="mb-3">Edit user</h5>
      <div class="mb-2">
        <label class="form-label">Name</label>
        <input v-model="editingUser.name" class="form-control" />
      </div>
      <div class="mb-2">
        <label class="form-label">Email</label>
        <input v-model="editingUser.email" class="form-control" />
      </div>
      <div class="row">
        <div class="col">
          <label class="form-label">Points</label>
          <input type="number" v-model.number="editingUser.points" class="form-control" />
        </div>
        <div class="col">
          <label class="form-label">Priority</label>
          <select v-model="editingUser.priority" class="form-select">
            <option value="1">User</option>
            <option value="2">Admin</option>
          </select>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2 mt-3">
        <button class="btn btn-outline-secondary" @click="cancelEdit">Cancel</button>
        <button class="btn btn-success" @click="confirmEdit">Save</button>
      </div>
    </div>
  </div>

  <!-- Edit/Add Decoration Modal -->
  <div v-if="decorationModalVisible" class="modal-backdrop">
    <div class="modal-panel">
      <h5 class="mb-3">{{ isNewDecoration ? 'Add Decoration' : 'Edit Decoration' }}</h5>
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input 
          v-model="editingDecoration.name" 
          class="form-control" 
          :disabled="!isNewDecoration"
          placeholder="e.g., rainbow"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Required Level</label>
        <input 
          type="number" 
          v-model.number="editingDecoration.requiredLevel" 
          class="form-control"
          min="0"
          step="5"
          placeholder="0"
        />
        <small class="text-muted">Users need this level to equip the decoration (recommended: multiples of 5)</small>
      </div>
      <div class="mb-3">
        <label class="form-label">Choose Image</label>
        <div class="file-input-wrapper">
          <input 
            type="file"
            ref="decorationFileInput"
            accept="image/*"
            class="form-control"
            @change="handleDecorationFileUpload"
          />
        </div>
        <small class="text-muted mt-1 d-block">Current: {{ editingDecoration.src || 'No image selected' }}</small>
      </div>
      <div v-if="editingDecoration.src" class="mb-3 text-center">
        <label class="form-label d-block">Preview</label>
        <img 
          :src="editingDecoration.src" 
          :alt="editingDecoration.name"
          class="decoration-modal-preview"
        />
      </div>

      <div class="d-flex justify-content-end gap-2 mt-3">
        <button class="btn btn-outline-secondary" @click="cancelDecorationEdit">Cancel</button>
        <button class="btn btn-success" @click="saveDecoration">
          {{ isNewDecoration ? 'Add' : 'Save' }}
        </button>
      </div>
    </div>
  </div>

  <footer>
    <div class="footer-grid">
      <img src="/src/images/modoIcon.png" alt="logo" style="filter: brightness(0) invert(90%); height: 30px; margin: 0px;">
      <p>The best tracker to change who you are.</p>
      <p>MODO 2026 | ESMAD</p>
    </div>
  </footer>

  <!-- Toast notification -->
  <Transition name="toast-slide">
    <div v-if="toast.visible" class="toast-notification">
      <div
        class="toast-icon"
        :style="{ color: toast.title === 'User deleted' ? '#b4554d' : '#00cc66' }"
      >
        {{ toast.title === 'User deleted' ? '🗑️' : '✅' }}
      </div>
      <div class="toast-content">
        <strong>{{ toast.title }}</strong>
        <small>{{ toast.message }}</small>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavBar from '../Components/NavBar.vue'
import { useUserStore } from '@/stores/userStore'
import { updateUser as apiUpdateUser } from '@/api/modoApi'

const userStore = useUserStore()

const search = ref('')
const perPage = ref(5)
const currentPage = ref(1)

// Default avatar decorations with level requirements (every 5 levels unlocks a new one)
const defaultDecorations = [
  { name: 'solarSystem', src: '/src/images/avatar_decoration/solarSystem.png', requiredLevel: 0 },
  { name: 'garden', src: '/src/images/avatar_decoration/garden.png', requiredLevel: 5 },
  { name: 'olives', src: '/src/images/avatar_decoration/olives.png', requiredLevel: 10 },
  { name: 'cat', src: '/src/images/avatar_decoration/cat.png', requiredLevel: 15 },
  { name: 'summer', src: '/src/images/avatar_decoration/summer.png', requiredLevel: 20 },
  { name: 'zoo', src: '/src/images/avatar_decoration/zoo.png', requiredLevel: 25 }
]

// Load decorations from localStorage or use defaults
function loadDecorations() {
  const saved = localStorage.getItem('avatarDecorations')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return [...defaultDecorations]
    }
  }
  return [...defaultDecorations]
}

function saveDecorations() {
  localStorage.setItem('avatarDecorations', JSON.stringify(decorations.value))
}

// Avatar decorations data
const decorations = ref(loadDecorations())

// Decoration modal state
const decorationModalVisible = ref(false)
const editingDecoration = ref(null)
const isNewDecoration = ref(false)
const decorationFileInput = ref(null)

// Decoration sorting
const decorationSortKey = ref('name')
const decorationSortDir = ref('asc')

const sortedDecorations = computed(() => {
  const list = [...decorations.value]
  const key = decorationSortKey.value
  const dir = decorationSortDir.value === 'asc' ? 1 : -1
  
  list.sort((a, b) => {
    // Handle numeric sorting for requiredLevel
    if (key === 'requiredLevel') {
      const va = Number(a[key]) || 0
      const vb = Number(b[key]) || 0
      return (va - vb) * dir
    }
    const va = (a[key] || '').toString().toLowerCase()
    const vb = (b[key] || '').toString().toLowerCase()
    if (va < vb) return -1 * dir
    if (va > vb) return 1 * dir
    return 0
  })
  
  return list
})

function toggleDecorationSort(key) {
  if (decorationSortKey.value === key) {
    decorationSortDir.value = decorationSortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    decorationSortKey.value = key
    decorationSortDir.value = 'asc'
  }
}

// Sorting state: which key and direction ('asc'|'desc')
const sortKey = ref('id')
const sortDir = ref('asc')

/*
  `users` computed now:
  - reads users from the store
  - applies the search filter (name/email)
  - sorts by `sortKey` using `sortDir` (handles numbers, dates, strings)
  This keeps sorting local and instant (client-side).
*/
const users = computed(() => {
  const list = (userStore.users || []).slice()
  const q = search.value.trim().toLowerCase()

  // filter
  let filtered = list
  if (q) {
    filtered = list.filter(
      (u) => (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q),
    )
  }

  // sort
  const key = sortKey.value
  const dir = sortDir.value === 'asc' ? 1 : -1

  filtered.sort((a, b) => {
    const va = a == null ? '' : a[key]
    const vb = b == null ? '' : b[key]

    // date handling
    if (key === 'createdAt') {
      const da = va ? new Date(va).getTime() : 0
      const db = vb ? new Date(vb).getTime() : 0
      return (da - db) * dir
    }

    // numeric handling
    if (key === 'id' || key === 'points' || key === 'priority') {
      const na = Number(va) || 0
      const nb = Number(vb) || 0
      return (na - nb) * dir
    }

    // string fallback
    const sa = (va || '').toString().toLowerCase()
    const sb = (vb || '').toString().toLowerCase()
    if (sa < sb) return -1 * dir
    if (sa > sb) return 1 * dir
    return 0
  })

  return filtered
})

const totalPages = computed(() => Math.max(1, Math.ceil(users.value.length / perPage.value)))

const pageLabel = computed(() => {
  const p = String(currentPage.value).padStart(2, '0')
  const t = String(totalPages.value).padStart(2, '0')
  return `${p} of ${t}`
})

const startIndex = computed(() => (currentPage.value - 1) * perPage.value)
const endIndex = computed(() => startIndex.value + perPage.value)

const pagedUsers = computed(() => users.value.slice(startIndex.value, endIndex.value))

function goToPage(n) {
  if (n < 1) n = 1
  if (n > totalPages.value) n = totalPages.value
  currentPage.value = n
}
function prevPage() {
  goToPage(currentPage.value - 1)
}
function nextPage() {
  goToPage(currentPage.value + 1)
}

// Modal state for editing a user inline
const modalVisible = ref(false)
const editingUser = ref(null)

function openEditModal(user) {
  // clone the user so edits are local until confirmed
  editingUser.value = JSON.parse(JSON.stringify(user))
  modalVisible.value = true
}

function cancelEdit() {
  modalVisible.value = false
  editingUser.value = null
  showToast('Operation cancelled', 'User edit was cancelled')
}

async function confirmEdit() {
  if (!editingUser.value) return
  const payload = { ...editingUser.value }
  try {
    // try API update
    await apiUpdateUser(payload.id, payload)
    // update local store
    const idx = userStore.users.findIndex((u) => String(u.id) === String(payload.id))
    if (idx !== -1) {
      userStore.users[idx] = { ...userStore.users[idx], ...payload }
      userStore.saveToLocalStorage()
    }
    showToast('User modified', `${payload.name || payload.email} was modified`)
  } catch (e) {
    // fallback: update locally
    console.warn('API update failed, updating locally only', e)
    const idx = userStore.users.findIndex((u) => String(u.id) === String(payload.id))
    if (idx !== -1) {
      userStore.users[idx] = { ...userStore.users[idx], ...payload }
      userStore.saveToLocalStorage()
    }
    showToast('User modified', `${payload.name || payload.email} was modified (local)`)
  } finally {
    modalVisible.value = false
    editingUser.value = null
  }
}

/*
  Toggle sorting for a column header:
  - if clicking the active column, flip asc/desc
  - if clicking a new column, set it to ascending by default
*/
function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

// toast state & helper (matches HabitManagerView toast)
const toast = ref({ visible: false, title: '', message: '', timeout: null })

function showToast(title, message, duration = 3000) {
  toast.value.title = title
  toast.value.message = message
  toast.value.visible = true

  if (toast.value.timeout) clearTimeout(toast.value.timeout)
  toast.value.timeout = setTimeout(() => {
    toast.value.visible = false
  }, duration)
}

async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return

  // capture user's display info before deletion
  const target = userStore.getUserById(id)
  const label = target ? `${target.name || '-'} · ${target.email || '-'}` : String(id)

  try {
    await userStore.deleteAccount(id)
    // adjust page if needed
    if (pagedUsers.value.length === 0 && currentPage.value > 1) currentPage.value--

    showToast('User deleted', label)
  } catch (e) {
    console.error('Failed to delete user', e)
    alert('Failed to delete user')
  }
}

onMounted(() => {
  if (userStore.loadFromLocalStorage) userStore.loadFromLocalStorage()
  userStore.fetchUsers().catch(() => {})
})

function formatDate(value) {
  if (!value) return '-'
  try {
    const d = value instanceof Date ? value : new Date(value)
    return d.toLocaleString()
  } catch {
    return value
  }
}

// Decoration management functions
function editDecoration(decoration) {
  editingDecoration.value = { ...decoration }
  isNewDecoration.value = false
  decorationModalVisible.value = true
}

function deleteDecoration(name) {
  if (!confirm(`Are you sure you want to delete the "${name}" decoration?`)) return
  decorations.value = decorations.value.filter(d => d.name !== name)
  saveDecorations()
  showToast('Decoration deleted', `"${name}" was removed`)
}

function openAddDecorationModal() {
  editingDecoration.value = { name: '', src: '', requiredLevel: 0 }
  isNewDecoration.value = true
  decorationModalVisible.value = true
}

function cancelDecorationEdit() {
  decorationModalVisible.value = false
  editingDecoration.value = null
  // Reset file input
  if (decorationFileInput.value) {
    decorationFileInput.value.value = ''
  }
}

function handleDecorationFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showToast('Invalid file', 'Please select an image file')
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast('File too large', 'Please select an image smaller than 5MB')
    return
  }

  // Convert to base64
  const reader = new FileReader()
  reader.onload = (e) => {
    editingDecoration.value.src = e.target.result
  }
  reader.onerror = () => {
    showToast('Error', 'Failed to read the image file')
  }
  reader.readAsDataURL(file)
}

function saveDecoration() {
  if (!editingDecoration.value.name || !editingDecoration.value.src) {
    showToast('Error', 'Please fill in all fields')
    return
  }

  if (isNewDecoration.value) {
    // Check for duplicate name
    if (decorations.value.some(d => d.name === editingDecoration.value.name)) {
      showToast('Error', 'A decoration with this name already exists')
      return
    }
    decorations.value.push({ ...editingDecoration.value })
    showToast('Decoration added', `"${editingDecoration.value.name}" was added`)
  } else {
    const idx = decorations.value.findIndex(d => d.name === editingDecoration.value.name)
    if (idx !== -1) {
      decorations.value[idx] = { ...editingDecoration.value }
    }
    showToast('Decoration updated', `"${editingDecoration.value.name}" was updated`)
  }

  saveDecorations()
  decorationModalVisible.value = false
  editingDecoration.value = null
}
</script>

<style scoped>
.container {
  max-width: 1140px;
  padding: 0px 30px 0px 30px;
  margin: 0 auto;
  padding-top: 30px;
}

.page-title {
  width: 100%;
  max-width: 1080px;
  margin: 10px auto 50px auto;
  padding-top: 10px;
  border-top: 2px dotted #355d4c;
}

.page-title h2 {
  color: #355d4c;
  letter-spacing: 0.3em;
}

.admin-heading {
  color: #355d4c;
  font-family: Heebo, sans-serif;
  font-size: 22px;
  margin: 0 0 4px 0;
}
.total-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, #f0fbf5, #e6f7ee);
  color: #2f5b4b;
  font-weight: 700;
  box-shadow: 0 8px 22px rgba(37, 92, 62, 0.1);
  border: 1px solid rgba(53, 93, 76, 0.06);
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
}
.total-badge::before {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #355d4c;
  box-shadow: 0 3px 8px rgba(53, 93, 76, 0.25);
}
.total-badge:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(37, 92, 62, 0.14);
}
.total-badge strong {
  background: #355d4c;
  color: #fff;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 800;
  margin-left: 4px;
}
.admin-table thead th {
  background: linear-gradient(90deg, #e9f7ef, #dff3e8);
  color: #23463b;
  font-weight: 700;
}
.admin-table tbody tr:hover {
  background: #fbfffdf0;
}
.admin-table td {
  color: #244b3f;
}
.card-footer {
  background: transparent;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}
.pagination .page-item .page-link {
  cursor: pointer;
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Clean green footer styling */
.footer-clean {
  background: linear-gradient(90deg, #f7fcf8, #eef8f0);
  border-top: none;
  padding: 10px 18px;
}
.page-label {
  font-weight: 800;
  color: #25543f;
  font-size: 14px;
}
.page-btn {
  border-radius: 999px;
  border: 1.5px solid rgba(53, 93, 76, 0.18);
  color: #2f6b53;
  background: rgba(47, 107, 83, 0.03);
  padding: 6px 14px;
  font-weight: 700;
}
.page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.page-btn:hover:not(:disabled) {
  background: #2f6b53;
  color: #fff;
  box-shadow: 0 8px 20px rgba(47, 107, 83, 0.12);
  border-color: #2f6b53;
}

/* Search input tweaks */
.search-group .search-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
}
.search-input {
  width: 160px;
  color: #355d4c;
  border-left: 0;
}
.search-input::placeholder {
  color: rgba(53, 93, 76, 0.45);
}
.search-icon svg {
  display: block;
}

/* Action icon buttons (pencil / trash) */
.action-icon {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 120ms ease;
  background: rgba(53, 93, 76, 0.06);
  color: #355d4c;
}
.action-icon i {
  font-size: 16px;
}
.action-icon:hover {
  transform: translateY(-3px);
}
.action-edit {
  background: rgba(53, 93, 76, 0.06);
  color: #355d4c;
}
.action-edit:hover {
  background: #355d4c;
  color: #ffffff;
}
.action-delete {
  background: rgba(182, 43, 43, 0.06);
  color: #b62b2b;
}
.action-delete:hover {
  background: #b62b2b;
  color: #ffffff;
}

/* Rounded pill-style search group */
.search-group {
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(53, 93, 76, 0.08);
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(53, 93, 76, 0.03);
}
.search-group:focus-within {
  border-color: #355d4c;
  box-shadow: 0 8px 28px rgba(53, 93, 76, 0.12);
}
.search-group .input-group-text {
  background: transparent;
  border: 0;
  padding: 6px 10px;
}
.search-input {
  width: 140px;
  color: #355d4c;
  border: 0;
  padding: 8px 12px;
  background: transparent;
}
.search-input:focus {
  outline: none;
  box-shadow: none;
}

/* Slight, subtle rounding override (make table a little rounded) */
.table-responsive {
  border-radius: 12px !important;
}
.card {
  border-radius: 14px !important;
}
.admin-table thead th:first-child {
  border-top-left-radius: 12px !important;
}
.admin-table thead th:last-child {
  border-top-right-radius: 12px !important;
}
.admin-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 12px !important;
}
.admin-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 12px !important;
}

/* Sortable header styles */
.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}
.sort-indicator {
  font-size: 12px;
  margin-left: 6px;
  color: #2f6b53;
}

/* Toast and transition styles (copied from HabitManagerView.vue) */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.35s ease;
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px) translateX(20px);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) translateX(20px);
}

.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;

  display: flex;
  align-items: center;
  gap: 12px;

  background: linear-gradient(135deg, #355d4c, #4f6f5f);
  color: #fff;
  padding: 14px 18px;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);

  min-width: 260px;
  max-width: 320px;
}

.toast-icon {
  font-size: 22px;
  line-height: 1;
}

.toast-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toast-content strong {
  font-size: 14px;
  font-weight: 700;
}

.toast-content small {
  font-size: 12px;
  opacity: 0.9;
}

/* Simple modal styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-panel {
  width: 520px;
  max-width: calc(100% - 32px);
  background: #fff;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 24px 60px rgba(10, 30, 20, 0.15);
}

/* Avatar Decorations styles */
.decoration-title {
  color: #355d4c;
  font-weight: 700;
}

.card-header {
  background: linear-gradient(90deg, #f0fbf5, #e6f7ee);
  border-bottom: 1px solid rgba(53, 93, 76, 0.08);
  padding: 14px 18px;
}

.decoration-preview {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
  background: rgba(53, 93, 76, 0.05);
  padding: 4px;
}

.decoration-modal-preview {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 12px;
  background: rgba(53, 93, 76, 0.08);
  padding: 8px;
}

.btn-add-decoration {
  background: linear-gradient(135deg, #355d4c, #4f6f5f);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 160ms ease;
}

.btn-add-decoration:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(53, 93, 76, 0.25);
  background: linear-gradient(135deg, #2a4d3e, #3f5f4f);
  color: #fff;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #355d4c, #4a7a64);
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  min-width: 50px;
}
</style>
<style src="../css/styles.css"></style>