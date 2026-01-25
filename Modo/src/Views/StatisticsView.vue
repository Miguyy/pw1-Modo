<template>
  <NavBar />

  <div class="container py-4">
    <div class="page-title">
      <h2>STATISTICS</h2>
    </div>
    <HabitStatsChart />
  </div>
</template>

<script setup>
import NavBar from '@/Components/NavBar.vue'
import HabitStatsChart from '@/Components/HabitStatsChart.vue'
</script>

<style scoped></style>
