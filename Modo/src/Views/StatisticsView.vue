<template>
  <NavBar />

  <div class="container">
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

<style>
  .container {
    max-width: 1080px;
    margin: 0 auto;
    padding: 30px 0px 0px;
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
