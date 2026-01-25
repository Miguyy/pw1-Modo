<template>
  <NavBar />
  <div class="container">
    <div class="page-title">
      <h2>HABITS MANAGER</h2>
    </div>
    <!-- Main Content Container -->
    <div class="row mt-2 g-3 align-items-stretch">
      <div class="col-12 col-md-4 col-lg-3">
        <div class="weather-box shadow p-3 h-100">
          <!-- Weather Component Box -->
          <Weather />
        </div>
      </div>
      <div class="col-12 col-md-4 col-lg-4">
        <div class="charts-box p-3 h-100">
          <!-- Habit Stats Chart Box -->
          <HabitStatsChart />
        </div>
      </div>
      <div class="col-12 col-md-4 col-lg-4">
        <div class="profile-card p-3 d-flex align-items-center gap-3 h-100">
          <div class="avatar-wrapper">
            <img
              v-if="currentUser?.avatar"
              :src="currentUser.avatar"
              alt="Profile"
              class="avatar-img"
            />
            <div v-else class="avatar-fallback">{{ userInitials }}</div>
          </div>
          <div class="flex-grow-1">
            <h5 class="mb-1 text-capitalize">{{ currentUser?.name || 'Guest' }}</h5>
            <p class="mb-2 text-muted small">{{ currentUser?.email || 'Not signed in' }}</p>
            <div class="d-flex flex-wrap gap-2 align-items-center">
              <span class="badge bg-success-soft">Points: {{ currentUser?.points ?? 0 }}</span>
              <span class="badge bg-primary-soft">Level: {{ userLevel }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4 add-habit">
      <div class="col-12">
        <!-- Add Habit Form -->
        <div class="card p-3 mb-0">
          <form @submit.prevent="handleAdd">
            <!-- Prevent default form submission -->
            <div class="row g-2">
              <div class="col-md-6">
                <label>Description</label>
                <input v-model="form.description" class="form-control" required />
              </div>
              <div class="col-md-1">
                <label>Priority</label>
                <select v-model="form.priority" class="form-select">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div class="col-md-2">
                <label>Type</label>
                <select v-model="form.type" class="form-select">
                  <option value="check">Check</option>
                  <option value="count">Count</option>
                  <option value="time">Time</option>
                </select>
              </div>

              <div class="col-md-2">
                <label>Location</label>
                <select v-model="form.location" class="form-select">
                  <option value="inside">Inside</option>
                  <option value="outside">Outside</option>
                </select>
              </div>

              <div class="col-md-12 text-end d-flex align-items-end">
                <button class="btn btn-primary w-100" type="submit">
                  <FontAwesomeIcon icon="plus" /> Create new habit
                </button>
              </div>

              <!-- COUNT EXTRA FIELDS -->
              <div v-if="form.type === 'count'" class="col-12 mt-2">
                <div class="row g-2">
                  <div class="col-md-2">
                    <label>Target</label>
                    <input type="number" v-model.number="form.target_count" class="form-control" />
                  </div>
                  <div class="col-md-2">
                    <label>Increment</label>
                    <input
                      type="number"
                      v-model.number="form.increment_value"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>

              <!-- TIME EXTRA FIELDS -->
              <div v-if="form.type === 'time'" class="col-12 mt-2">
                <div class="row g-2">
                  <div class="col-md-6">
                    <label>Target Minutes</label>
                    <input
                      type="number"
                      v-model.number="form.target_minutes"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <br />
    <div class="row">
      <div class="col-12">
        <hr class="my-4" style="border: dotted 1px; color: #355d4c" />
      </div>
    </div>

    <!-- Filters and Sorting Toolbar (moved below divider) -->
    <div class="row mt-2">
      <div class="col-12">
        <div class="card p-3 mb-0 filters-card">
          <div class="row g-2 align-items-end">
            <div class="col-md-2">
              <label>Type</label>
              <select v-model="filters.type" class="form-select">
                <option value="all">All</option>
                <option value="check">Check</option>
                <option value="count">Count</option>
                <option value="time">Time</option>
              </select>
            </div>
            <div class="col-md-2">
              <label>Priority</label>
              <select v-model="filters.priority" class="form-select">
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div class="col-md-2">
              <label>Location</label>
              <select v-model="filters.location" class="form-select">
                <option value="all">All</option>
                <option value="inside">Inside</option>
                <option value="outside">Outside</option>
              </select>
            </div>
            <div class="col-md-2">
              <label>Sort By</label>
              <select v-model="filters.sortBy" class="form-select">
                <option value="priority">Priority</option>
                <option value="created_at">Created At</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
            <div class="col-md-2">
              <label>Order</label>
              <select v-model="filters.sortOrder" class="form-select">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div class="col-md-1 d-flex justify-content-end">
              <button class="btn btn-md btn-outline-danger" @click="resetFilters">Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Habits list: CSS Grid to avoid gaps -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="habits-grid">
          <div v-for="habit in displayHabits" :key="habit.id" class="habit-item">
            <div class="card p-3 h-100 d-flex flex-column">
              <div class="card-header-custom">
                <div class="habit-title-section">
                  <strong class="habit-title">{{ habit.description }}</strong>
                  <div class="habit-badges">
                    <span class="badge badge-priority" :class="'priority-' + habit.priority">
                      {{ habit.priority.toUpperCase() }}
                    </span>
                    <span class="badge badge-type" :class="'type-' + habit.type">
                      <FontAwesomeIcon :icon="getHabitIcon(habit.type)" /> {{ habit.type }}
                    </span>
                  </div>
                </div>
                <small class="location-info">
                  <FontAwesomeIcon icon="map-pin" /> {{ habit.location }}
                </small>
              </div>

              <!-- CHECK TYPE -->
              <div
                v-if="habit.type === 'check'"
                class="habit-content flex-grow-1 d-flex flex-column"
              >
                <div class="check-indicator">
                  <div
                    class="check-status"
                    :class="{ 'check-completed': habit.current_progress.checked }"
                  >
                    <FontAwesomeIcon
                      :icon="habit.current_progress.checked ? 'check-circle' : 'circle'"
                      class="check-icon"
                    />
                  </div>
                  <div class="check-text">
                    <span v-if="habit.current_progress.checked" class="badge bg-success"
                      >Completed</span
                    >
                    <span v-else class="badge bg-secondary">Pending</span>
                  </div>
                </div>

                <div class="check-actions d-flex gap-2 mt-auto">
                  <button class="btn btn-sm btn-success flex-fill" @click="toggleCheck(habit.id)">
                    <FontAwesomeIcon :icon="habit.current_progress.checked ? 'undo' : 'check'" />
                    {{ habit.current_progress.checked ? 'Uncheck' : 'Mark Done' }}
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger flex-fill"
                    @click="deleteHabit(habit.id)"
                  >
                    <FontAwesomeIcon icon="trash" />
                  </button>
                </div>
              </div>

              <!-- COUNT TYPE -->
              <div
                v-if="habit.type === 'count'"
                class="habit-content flex-grow-1 d-flex flex-column"
              >
                <div class="progress-section">
                  <div class="progress-header">
                    <span>Progress</span>
                    <span class="progress-value"
                      >{{ habit.current_progress.count }} / {{ habit.target_count }}</span
                    >
                  </div>
                  <div class="progress">
                    <div
                      class="progress-bar"
                      role="progressbar"
                      :style="{ width: countPercent(habit) + '%' }"
                      :class="progressClass(countPercent(habit))"
                    >
                      {{ countPercent(habit) }}%
                    </div>
                  </div>
                </div>

                <div class="counter-controls">
                  <button class="btn btn-sm btn-danger" @click="decrement(habit.id)">
                    <FontAwesomeIcon icon="arrow-left" />
                  </button>
                  <span class="counter-value">{{ habit.current_progress.count }}</span>
                  <button class="btn btn-sm btn-success" @click="increment(habit.id)">
                    <FontAwesomeIcon icon="arrow-right" />
                  </button>
                </div>

                <div class="d-flex gap-2 mt-auto">
                  <button class="btn btn-sm btn-success flex-fill" @click="complete(habit.id)">
                    <FontAwesomeIcon icon="check" /> Complete
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger flex-fill"
                    @click="deleteHabit(habit.id)"
                  >
                    <FontAwesomeIcon icon="trash" /> Delete
                  </button>
                </div>
              </div>

              <!-- TIME TYPE -->
              <div
                v-if="habit.type === 'time'"
                class="habit-content flex-grow-1 d-flex flex-column"
              >
                <div class="progress-section">
                  <div class="progress-header">
                    <span>Time Progress</span>
                    <span class="progress-value"
                      >{{ formatSecondsToMinSec(habit.current_progress.seconds || 0) }} /
                      {{ habit.target_minutes }} min</span
                    >
                  </div>
                  <div class="progress">
                    <div
                      class="progress-bar"
                      role="progressbar"
                      :style="{ width: timePercent(habit) + '%' }"
                      :class="progressClass(timePercent(habit))"
                    >
                      {{ timePercent(habit) }}%
                    </div>
                  </div>
                </div>

                <div class="time-remaining">
                  <span class="time-label">Time Remaining:</span>
                  <span class="time-value"
                    >{{ formatSecondsToMinSec(habit.remaining_seconds ?? (habit.target_minutes * 60) ?? 0) }}</span
                  >
                </div>

                <div class="d-flex gap-2 mt-auto">
                  <button
                    class="btn btn-sm btn-outline-primary flex-fill"
                    @click="openTimer(habit.id)"
                  >
                    <FontAwesomeIcon icon="clock" /> Timer
                  </button>
                  <button class="btn btn-sm btn-success flex-fill" @click="complete(habit.id)">
                    <FontAwesomeIcon icon="check" /> Complete
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger flex-fill"
                    @click="deleteHabit(habit.id)"
                  >
                    <FontAwesomeIcon icon="trash" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TIMER MODAL (kept as-is) -->
    <div class="modal fade" id="timerModal" tabindex="-1" ref="timerModalEl">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ activeTimerHabit?.description }}</h5>
            <button class="btn-close" data-bs-dismiss="modal" @click="onCloseTimerModal"></button>
          </div>
          <div class="modal-body text-center">
            <div class="timer-display mb-3">
              <span class="timer-value" :class="{ 'timer-running': timerIsRunning }">{{ formattedTime }}</span>
            </div>
            <p class="text-muted mb-3">
              <span v-if="timerIsRunning" class="badge bg-success">Running</span>
              <span v-else class="badge bg-secondary">Paused</span>
            </p>

            <div class="d-flex gap-2 justify-content-center">
              <button class="btn btn-primary" @click="startTimerButton" :disabled="timerIsRunning">
                <FontAwesomeIcon icon="play" /> {{ timerIsRunning ? 'Running...' : 'Start' }}
              </button>
              <button class="btn btn-secondary" @click="pauseTimerButton" :disabled="!timerIsRunning">
                <FontAwesomeIcon icon="pause" /> Pause
              </button>
              <button class="btn btn-success" @click="complete(activeTimerHabit.id)">
                <FontAwesomeIcon icon="check" /> Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast notification -->
  <Transition name="toast-slide">
    <div v-if="toast.visible" class="toast-notification">
      <div
        class="toast-icon"
        :style="{ color: toast.title === 'Habit deleted' ? '#b4554d' : '#00cc66' }"
      >
        {{ toast.title === 'Habit deleted' ? '🗑️' : '✅' }}
      </div>
      <div class="toast-content">
        <strong>{{ toast.title }}</strong>
        <small>{{ toast.message }}</small>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Pinia stores
