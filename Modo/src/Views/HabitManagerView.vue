<!-- src/views/HabitManagerView.vue -->
<template>
  <div class="container py-4">
    <h2 class="mb-4">Habit Manager</h2>

    <!-- CREATE FORM -->
    <div class="card p-3 mb-4">
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

          <div class="col-md-2 text-end">
            <button class="btn btn-primary">Create</button>
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
                <input type="number" v-model.number="form.increment_value" class="form-control" />
              </div>
            </div>
          </div>

          <!-- TIME EXTRA FIELDS -->
          <div v-if="form.type === 'time'" class="col-12 mt-2">
            <div class="row g-2">
              <div class="col-md-6">
                <label>Target Minutes</label>
                <input type="number" v-model.number="form.target_minutes" class="form-control" />
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>

    <!-- HABIT LIST -->
    <div class="row">
      <div v-for="habit in userHabits" :key="habit.id" class="col-md-4 mb-3">
        <div class="card p-3 h-100">

          <div class="d-flex justify-content-between">
            <strong>{{ habit.description }}</strong>
            <small class="text-muted">{{ habit.priority }}</small>
          </div>

          <!-- CHECK TYPE -->
          <div v-if="habit.type === 'check'">
            <div class="form-check my-2">
              <input type="checkbox"
                     class="form-check-input"
                     :checked="habit.current_progress.checked"
                     @change="toggleCheck(habit.id)" />
              <label class="form-check-label">Completed</label>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-success flex-fill" @click="complete(habit.id)">Complete</button>
              <button class="btn btn-sm btn-outline-danger flex-fill" @click="deleteHabit(habit.id)">Delete</button>
            </div>
          </div>

          <!-- COUNT TYPE -->
          <div v-if="habit.type === 'count'">
            <p class="mt-2 mb-1">Current: {{ habit.current_progress.count }} / {{ habit.target_count }}</p>

            <div class="d-flex gap-2 mb-2">
              <button class="btn btn-sm btn-danger" @click="decrement(habit.id)">-</button>
              <button class="btn btn-sm btn-success" @click="increment(habit.id)">+</button>
              <button class="btn btn-sm btn-outline-success ms-auto" @click="complete(habit.id)">Complete</button>
            </div>

            <button class="btn btn-sm btn-outline-danger w-100" @click="deleteHabit(habit.id)">Delete</button>
          </div>

          <!-- TIME TYPE -->
          <div v-if="habit.type === 'time'">
            <p class="mb-1">
              Time left:
              <strong>{{ habit.remaining_minutes ?? habit.target_minutes ?? 0 }} min</strong>
            </p>

            <div class="progress mb-2">
              <div class="progress-bar"
                   role="progressbar"
                   :style="{ width: timePercent(habit) + '%' }">
                {{ timePercent(habit) }}%
              </div>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary flex-fill" @click="openTimer(habit.id)">Open Timer</button>
              <button class="btn btn-sm btn-outline-success flex-fill" @click="complete(habit.id)">Complete</button>
              <button class="btn btn-sm btn-outline-danger flex-fill" @click="deleteHabit(habit.id)">Delete</button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- TIMER MODAL -->
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
              <button class="btn btn-success" @click="complete(activeTimerHabit.id)">Complete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>



<script setup>
import { ref, computed, onMounted } from "vue";
import { useHabitStore } from "@/stores/habitStore";
import { useUserStore } from "@/stores/userStore";
import * as bootstrap from "bootstrap";

const habitStore = useHabitStore();
const userStore = useUserStore();

/* -------------------------
   FORM MODEL
-------------------------- */
const form = ref({
  description: "",
  type: "check",
  priority: "low",
  target_count: 1,
  increment_value: 1,
  target_minutes: 15,
});

/* -------------------------
   LOAD DATA ON MOUNT
-------------------------- */
onMounted(() => {
  habitStore.loadFromLocalStorage();
  habitStore.reconcileRunningTimers();
  if (userStore.loadFromLocalStorage) userStore.loadFromLocalStorage();
});

const currentUser = computed(() => userStore.currentUser);
const userHabits = computed(() => {
  if (!currentUser.value) return [];
  return habitStore.getHabitsByUser(currentUser.value.id);
});

/* -------------------------
   HANDLERS (USAR SEMPRE IDs)
-------------------------- */
function handleAdd() {
  if (!currentUser.value) return alert("Please log in first");

  habitStore.addHabit({
    user_id: currentUser.value.id,
    description: form.value.description,
    type: form.value.type,
    priority: form.value.priority,
    target_count: form.value.type === "count" ? form.value.target_count : null,
    increment_value: form.value.type === "count" ? form.value.increment_value : 1,
    target_minutes: form.value.type === "time" ? form.value.target_minutes : null,
  });

  form.value.description = "";
}

function deleteHabit(id) {
  if (confirm("Delete habit?")) habitStore.deleteHabit(id);
}

function increment(id) { habitStore.incrementCount(id); }
function decrement(id) { habitStore.decrementCount(id); }
function toggleCheck(id) { habitStore.toggleCheck(id); }
function complete(id) { habitStore.completeHabit(id); }

function timePercent(h) {
  if (!h.target_minutes) return 0;
  return Math.round(((h.current_progress.minutes || 0) / h.target_minutes) * 100);
}

/* -------------------------
   TIMER MODAL
-------------------------- */
const timerModalEl = ref(null);
const timerInstance = ref(null);
const activeTimerHabit = ref(null);
const activeRemaining = ref(0);

function openTimer(id) {
  const habit = habitStore.getHabitById(id);

  activeTimerHabit.value = habit;
  activeRemaining.value = habit.remaining_minutes ?? habit.target_minutes ?? 0;

  if (!timerInstance.value && timerModalEl.value) {
    timerInstance.value = new bootstrap.Modal(timerModalEl.value);
  }
  timerInstance.value.show();
}

function startTimerButton() {
  if (!activeTimerHabit.value) return;

  habitStore.startTimer(activeTimerHabit.value.id);
  const h = habitStore.getHabitById(activeTimerHabit.value.id);
  activeRemaining.value = h.remaining_minutes ?? h.target_minutes;
}

function pauseTimerButton() {
  if (!activeTimerHabit.value) return;

  habitStore.pauseTimer(activeTimerHabit.value.id);
  activeRemaining.value =
    habitStore.getHabitById(activeTimerHabit.value.id).remaining_minutes ?? 0;
}

function onCloseTimerModal() {
  if (activeTimerHabit.value) {
    habitStore.pauseTimer(activeTimerHabit.value.id);
    activeTimerHabit.value = null;
  }
}
</script>

<style scoped>
.card {
  border-radius: 10px;
}
</style>
