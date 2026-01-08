<template>
  <div style="height: 260px">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import { useHabitStore } from '@/stores/habitStore'
import { useUserStore } from '@/stores/userStore'

const canvas = ref(null)
let chart = null
const habitStore = useHabitStore()
const userStore = useUserStore()

function counts() {
  const user = userStore.currentUser
  if (!user) return [0, 0]
  const list = habitStore.getHabitsByUser(user.id) || []
  const completed = list.filter((h) => !!h.completed).length
  const notCompleted = list.length - completed
  return [notCompleted, completed]
}

function createChart() {
  const ctx = canvas.value.getContext('2d')
  const data = counts()
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Not completed', 'Completed'],
      datasets: [
        {
          data,
          backgroundColor: ['#FCAB92', '#A4BD84'],
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  })
}

onMounted(() => {
  createChart()
})

// update when habits or currentUser change
watch(
  () => [userStore.currentUser, habitStore.habits.length],
  () => {
    const data = counts()
    if (chart) {
      chart.data.datasets[0].data = data
      chart.update()
    }
  },
  { deep: true },
)

onBeforeUnmount(() => {
  if (chart) chart.destroy()
})
</script>