import { useHabitStore } from '@/stores/habitStore'
import { useUserStore } from '@/stores/userStore'
import { useOpenWeatherApiStore } from '@/stores/openWeatherApiStore'

// Bootstrap JS helpers (Modal/Toast)
import * as bootstrap from 'bootstrap'

// Local components used in this view
import NavBar from '../Components/NavBar.vue'
import Weather from '@/Components/Weather.vue'
import HabitStatsChart from '@/Components/HabitStatsChart.vue'

// Initialize stores
const habitStore = useHabitStore()
const userStore = useUserStore()
const weatherStore = useOpenWeatherApiStore()

// Form reactive state for the add-habit form
const form = ref({
  description: '',
  type: 'check',
  location: 'inside',
  priority: 'low',
  target_count: 1,
  increment_value: 1,
  target_minutes: 15,
})

// Simple UI toast state used for quick feedback (create/delete)
const toast = ref({
  visible: false,
  title: '',
  message: '',
  timeout: null,
})

// Helper to show the toast message
function showToast(title, message, duration = 3000) {
  toast.value.title = title
  toast.value.message = message
  toast.value.visible = true

  if (toast.value.timeout) clearTimeout(toast.value.timeout)

  toast.value.timeout = setTimeout(() => {
    toast.value.visible = false
  }, duration)
}

