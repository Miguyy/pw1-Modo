<!-- src/views/HabitManagerView.vue -->
<template>
  <div class="container py-4">
    <h2 class="mb-4">Gestão de Hábitos</h2>

    <!-- FORMULARIO SIMPLES DE CRIAÇÃO -->
    <div class="card p-3 mb-4">
      <form @submit.prevent="handleAdd">
        <div class="row g-2">
          <div class="col-md-6">
            <input v-model="form.description" class="form-control" placeholder="Descrição" required />
          </div>

          <div class="col-md-2">
            <select v-model="form.type" class="form-select">
              <option value="check">Check</option>
              <option value="count">Count</option>
              <option value="time">Time</option>
            </select>
          </div>

          <div class="col-md-2">
            <select v-model="form.priority" class="form-select">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="col-md-2 text-end">
            <button class="btn btn-primary">Adicionar</button>
          </div>

          <!-- conditional fields -->
          <div v-if="form.type === 'count'" class="col-12 mt-2">
            <div class="row g-2">
              <div class="col-md-6">
                <input type="number" v-model.number="form.target_count" class="form-control" placeholder="Objetivo (ex: 8)" />
              </div>
              <div class="col-md-6">
                <input type="number" v-model.number="form.increment_value" class="form-control" placeholder="Increment (default 1)" />
              </div>
            </div>
          </div>

          <div v-if="form.type === 'time'" class="col-12 mt-2">
            <div class="row g-2">
              <div class="col-md-6">
                <input type="number" v-model.number="form.target_minutes" class="form-control" placeholder="Minutos alvo (ex: 15)" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- LISTA -->
    <div class="row">
      <div v-for="habit in userHabits" :key="habit.id" class="col-md-4 mb-3">
        <div class="card p-3 h-100">
          <div class="d-flex justify-content-between">
            <strong>{{ habit.description }}</strong>
            <small class="text-muted">{{ habit.priority }}</small>
          </div>

          <p class="text-muted mb-2">{{ habit.category }}</p>

          <!-- TYPE: time -->
          <div v-if="habit.type === 'time'">
            <div class="mb-2">
              <small>{{ habit.remaining_minutes ?? habit.target_minutes ?? 0 }} min restantes</small>
            </div>
            <div class="progress mb-2">
              <div class="progress-bar" role="progressbar" :style="{ width: timePercent(habit) + '%' }">
                {{ timePercent(habit) }}%
              </div>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary flex-fill" @click="openTimer(habit)">Abrir Temporizador</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteHabit(habit.id)">Apagar</button>
            </div>
          </div>

          <!-- TYPE: count -->
          <div v-if="habit.type === 'count'">
            <div class="mb-2">Atual: {{ habit.current_progress.count }} / {{ habit.target_count }}</div>
            <div class="d-flex gap-2 mb-2">
              <button class="btn btn-sm btn-danger" @click="decrement(habit)">-</button>
              <button class="btn btn-sm btn-success" @click="increment(habit)">+</button>
              <button class="btn btn-sm btn-outline-secondary ms-auto" @click="complete(habit)">Completar</button>
            </div>
            <button class="btn btn-sm btn-outline-danger w-100 mt-1" @click="deleteHabit(habit.id)">Apagar</button>
          </div>

          <!-- TYPE: check -->
          <div v-if="habit.type === 'check'">
            <div class="form-check mb-2">
              <input class="form-check-input" type="checkbox" :checked="habit.current_progress.checked" @change="toggleCheck(habit)" />
              <label class="form-check-label">Concluído</label>
            </div>
            <button class="btn btn-sm btn-outline-danger w-100" @click="deleteHabit(habit.id)">Apagar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Simple Timer Modal (Bootstrap) -->
    <div class="modal fade" id="timerModal" tabindex="-1" aria-hidden="true" ref="timerModalEl">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Temporizador - {{ activeTimerHabit?.description }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="onCloseTimerModal"></button>
          </div>
          <div class="modal-body">
            <p>Tempo restante: {{ activeRemaining }} min</p>
            <div class="d-flex gap-2">
              <button class="btn btn-primary" @click="startTimerButton">Iniciar / Continuar</button>
              <button class="btn btn-secondary" @click="pauseTimerButton">Pausar</button>
              <button class="btn btn-success" @click="complete(activeTimerHabit)">Completar</button>
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

const habitStore = useHabitStore();
const userStore = useUserStore();

const form = ref({
  description: "",
  type: "check",
  priority: "low",
  category: "",
  // count fields
  target_count: 1,
  increment_value: 1,
  // time fields
  target_minutes: 15
});

onMounted(() => {
  // garantir que os dados são carregados
  habitStore.loadFromLocalStorage();
  habitStore.reconcileRunningTimers();
  if (userStore.loadFromLocalStorage) userStore.loadFromLocalStorage();
});

// current user
const currentUser = computed(() => userStore.currentUser);
const userHabits = computed(() => {
  if (!currentUser.value) return [];
  return habitStore.getHabitsByUser(currentUser.value.id);
});

// handlers
function handleAdd() {
  if (!currentUser.value) {
    alert("Inicia sessão primeiro.");
    return;
  }
  const payload = {
    user_id: currentUser.value.id,
    description: form.value.description,
    type: form.value.type,
    priority: form.value.priority,
    category: form.value.category,
    target_count: form.value.type === "count" ? form.value.target_count : null,
    increment_value: form.value.type === "count" ? form.value.increment_value : 1,
    target_minutes: form.value.type === "time" ? form.value.target_minutes : null
  };
  habitStore.addHabit(payload);
  // reset simple
  form.value.description = "";
}

function deleteHabit(id) {
  if (!confirm("Apagar hábito?")) return;
  habitStore.deleteHabit(id);
}

function increment(h) { habitStore.incrementCount(h.id); }
function decrement(h) { habitStore.decrementCount(h.id); }
function toggleCheck(h) { habitStore.toggleCheck(h.id); }
function complete(h) { habitStore.completeHabit(h.id); }

function timePercent(h) {
  if (!h.target_minutes) return 0;
  return Math.round(((h.current_progress.minutes || 0) / h.target_minutes) * 100);
}

// --- Temporizador modal minimal ---
import * as bootstrap from "bootstrap";
const timerModalEl = ref(null);
const timerInstance = ref(null);
const activeTimerHabit = ref(null);
const activeRemaining = ref(0);

function openTimer(habit) {
  activeTimerHabit.value = habit;
  activeRemaining.value = habit.remaining_minutes ?? habit.target_minutes ?? 0;
  // open bootstrap modal
  if (!timerInstance.value && timerModalEl.value) {
    timerInstance.value = new bootstrap.Modal(timerModalEl.value);
  }
  timerInstance.value?.show();
}

function startTimerButton() {
  if (!activeTimerHabit.value) return;
  habitStore.startTimer(activeTimerHabit.value.id);
  // update displayed remaining (simple)
  activeRemaining.value = habitStore.getHabitById(activeTimerHabit.value.id).remaining_minutes ?? activeTimerHabit.value.target_minutes;
}

function pauseTimerButton() {
  if (!activeTimerHabit.value) return;
  habitStore.pauseTimer(activeTimerHabit.value.id);
  activeRemaining.value = habitStore.getHabitById(activeTimerHabit.value.id).remaining_minutes ?? 0;
}

function onCloseTimerModal() {
  // when closing modal, pause timer to persist progress
  if (activeTimerHabit.value) {
    habitStore.pauseTimer(activeTimerHabit.value.id);
    activeTimerHabit.value = null;
  }
}
</script>

<style scoped>
.card { border-radius: 10px; }
</style>
