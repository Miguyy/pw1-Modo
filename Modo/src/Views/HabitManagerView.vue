<template>
  <NavBar />
  <div class="container py-4">
    <div class="row g-3 align-items-start">
      <div class="col-lg-3">
        <div class="weather-box p-3">
          <Weather />
        </div>
      </div>

      <div class="col-lg-8" style="margin-top: 55px">
        <div class="card p-3 mb-0">
          <form @submit.prevent="handleAdd">
            <div class="row g-2">
              <div class="col-md-6">
                <label>Description</label>
                <input v-model="form.description" class="form-control" required />
              </div>

              <div class="col-md-2">
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

              <div class="col-md-2 text-end d-flex align-items-end">
                <button class="btn btn-primary w-100" type="submit">Create</button>
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

    <section class="container">

      <!-- CALENDAR -->
      <h2 class="section-title">CALENDAR AND PROGRESSION</h2>

      <div class="top-grid">

          <div>
              <div class="calendar-card" id="calendar">
                  <h2 id="monthLabel"></h2>
                  <div class="calendar-nav">
                      <button id="prevMonth">&#10094;</button>
                      <button id="nextMonth">&#10095;</button>
                  </div>

                  <div class="weekdays">
                  <span>M</span><span>T</span><span>W</span>
                  <span>T</span><span>F</span><span>S</span><span>S</span>
                  </div>

                  <div class="calendar-grid" id="calendarGrid"></div>
              </div>
          </div>

        <!-- PROGRESS -->
          <div class="card progress-card">
              <h1 id="current-day"></h1>

              <div class="progress-row">
              <div class="progress-circle">
                  <div class="big">
                      <h1>75%</h1>
                      <h3>Overall Day<br/>Progress</h3>
                  </div>
              </div>

              <div class="badge">
                  <img src="perfectDay.svg" alt="">
                  <div class="big">
                      <h1>20</h1>
                      <h3>Perfect days</h3>
                  </div>
              </div>
              </div>

              <div class="streak">
                  <div class="flame">
                      <img src="Vector.svg" alt="">
                      <h2 class="flame-number">27</h2>
                  </div>

                  <span>STREAK</span>
              </div>
          </div>

      </div>

      <!-- HABITS -->
      <h2 class="section-title">TODAY’S HABITS</h2>

      <div class="habits">

        <div class="habit-card">
          <h4>Exercise</h4>
          <p>100 push ups</p>

          <div class="counter">
            <button>-</button>
            <span>88</span>
            <button>+</button>
          </div>

          <span class="status">Pending</span>
        </div>

        <div class="habit-card">
          <h4>Health</h4>
          <p>Have breakfast</p>

          <div class="checkbox"></div>
          <span class="status">Pending</span>
        </div>

        <div class="habit-card">
          <h4>Reading</h4>
          <p>Read a design article</p>

          <span class="time">⏱ 50 minutes left</span>
          <span class="status">Pending</span>
        </div>

        <div class="habit-card">
          <h4>Work</h4>
          <p>View TSIW projects</p>

          <div class="checkbox"></div>
          <span class="status">Pending</span>
        </div>

      </div>

      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>

    </section>

    <!-- Habits list: full width below -->
    <div class="row mt-4">
      <div v-for="habit in userHabits" :key="habit.id" class="col-md-4 mb-3">
        <div class="card p-3 h-100">
          <div class="d-flex justify-content-between">
            <strong>{{ habit.description }}</strong>
            <small class="text-muted">{{ habit.priority }}</small>
          </div>

          <!-- CHECK TYPE -->
          <div v-if="habit.type === 'check'">
            <div class="form-check my-2">
              <input
                type="checkbox"
                class="form-check-input"
                :checked="habit.current_progress.checked"
                @change="toggleCheck(habit.id)"
              />
              <label class="form-check-label">Completed</label>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-success flex-fill" @click="complete(habit.id)">
                Complete
              </button>
              <button
                class="btn btn-sm btn-outline-danger flex-fill"
                @click="deleteHabit(habit.id)"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- COUNT TYPE -->
          <div v-if="habit.type === 'count'">
            <p class="mt-2 mb-1">
              Current: {{ habit.current_progress.count }} / {{ habit.target_count }}
            </p>

            <div class="d-flex gap-2 mb-2">
              <button class="btn btn-sm btn-danger" @click="decrement(habit.id)">-</button>
              <button class="btn btn-sm btn-success" @click="increment(habit.id)">+</button>
              <button class="btn btn-sm btn-outline-success ms-auto" @click="complete(habit.id)">
                Complete
              </button>
            </div>

            <button class="btn btn-sm btn-outline-danger w-100" @click="deleteHabit(habit.id)">
              Delete
            </button>
          </div>

          <!-- TIME TYPE -->
          <div v-if="habit.type === 'time'">
            <p class="mb-1">
              Time left:
              <strong>{{ habit.remaining_minutes ?? habit.target_minutes ?? 0 }} min</strong>
            </p>

            <div class="progress mb-2">
              <div
                class="progress-bar"
                role="progressbar"
                :style="{ width: timePercent(habit) + '%' }"
              >
                {{ timePercent(habit) }}%
              </div>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary flex-fill" @click="openTimer(habit.id)">
                Open Timer
              </button>
              <button class="btn btn-sm btn-outline-success flex-fill" @click="complete(habit.id)">
                Complete
              </button>
              <button
                class="btn btn-sm btn-outline-danger flex-fill"
                @click="deleteHabit(habit.id)"
              >
                Delete
              </button>
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
          <div class="modal-body">
            <p>Time left: {{ activeRemaining }} min</p>

            <div class="d-flex gap-2">
              <button class="btn btn-primary" @click="startTimerButton">Start / Continue</button>
              <button class="btn btn-secondary" @click="pauseTimerButton">Pause</button>
              <button class="btn btn-success" @click="complete(activeTimerHabit.id)">
                Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHabitStore } from '@/stores/habitStore'
