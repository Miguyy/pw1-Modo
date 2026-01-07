export default class Habit {
  constructor({
    id = Date.now(),
    user_id = null,
    type = 'check', // "time" | "count" | "check"
    description = '',
    category = '',
    priority = 'low',
    repeat = { frequency: 'daily', days: [] },

    // time
    target_minutes = null,
    remaining_minutes = null,
    timer_last_started_at = null,

    // count
    target_count = null,
    increment_value = 1,

    // progress
    current_progress = null,
    completed = false,

    created_at = null,
  } = {}) {
    // Preserve IDs exactly as provided (mock server uses strings)
    this.id = id
    this.user_id = user_id

    this.type = type
    this.description = description
    this.category = category
    this.priority = priority
    this.repeat = repeat

    // time fields (normalize numeric where relevant)
    this.target_minutes =
      target_minutes !== null && target_minutes !== undefined ? Number(target_minutes) : null

    this.remaining_minutes =
      remaining_minutes !== null && remaining_minutes !== undefined
        ? Number(remaining_minutes)
        : this.target_minutes

    this.timer_last_started_at = timer_last_started_at

    // count fields
    this.target_count =
      target_count !== null && target_count !== undefined ? Number(target_count) : null
    this.increment_value = increment_value ?? 1

    // progress
    this.current_progress = current_progress ?? this.defaultProgress()
    this.completed = !!completed

    this.created_at = created_at ? new Date(created_at) : new Date()
  }

  defaultProgress() {
    if (this.type === 'time') return { minutes: 0 }
    if (this.type === 'count') return { count: 0 }
    if (this.type === 'check') return { checked: false }
    return {}
  }

  toJSON() {
    return {
      ...this,
      created_at: this.created_at ? this.created_at.toISOString() : null,
    }
  }
}