// Lifecycle hook: restore persisted state and reconcile timers
onMounted(() => {
  habitStore.loadFromLocalStorage()
  habitStore.reconcileRunningTimers()
  if (userStore.loadFromLocalStorage) userStore.loadFromLocalStorage()
})

watch(
  () => weatherStore.weatherData,
  (newWeather) => {
    if (!newWeather) return

    // Check if it's raining
    const condition = newWeather.weather[0].main.toLowerCase()
    if (condition.includes('rain')) {
      // Find outside habits
      const outsideHabits = displayHabits.value.filter((h) => h.location === 'outside')
      if (outsideHabits.length) {
        showToast(
          'Weather Alert',
          `It's raining! You might want to postpone your outside tasks.`,
          10000,
        )
      }
    }
  },
  { immediate: true },
)

const currentUser = computed(() => userStore.currentUser)
const userLevel = computed(() => {
  if (!currentUser.value || Number.isNaN(Number(currentUser.value.points))) return 0
  return Math.round((currentUser.value.points || 0) / 100)
})
const userInitials = computed(() => {
  const name = currentUser.value?.name || ''
  const initials = name
    .split(' ')
    .filter((n) => n)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
  return initials ? initials.toUpperCase() : '?'
})
const userHabits = computed(() => {
  if (!currentUser.value) return []
  return habitStore.getHabitsByUser(currentUser.value.id)
})

