<template>
  <div class="login-container">
    <div class="login-form">
      <p class="login-text">Log in to stay on top of your tasks and objectives.</p>

      <input type="email" placeholder="Enter your email address" id="login-email-user" />
      <input type="password" placeholder="Enter your password" id="login-password-user" />

      <button>Login</button>

      <p class="login-register">
        Don't have an account?
        <a
          href="/signin"
          style="
            text-decoration: none;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: bold;
            color: #434343;
          "
          >Sign Up</a
        >
      </p>
    </div>

    <div class="login-image"></div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
}
</script>

<style lang="scss" scoped></style>
<style src="../css/styles.css"></style>
