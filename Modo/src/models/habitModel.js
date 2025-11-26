// src/models/Habit.js
export default class Habit {
  constructor({
    id = Date.now(),
    user_id = null,
    type = "check", // "time" | "count" | "check"
    description = "",
    category = "",
    priority = "low", // "low" | "medium" | "high"
    repeat = { frequency: "daily", days: [] },

    // time
    target_minutes = null,
    remaining_minutes = null,
    timer_last_started_at = null, // timestamp in ms

    // count
    target_count = null,
    increment_value = 1,

    // progress
    current_progress = null,
    completed = false,

    created_at = new Date()
  } = {}) {
    this.id = Number(id);
    this.user_id = Number(user_id);
    this.type = type;
    this.description = description;
    this.category = category;
    this.priority = priority;
    this.repeat = repeat;

    // time
    this.target_minutes = target_minutes;
    this.remaining_minutes =
      remaining_minutes !== null && remaining_minutes !== undefined
        ? remaining_minutes
        : target_minutes;

    this.timer_last_started_at = timer_last_started_at; // null or timestamp

    // count
    this.target_count = target_count;
    this.increment_value = increment_value ?? 1;

    // progress
    this.current_progress = current_progress ?? this.defaultProgress();
    this.completed = !!completed;

    this.created_at = created_at ? new Date(created_at) : new Date(created_at);
  }

  defaultProgress() {
    if (this.type === "time") return { minutes: 0 };
    if (this.type === "count") return { count: 0 };
    if (this.type === "check") return { checked: false };
    return {};
  }

  // helper para serializar antes de guardar (opcional)
  toJSON() {
    return {
      ...this,
      created_at: this.created_at ? this.created_at.toISOString() : null
    };
  }
}