// Filters + Sorting state
const filters = ref({
  search: '',
  type: 'all',
  priority: 'all',
  location: 'all',
  sortBy: 'created_at', // 'priority' | 'created_at' | 'alphabetical'
  sortOrder: 'desc', // 'asc' | 'desc'
})

const priorityWeight = { low: 1, medium: 2, high: 3 }

const displayHabits = computed(() => {
  const list = [...userHabits.value]

  // Filtering
  const filtered = list.filter((h) => {
    const matchesSearch = filters.value.search
      ? h.description.toLowerCase().includes(filters.value.search.toLowerCase())
      : true

    const matchesType = filters.value.type === 'all' ? true : h.type === filters.value.type
    const matchesPriority =
      filters.value.priority === 'all' ? true : h.priority === filters.value.priority
    const matchesLocation =
      filters.value.location === 'all' ? true : h.location === filters.value.location

    return matchesSearch && matchesType && matchesPriority && matchesLocation
  })

  // Sorting
  const { sortBy, sortOrder } = filters.value
  const dir = sortOrder === 'asc' ? 1 : -1

  filtered.sort((a, b) => {
    if (sortBy === 'priority') {
      const pa = priorityWeight[a.priority] || 0
      const pb = priorityWeight[b.priority] || 0
      return (pa - pb) * dir
    }
    if (sortBy === 'created_at') {
      const ta =
        a.created_at instanceof Date ? a.created_at.getTime() : new Date(a.created_at).getTime()
      const tb =
        b.created_at instanceof Date ? b.created_at.getTime() : new Date(b.created_at).getTime()
      return (ta - tb) * dir
    }
    // alphabetical by description
    const da = (a.description || '').toLowerCase()
    const db = (b.description || '').toLowerCase()
    if (da < db) return -1 * dir
    if (da > db) return 1 * dir
    return 0
  })

  return filtered
})

