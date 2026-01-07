<template>
  <div class="weather">
    <!-- <input v-model="city" placeholder="City" />
    <input v-model="country" placeholder="Country code (PT)" /> -->
    <button class="refresh-btn" @click="loadWeather" aria-label="Refresh weather">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0114.13-3.36L23 10"></path>
        <path d="M20.49 15a9 9 0 01-14.13 3.36L1 14"></path>
      </svg>
    </button>

    <p v-if="weatherStore.loading">Loading...</p>
    <p v-if="weatherStore.error">{{ weatherStore.error }}</p>

    <div v-if="weatherStore.weatherData" style="text-align: center">
      <h3>{{ weatherStore.weatherData.name }}</h3>
      <img :src="iconUrl" alt="weather icon" />
      <p>{{ weatherStore.weatherData.weather[0].description }} — {{ isDay ? 'Day' : 'Night' }}</p>
      <p>🌡 {{ weatherStore.weatherData.main.temp }} °C</p>
      <p>💨 {{ weatherStore.weatherData.wind.speed }} m/s</p>
    </div>
  </div>
</template>

<script>
import { useOpenWeatherApiStore } from '@/stores/openWeatherApiStore'

export default {
  name: 'WeatherView',

  data() {
    return {
      city: 'Vila do Conde',
      country: 'PT',
    }
  },

  computed: {
    weatherStore() {
      return useOpenWeatherApiStore()
    },
    isDay() {
      if (!this.weatherStore.weatherData) return false
      return this.weatherStore.weatherData.weather[0].icon.endsWith('d')
    },
    iconUrl() {
      if (!this.weatherStore.weatherData) return ''
      const icon = this.weatherStore.weatherData.weather[0].icon
      return `https://openweathermap.org/img/wn/${icon}@2x.png`
    },
  },

  methods: {
    loadWeather() {
      this.weatherStore.fetchCurrentWeather(this.city, this.country)
    },
  },

  mounted() {
    this.loadWeather()
  },
}
</script>
<style scoped>
.refresh-btn {
  background: transparent;
  border: none;
  color: inherit;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.weather img {
  max-width: 80px;
  height: auto;
  display: block;
  margin: 8px auto;
}
</style>
