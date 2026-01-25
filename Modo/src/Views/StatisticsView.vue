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
  :root {
    --bg: #f3f3f1;
    --green-dark: #3f5f4f;
    --green: #4f6f5f;
    --green-light: #dff3e4;
    --card: #466555;
    --text-light: #e9efe9;
    --text-muted: #b9c7bf;
    --danger: #b4554d;
    --radius: 18px;
  }

  * { box-sizing: border-box; }

  body {
    font-family: 'Heebo', sans-serif;
    background: var(--bg);
    color: #1e1e1e;
  }
  .container {
    max-width: 1140px;
    padding: 0px 30px 0px 30px;
    margin: 0 auto;
    padding-top: 30px;
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
<style src="../css/styles.css"></style>