import { useUserStore } from '@/stores/userStore'
import * as bootstrap from 'bootstrap'
import NavBar from '../Components/NavBar.vue'
import Weather from '@/Components/Weather.vue'

const habitStore = useHabitStore()
const userStore = useUserStore()

const form = ref({
  description: '',
  type: 'check',
  priority: 'low',
  target_count: 1,
  increment_value: 1,
  target_minutes: 15,
})

onMounted(() => {
  habitStore.loadFromLocalStorage()
  habitStore.reconcileRunningTimers()
  if (userStore.loadFromLocalStorage) userStore.loadFromLocalStorage()
})

const currentUser = computed(() => userStore.currentUser)
const userHabits = computed(() => {
  if (!currentUser.value) return []
  return habitStore.getHabitsByUser(currentUser.value.id)
})

function handleAdd() {
  if (!currentUser.value) return alert('Please log in first')

  habitStore.addHabit({
    user_id: currentUser.value.id,
    description: form.value.description,
    type: form.value.type,
    priority: form.value.priority,
    target_count: form.value.type === 'count' ? form.value.target_count : null,
    increment_value: form.value.type === 'count' ? form.value.increment_value : 1,
    target_minutes: form.value.type === 'time' ? form.value.target_minutes : null,
  })

  form.value.description = ''
}

function deleteHabit(id) {
  if (confirm('Delete habit?')) habitStore.deleteHabit(id)
}

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

function timePercent(h) {
  if (!h.target_minutes) return 0
  return Math.round(((h.current_progress.minutes || 0) / h.target_minutes) * 100)
}

/* TIMER MODAL */
const timerModalEl = ref(null)
const timerInstance = ref(null)
const activeTimerHabit = ref(null)
const activeRemaining = ref(0)

function openTimer(id) {
  const habit = habitStore.getHabitById(id)
  activeTimerHabit.value = habit
  activeRemaining.value = habit.remaining_minutes ?? habit.target_minutes ?? 0
  if (!timerInstance.value && timerModalEl.value) {
    timerInstance.value = new bootstrap.Modal(timerModalEl.value)
  }
  timerInstance.value.show()
}

function startTimerButton() {
  if (!activeTimerHabit.value) return
  habitStore.startTimer(activeTimerHabit.value.id)
  const h = habitStore.getHabitById(activeTimerHabit.value.id)
  activeRemaining.value = h.remaining_minutes ?? h.target_minutes
}

function pauseTimerButton() {
  if (!activeTimerHabit.value) return
  habitStore.pauseTimer(activeTimerHabit.value.id)
  activeRemaining.value = habitStore.getHabitById(activeTimerHabit.value.id).remaining_minutes ?? 0
}

function onCloseTimerModal() {
  if (activeTimerHabit.value) {
    habitStore.pauseTimer(activeTimerHabit.value.id)
    activeTimerHabit.value = null
  }
}


// Linda code


const grid = document.getElementById('calendarGrid')
const monthLabel = document.getElementById('monthLabel')
const prevBtn = document.getElementById('prevMonth')
const nextBtn = document.getElementById('nextMonth')
const calendar = document.getElementById('calendar')


let currentDate = new Date()
let selectedDay = null

function renderCalendar() {
grid.innerHTML = ''

const year = currentDate.getFullYear()
const month = currentDate.getMonth()

monthLabel.textContent = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })

const firstDay = new Date(year, month, 1)
const startDay = (firstDay.getDay() + 6) % 7
const daysInMonth = new Date(year, month + 1, 0).getDate()
const prevMonthDays = new Date(year, month, 0).getDate()

// Previous month
for (let i = startDay - 1; i >= 0; i--) {
    const d = document.createElement('div')
    d.className = 'day muted'
    d.textContent = prevMonthDays - i
    grid.appendChild(d)
}