// Reset filters to their default values
function resetFilters() {
  filters.value = {
    search: '',
    type: 'all',
    priority: 'all',
    location: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc',
  }
}

function resetForm() {
  form.value = {
    description: '',
    type: 'check',
    location: 'inside',
    priority: 'low',
    target_count: 1,
    increment_value: 1,
    target_minutes: 15,
  }
}

// Handle submission of the add-habit form
function handleAdd() {
  if (!currentUser.value) return alert('Please log in first')

  habitStore.addHabit({
    user_id: currentUser.value.id,
    description: form.value.description,
    type: form.value.type,
    priority: form.value.priority,
    location: form.value.location,
    target_count: form.value.type === 'count' ? form.value.target_count : null,
    increment_value: form.value.type === 'count' ? form.value.increment_value : 1,
    target_minutes: form.value.type === 'time' ? form.value.target_minutes : null,
  })

  // Provide immediate feedback
  showToast(
    'Habit created',
    `${form.value.description} · ${form.value.priority} · ${form.value.location}`,
  )

  // reset form inputs
  form.value.description = ''
  form.value.location = 'inside'

  resetForm()
}

// Delete a habit after confirmation and show a toast
function deleteHabit(id) {
  if (confirm('Delete habit?')) {
    const habit = habitStore.getHabitById(id)
    habitStore.deleteHabit(id)
    showToast('Habit deleted', `${habit.description} · ${habit.priority} · ${habit.location}`)
  }
}

// Action helpers that delegate to the habit store
function increment(id) {
  habitStore.incrementCount(id)
}
function decrement(id) {
  habitStore.decrementCount(id)
}
function toggleCheck(id) {
  habitStore.toggleCheck(id)
}
function complete(id) {
  habitStore.completeHabit(id)
}

// Compute percent complete for time-based habits (using seconds)
function timePercent(h) {
  if (!h.target_minutes) return 0
  const targetSeconds = h.target_minutes * 60
  const progressSeconds = h.current_progress.seconds || 0
  return Math.round((progressSeconds / targetSeconds) * 100)
}

