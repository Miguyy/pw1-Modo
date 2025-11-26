<template>
  <div>
    <button @click="navigateToRegister">Register</button>
  </div>
</template>

<script>
export default {
  name: 'LandingPageView',
  methods: {
    navigateToRegister() {
      this.$router.push('/signin')
    },
  },
}
</script>

<style lang="scss" scoped></style>