// Current month
for (let i = 1; i <= daysInMonth; i++) {
    const d = document.createElement('div')
    d.className = 'day'
    d.textContent = i

    if (
    i === new Date().getDate() &&
    month === new Date().getMonth() &&
    year === new Date().getFullYear()
    ) {
    d.classList.add('active')
    }

    d.addEventListener('click', () => {
    document.querySelectorAll('.day').forEach(el => el.classList.remove('selected'))
    d.classList.add('selected')
    selectedDay = i
    })

    grid.appendChild(d)
}

// Next month
const totalCells = grid.children.length
for (let i = 1; totalCells + i <= 42; i++) {
    const d = document.createElement('div')
    d.className = 'day muted'
    d.textContent = i
    grid.appendChild(d)
}
}

prevBtn.onclick = () => {
currentDate.setMonth(currentDate.getMonth() - 1)
renderCalendar()
}

nextBtn.onclick = () => {
currentDate.setMonth(currentDate.getMonth() + 1)
renderCalendar()
}

renderCalendar()

// Exibe the current day

const h1 = document.getElementById("current-day");

const today = new Date();

const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

const month = months[today.getMonth()];
const day = today.getDate();

h1.textContent = `${month} ${day}`;

</script>

<style scoped>
.weather-box {
  background: #355d4c;
  color: #fff;
  border-radius: 10px;
  min-height: 160px;
  margin-top: 40px;
}

.weather-box input {
  background: rgba(255, 255, 255, 0.95);
  color: #000;
  border-radius: 8px;
  padding: 6px 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-bottom: 8px;
  box-sizing: border-box;
}

.weather-box button {
  background: #f19640;
  border: none;
  color: #fff;
}

.card.p-3.mb-0 {
  min-height: 120px;
}

.card.p-3.h-100 {
  border-radius: 10px;
}

  :root {
  --green-dark: #3f5a4c;
  --green-light: #dff3e7;
  --purple: #a98ecb;
  --bg: #f4f5f3;
  }

  body {
      margin: 0;
      background: var(--bg);
      font-family: 'Heebo', sans-serif;
      color: #1f2d27;
  }

  .container {
      max-width: 1200px;
      margin: 40px auto;
      padding: 0 20px;
  }

  .section-title {
      letter-spacing: 4px;
      font-size: 14px;
      margin: 40px 0 20px;
      color: var(--green-dark);
  }

  /* ---------- TOP GRID ---------- */

  .top-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
  }

  .card {
      background: white;
      border-radius: 14px;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,.08);
  }

  /* ---------- CALENDAR ---------- */

  .calendar-card {
      width: 460px;
      background: #f9faf8;
      border-radius: 22px;
      padding: 32px;
      box-shadow: 0 30px 60px rgba(0,0,0,.15);
      touch-action: pan-y;
  }

  .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      margin-top: 24px;
      text-align: center;
      font-weight: 600;
  }

  .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      margin-top: 10px;
  }

  .day {
      height: 60px;
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      user-select: none;
  }

  .day.muted {
      color: #9aa7a0;
      background: #f0f0f0;
  }

  .day.active {
      background: var(--green);
      color: white;
  }

  .day.selected {
      outline: 3px solid var(--green);
  }

  /* ---------- PROGRESS ---------- */

  .progress-card h1 {
      text-align: center;
      margin-bottom: 20px;
  }

  .progress-row {
      padding-top: 30px;
      display: flex;
      justify-content: space-around;
      align-items: center;
  }

  .progress-circle {
      width: 200px;
      height: 200px;
      background: rgba(169,142,203,.5);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
  }

  .badge {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
  }

  .big {
      flex-direction: row;
      position: absolute;
      text-align: center;
  }

  .big h1 {
      margin-bottom: 0px;
      margin-top: 10px;
  }

  .big h3 {
      margin-top: 0px;
  }

  .streak {
      margin-top: 20px;
      text-align: center;
  }

  .flame {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
  }

  .flame img {
      height: 100px;
  }

  .flame-number {
      font-size: 30px;
      position: absolute;
      padding-top: 30px;
  }

  /* ---------- HABITS ---------- */

  .habits {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
  }

  .habit-card {
      background: var(--green-dark);
      color: white;
      border-radius: 14px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
  }

  .counter {
      display: flex;
      align-items: center;
      gap: 10px;
  }

  .counter button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: none;
  }

  .checkbox {
      width: 24px;
      height: 24px;
      border: 2px solid white;
      border-radius: 50%;
  }

  .status {
      opacity: 0.8;
      font-size: 14px;
  }

  /* ---------- PROGRESS BAR ---------- */

  .progress-bar {
      margin-top: 30px;
      height: 10px;
      background: #cfe6da;
      border-radius: 10px;
  }

  .progress-fill {
      width: 40%;
      height: 100%;
      background: var(--green-dark);
      border-radius: 10px;
  }
</style>