// Format seconds to MM:SS string
function formatSecondsToMinSec(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

// Compute percent complete for count-based habits
function countPercent(h) {
  if (!h.target_count) return 0
  return Math.round(((h.current_progress.count || 0) / h.target_count) * 100)
}

// Return the FontAwesome icon name for a habit type
function getHabitIcon(type) {
  switch (type) {
    case 'check':
      return 'check-circle'
    case 'count':
      return 'chart-bar'
    case 'time':
      return 'hourglass'
    default:
      return 'circle'
  }
}

// Map progress percent to a CSS class used by the progress bar
function progressClass(percent) {
  if (percent < 33) return 'progress-low'
  if (percent < 66) return 'progress-mid'
  return 'progress-high'
}

/* TIMER MODAL */
const timerModalEl = ref(null)
const timerInstance = ref(null)
const activeTimerHabit = ref(null)
const remainingSeconds = ref(0)
const timerIsRunning = ref(false)
const timerIntervalId = ref(null)

// Format time as MM:SS
const formattedTime = computed(() => {
  const mins = Math.floor(remainingSeconds.value / 60)
  const secs = remainingSeconds.value % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

// Clean up timer interval on component unmount
onUnmounted(() => {
  if (timerIntervalId.value) {
    clearInterval(timerIntervalId.value)
  }
})

function openTimer(id) {
  const habit = habitStore.getHabitById(id)
  activeTimerHabit.value = habit
  
  // Get remaining seconds from habit (or calculate from target_minutes)
  const targetSeconds = (habit.target_minutes ?? 0) * 60
  remainingSeconds.value = habit.remaining_seconds ?? targetSeconds
  timerIsRunning.value = !!habit.timer_last_started_at
  
  // If timer was already running, calculate current remaining time
  if (habit.timer_last_started_at) {
    const elapsed = Date.now() - habit.timer_last_started_at
    const elapsedSec = Math.floor(elapsed / 1000)
    remainingSeconds.value = Math.max(0, remainingSeconds.value - elapsedSec)
    
    if (remainingSeconds.value > 0) {
      startCountdown()
    }
  }
  
  if (!timerInstance.value && timerModalEl.value) {
    timerInstance.value = new bootstrap.Modal(timerModalEl.value)
  }
  timerInstance.value.show()
}

function startCountdown() {
  // Clear any existing interval
  if (timerIntervalId.value) {
    clearInterval(timerIntervalId.value)
  }
  
  timerIntervalId.value = setInterval(() => {
    if (remainingSeconds.value <= 0) {
      // Timer completed
      clearInterval(timerIntervalId.value)
      timerIntervalId.value = null
      timerIsRunning.value = false
      remainingSeconds.value = 0
      
      // Auto-complete the habit
      if (activeTimerHabit.value) {
        habitStore.completeHabit(activeTimerHabit.value.id)
        showToast('Timer Complete!', `${activeTimerHabit.value.description} has been completed!`)
      }
      return
    }
    
    // Decrement by 1 second
    remainingSeconds.value--
    
    // Update habit progress in real-time for the progress bar
    if (activeTimerHabit.value) {
      const habit = habitStore.getHabitById(activeTimerHabit.value.id)
      if (habit) {
        habit.remaining_seconds = remainingSeconds.value
        habit.current_progress.seconds = (habit.target_minutes * 60) - remainingSeconds.value
      }
    }
  }, 1000)
}

function stopCountdown() {
  if (timerIntervalId.value) {
    clearInterval(timerIntervalId.value)
    timerIntervalId.value = null
  }
}

function startTimerButton() {
  if (!activeTimerHabit.value) return
  habitStore.startTimer(activeTimerHabit.value.id)
  
  // If remainingSeconds is 0, reset to full time
  if (remainingSeconds.value <= 0) {
    const h = habitStore.getHabitById(activeTimerHabit.value.id)
    const targetSeconds = (h.target_minutes ?? 0) * 60
    remainingSeconds.value = h.remaining_seconds ?? targetSeconds
  }
  
  timerIsRunning.value = true
  startCountdown()
}

function pauseTimerButton() {
  if (!activeTimerHabit.value) return
  stopCountdown()
  // Pass current remaining seconds to store
  habitStore.pauseTimer(activeTimerHabit.value.id, remainingSeconds.value)
  timerIsRunning.value = false
}

function onCloseTimerModal() {
  stopCountdown()
  if (activeTimerHabit.value && timerIsRunning.value) {
    // Save current state when closing modal while running
    habitStore.pauseTimer(activeTimerHabit.value.id, remainingSeconds.value)
  }
  activeTimerHabit.value = null
  timerIsRunning.value = false
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
  --orange: #f19640;
  --radius: 18px;
}

* {
  box-sizing: border-box;
}

.container {
  width: 1080px;
  max-width: 1080px;
  margin: 0 auto;
  padding: 30px 0px 0px;
}

.weather-box {
  background: linear-gradient(135deg, #355d4c 0%, #4f6f5f 100%);
  color: #fff;
  border-radius: var(--radius);
  min-height: 200px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.weather-box:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.weather-box input {
  background: rgba(255, 255, 255, 0.95);
  color: #000;
  border-radius: 10px;
  padding: 10px 12px;
  border: 2px solid rgba(0, 0, 0, 0.05);
  width: 100%;
  margin-bottom: 8px;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.weather-box input:focus {
  outline: none;
  border-color: var(--green);
  box-shadow: 0 0 8px rgba(79, 111, 95, 0.2);
}

.weather-box button {
  background: var(--orange);
  border: none;
  color: #fff;
  transition: all 0.3s ease;
  border-radius: 8px;
  font-weight: 500;
}

.weather-box button:hover {
  background: #e88530;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(241, 150, 64, 0.3);
}

.charts-box {
  background: #fff;
  color: var(--green-dark);
  border-radius: var(--radius);
  min-height: 310px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.charts-box:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.charts-box input {
  background: rgba(255, 255, 255, 0.95);
  color: #000;
  border-radius: 10px;
  padding: 10px 12px;
  border: 2px solid rgba(0, 0, 0, 0.05);
  width: 100%;
  margin-bottom: 8px;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.charts-box input:focus {
  outline: none;
  border-color: var(--green);
  box-shadow: 0 0 8px rgba(79, 111, 95, 0.2);
}

.profile-card {
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  min-height: 170px;
  border: 1px solid #e7ece9;
}

.avatar-wrapper {
  width: 82px;
  height: 82px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #355d4c, #4f6f5f);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 24px;
  border: 3px solid #f3f6f4;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1px;
}

.bg-success-soft {
  background: #e6f4ec;
  color: #2f6f4f;
}

.bg-primary-soft {
  background: #e8f0ff;
  color: #2c4f7f;
}

/* FORM CARD */
.card.p-3.mb-0 {
  border: none;
  border-radius: var(--radius);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background: #fff;
  transition: all 0.3s ease;
}

.card.p-3.mb-0:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* FORM INPUTS */
.card.p-3.mb-0 input,
.card.p-3.mb-0 select {
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.card.p-3.mb-0 input:focus,
.card.p-3.mb-0 select:focus {
  border-color: var(--green);
  box-shadow: 0 0 8px rgba(79, 111, 95, 0.15);
  outline: none;
}

.card.p-3.mb-0 label {
  font-weight: 600;
  color: var(--green-dark);
  font-size: 13px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* CREATE BUTTON */
.card.p-3.mb-0 .btn-primary {
  background: linear-gradient(135deg, var(--green-dark), var(--green));
  border: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.card.p-3.mb-0 .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 111, 95, 0.25);
  background: linear-gradient(135deg, #2f4f40, #3f5f50);
}

.card.p-3.mb-0 .btn-primary:active {
  transform: translateY(0);
}

/* HABIT CARDS */
.card.p-3.h-100 {
  border: none;
  border-radius: var(--radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0 !important;
}

.card.p-3.h-100::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--green-dark), var(--orange));
}

.card.p-3.h-100:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

/* CARD HEADER */
.card-header-custom {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.habit-title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.habit-title {
  color: var(--green-dark);
  font-size: 15px;
  line-height: 1.4;
  margin: 0;
}

.habit-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.badge-priority {
  font-size: 10px;
  padding: 4px 8px;
  font-weight: 600;
  border-radius: 6px;
  text-transform: uppercase;
}

.priority-low {
  background: #d4edda;
  color: #155724;
}

.priority-medium {
  background: #fff3cd;
  color: #856404;
}

.priority-high {
  background: #f8d7da;
  color: #721c24;
}

.badge-type {
  font-size: 10px;
  padding: 4px 8px;
  font-weight: 600;
  border-radius: 6px;
  background: #e7f3f7;
  color: #0c5460;
  display: flex;
  align-items: center;
  gap: 4px;
}

.location-info {
  color: var(--text-muted);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

/* HABIT CONTENT */
.habit-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

/* PROGRESS SECTION */
.progress-section {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 12px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  margin-bottom: 8px;
  color: var(--green-dark);
  font-weight: 600;
}

.progress-value {
  color: var(--orange);
  font-weight: 700;
}

.progress {
  height: 10px;
  border-radius: 10px;
  background: #e8e8e8;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
}

.progress-bar {
  background: linear-gradient(90deg, var(--green-dark), var(--green));
  transition: width 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #fff;
  font-weight: 600;
}

.progress-bar.progress-low {
  background: linear-gradient(90deg, #e76f51, #f4a261);
}
.progress-bar.progress-mid {
  background: linear-gradient(90deg, #ffd166, #f4a261);
  color: #283618;
}
.progress-bar.progress-high {
  background: linear-gradient(90deg, var(--green-dark), var(--green));
}

/* COUNTER CONTROLS */
.counter-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 12px;
}

.counter-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--green-dark);
  min-width: 40px;
  text-align: center;
}

.counter-controls .btn-sm {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 700;
}

/* TIME REMAINING */
.time-remaining {
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.08), rgba(79, 111, 95, 0.08));
  border-radius: 10px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
}

.time-value {
  font-size: 18px;
  font-weight: 700;
  color: #4a90e2;
}

/* BUTTONS */
.card.p-3.h-100 .btn-sm {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 12px;
  border: none;
}

.card.p-3.h-100 .btn-success {
  background: linear-gradient(135deg, #4f6f5f, #3f5f4f);
  border: none;
  color: #fff;
}

.card.p-3.h-100 .btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 111, 95, 0.25);
}

.card.p-3.h-100 .btn-danger {
  background: var(--danger);
  border: none;
  color: #fff;
}

.card.p-3.h-100 .btn-danger:hover {
  background: #a54640;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(180, 85, 77, 0.25);
}

.card.p-3.h-100 .btn-outline-success {
  border: 2px solid var(--green);
  color: var(--green);
}

.card.p-3.h-100 .btn-outline-success:hover {
  background: var(--green-light);
  transform: translateY(-2px);
}

.card.p-3.h-100 .btn-outline-danger {
  border: 2px solid var(--danger);
  color: var(--danger);
}

.card.p-3.h-100 .btn-outline-danger:hover {
  background: rgba(180, 85, 77, 0.1);
  transform: translateY(-2px);
}

.card.p-3.h-100 .btn-outline-primary {
  border: 2px solid #4a90e2;
  color: #4a90e2;
}

.card.p-3.h-100 .btn-outline-primary:hover {
  background: rgba(74, 144, 226, 0.1);
  transform: translateY(-2px);
}

/* CHECKBOX */
.form-check-input {
  width: 20px;
  height: 20px;
  border: 2px solid #d0d0d0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-check-input:checked {
  background-color: var(--green);
  border-color: var(--green);
}

.form-check-input:hover {
  border-color: var(--green);
}

.form-check-label {
  cursor: pointer;
  font-weight: 500;
  color: var(--green-dark);
}

/* MODAL */
.modal-content {
  border: none;
  border-radius: var(--radius);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: linear-gradient(135deg, var(--green-dark), var(--green));
  color: #fff;
  border: none;
  border-radius: var(--radius) var(--radius) 0 0;
}

.modal-header .modal-title {
  color: #fff !important;
}

.modal-header .btn-close {
  filter: brightness(0) invert(1);
}

.modal-body {
  padding: 24px;
}

/* CONTAINER */
.container {
  max-width: 1200px;
}

/* HEADING */
.container h5,
.container h3 {
  color: var(--green-dark);
  font-weight: 700;
}

/* Filters toolbar */
.filters-card {
  border: none;
  border-radius: var(--radius);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background: #fff;
}
.filters-header strong {
  color: var(--green-dark);
}
.filters-count {
  background: #f1f3f5;
  color: #333;
  border: 1px solid #e5e7eb;
}

/* Habits grid */
.habits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.habit-item {
  display: block;
}

/* Check type card */
.check-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(79, 111, 95, 0.08), rgba(212, 237, 218, 0.1));
  border-radius: 12px;
  text-align: center;
}

.check-status {
  font-size: 48px;
  color: var(--text-muted);
  transition: all 0.3s ease;
}

.check-status.check-completed {
  color: #28a745;
  transform: scale(1.1);
}

.check-icon {
  display: block;
}

.check-text {
  font-size: 13px;
  font-weight: 600;
}

/* Toast */
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

/* Animation */
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

/* Timer Display */
.timer-display {
  padding: 20px;
  background: linear-gradient(135deg, rgba(79, 111, 95, 0.1), rgba(212, 237, 218, 0.15));
  border-radius: 16px;
}

.timer-value {
  font-size: 56px;
  font-weight: 700;
  font-family: 'Courier New', Courier, monospace;
  color: var(--green-dark);
  letter-spacing: 4px;
  transition: all 0.3s ease;
}

.timer-value.timer-running {
  color: #28a745;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
  
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
</style>
