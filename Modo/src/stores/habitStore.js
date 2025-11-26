// src/stores/habitStore.js
import { defineStore } from "pinia";
import Habit from "@/models/habitModel";
import { useUserStore } from "@/stores/userStore";

const LOCAL_KEY = "habits_v1";

// pontos por prioridade (gamificação)
export const PRIORITY_POINTS = {
  low: 5,
  medium: 10,
  high: 15
};

export const useHabitStore = defineStore("habitStore", {
  state: () => ({
    habits: []
  }),

  getters: {
    getHabitsByUser: (state) => (user_id) =>
      state.habits.filter((h) => Number(h.user_id) === Number(user_id)),

    getHabitById: (state) => (id) =>
      state.habits.find((h) => Number(h.id) === Number(id))
  },

  actions: {
    // ----- Persistência -----
    loadFromLocalStorage() {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return;
      try {
        const arr = JSON.parse(raw);
        // reconstruir instâncias Habit
        this.habits = arr.map((o) => new Habit(o));
      } catch (e) {
        console.error("Failed to load habits:", e);
      }
    },

    saveToLocalStorage() {
      // converte em JSON (habit.toJSON trata created_at)
      const serial = JSON.stringify(this.habits.map((h) => h.toJSON ? h.toJSON() : h));
      localStorage.setItem(LOCAL_KEY, serial);
    },

    // ----- CRUD -----
    addHabit(habitData) {
      const h = new Habit({
        ...habitData,
        id: Date.now()
      });
      this.habits.push(h);
      this.saveToLocalStorage();
      return h;
    },

    updateHabit(id, updatedData) {
      const index = this.habits.findIndex((h) => Number(h.id) === Number(id));
      if (index === -1) return null;
      // merge then reconstruct
      const merged = { ...this.habits[index], ...updatedData };
      this.habits[index] = new Habit(merged);
      this.saveToLocalStorage();
      return this.habits[index];
    },

    deleteHabit(id) {
      this.habits = this.habits.filter((h) => Number(h.id) !== Number(id));
      this.saveToLocalStorage();
    },

    // ----- Tracking / Progress -----
    // CHECK
    toggleCheck(id) {
      const habit = this.getHabitById(id);
      if (!habit || habit.type !== "check") return;
      habit.current_progress.checked = !habit.current_progress.checked;
      habit.completed = !!habit.current_progress.checked;
      this.saveToLocalStorage();

      if (habit.completed) this._awardPointsFor(habit);
    },

    // COUNT
    incrementCount(id) {
      const habit = this.getHabitById(id);
      if (!habit || habit.type !== "count") return;
      habit.current_progress.count += habit.increment_value;
      if (habit.target_count && habit.current_progress.count >= habit.target_count) {
        habit.current_progress.count = habit.target_count;
        habit.completed = true;
        this._awardPointsFor(habit);
      }
      this.saveToLocalStorage();
    },

    decrementCount(id) {
      const habit = this.getHabitById(id);
      if (!habit || habit.type !== "count") return;
      habit.current_progress.count -= habit.increment_value;
      if (habit.current_progress.count <= 0) habit.current_progress.count = 0;
      // if previously completed, uncomplete if below target
      if (habit.target_count && habit.current_progress.count < habit.target_count) {
        habit.completed = false;
      }
      this.saveToLocalStorage();
    },

    // TIME: start timer — guarda timestamp do início
    startTimer(id) {
      const habit = this.getHabitById(id);
      if (!habit || habit.type !== "time") return;
      // se já completado não começar
      if (habit.completed) return;
      habit.timer_last_started_at = Date.now();
      // if remaining_minutes is undefined but target exists, ensure it's set
      if (habit.remaining_minutes == null && habit.target_minutes != null) {
        habit.remaining_minutes = habit.target_minutes;
      }
      this.saveToLocalStorage();
    },

    // pause timer — calcula tempo passado desde timer_last_started_at e atualiza progress
    pauseTimer(id) {
      const habit = this.getHabitById(id);
      if (!habit || habit.type !== "time") return;
      if (!habit.timer_last_started_at) return;
      const now = Date.now();
      const elapsedMs = now - habit.timer_last_started_at;
      const elapsedMin = Math.floor(elapsedMs / 60000); // minutos completos
      if (elapsedMin > 0) {
        habit.current_progress.minutes += elapsedMin;
        habit.remaining_minutes =
          (habit.target_minutes ?? 0) - habit.current_progress.minutes;
        if (habit.remaining_minutes <= 0) {
          habit.remaining_minutes = 0;
          habit.completed = true;
          this._awardPointsFor(habit);
        }
      }
      // clear last started timestamp (we store remaining_minutes for resume)
      habit.timer_last_started_at = null;
      this.saveToLocalStorage();
    },

    // resumeTimer just sets timer_last_started_at again (startTimer covers)
    resumeTimer(id) {
      this.startTimer(id);
    },

    // if user closes app while timer running, call this to reconcile on load
    reconcileRunningTimers() {
      const now = Date.now();
      this.habits.forEach((habit) => {
        if (habit.type === "time" && habit.timer_last_started_at) {
          const elapsedMs = now - habit.timer_last_started_at;
          const elapsedMin = Math.floor(elapsedMs / 60000);
          if (elapsedMin > 0) {
            habit.current_progress.minutes += elapsedMin;
            habit.remaining_minutes =
              (habit.target_minutes ?? 0) - habit.current_progress.minutes;
            if (habit.remaining_minutes <= 0) {
              habit.remaining_minutes = 0;
              habit.completed = true;
              this._awardPointsFor(habit);
            } else {
              // adjust timer_last_started_at so next reconcile counts from now
              habit.timer_last_started_at = now;
            }
          }
        }
      });
      this.saveToLocalStorage();
    },

    // Reset diário para todos (chamada manual ou ao iniciar novo dia)
    resetDailyForUser(user_id) {
      const list = this.getHabitsByUser(user_id);
      list.forEach((h) => {
        h.current_progress = h.defaultProgress();
        h.completed = false;
        if (h.type === "time") h.remaining_minutes = h.target_minutes;
        h.timer_last_started_at = null;
      });
      this.saveToLocalStorage();
    },

    // ----- Gamificação: quando um hábito é completado -----
    _awardPointsFor(habit) {
      try {
        const userStore = useUserStore();
        const uid = Number(habit.user_id);
        if (!uid) return;
        const user = userStore.getUserById ? userStore.getUserById(uid) : userStore.users.find(u => u.id === uid);
        if (!user) return;
        const points = PRIORITY_POINTS[habit.priority] ?? PRIORITY_POINTS.low;
        // atualiza pontos do user (se usar getter currentUser, acha por id)
        // assumimos userStore tem updateUser / saveToLocalStorage
        user.points = (Number(user.points) || 0) + points;
        // garante persistência através da store
        if (userStore.saveToLocalStorage) userStore.saveToLocalStorage();
      } catch (e) {
        console.error("Erro ao atribuir pontos:", e);
      }
    },

    // explicit completion (marca e dá pontos)
    completeHabit(id) {
      const habit = this.getHabitById(id);
      if (!habit) return;
      habit.completed = true;
      if (habit.type === "count" && habit.target_count) {
        habit.current_progress.count = habit.target_count;
      }
      if (habit.type === "time" && habit.target_minutes) {
        habit.current_progress.minutes = habit.target_minutes;
        habit.remaining_minutes = 0;
        habit.timer_last_started_at = null;
      }
      this.saveToLocalStorage();
      this._awardPointsFor(habit);
    }
  }
});
