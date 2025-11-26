<template>
  <div class="register-container">
    <div class="register-form">
      <p class="register-text">Sign up to build better habits and achieve your objectives.</p>

      <input type="text" placeholder="Enter your username" id="reg-name-user" />
      <input type="email" placeholder="Enter your email address" id="reg-email-user" />
      <input type="password" placeholder="Enter your password" id="reg-password-user" />

      <button>Sign In</button>

      <p class="register-login">
        Already have an account?
        <a
          href="/login"
          style="
            text-decoration: none;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: bold;
            color: #434343;
          "
          >Login</a
        >
      </p>
    </div>

    <div class="register-image"></div>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
}
</script>

<style lang="scss" scoped></style>
<style src="../css/styles.css"></style>
