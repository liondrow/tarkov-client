<template>
  <div id="login">
    <div class="preloader preloader-full" v-show="loading">
      <img src="../assets/images/loader.gif" alt="" width="50px">
    </div>
    <div class="container login-wrapper">
      <h1>Авторизация</h1>
      <form autocomplete="off" @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="idInput" class="form-label">ID</label>
          <input type="text" class="form-control" id="idInput" v-model="user.username" required>
        </div>
        <div class="mb-3">
          <label for="pwdInput" class="form-label">Пароль</label>
          <input type="password" class="form-control" v-model="user.password" id="pwdInput" required>
        </div>
        <button type="submit" class="btn btn-primary tarkov-dark-btn my-3" v-on:click="handleLogin()" :disabled="loading">Войти</button>
        <div class="error-text" v-if="message">
          {{message}}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import User from '../models/userLogin.js';
  export default {
    name: 'Login',
    data() {
      return {
        user: new User('', ''),
        loading: false,
        message: ''
      };
    },
    computed: {
      loggedIn() {
        return this.$store.state.auth.status.loggedIn;
      }
    },
    created() {
      if (this.loggedIn) {
        this.$router.push('/main');
      }
    },
    methods: {
      handleLogin() {
        this.loading = true;
        if (this.user.username && this.user.password) {
          this.$store.dispatch('auth/login', this.user).then(
              () => {
                this.$router.push('/main');
              },
              error => {
                this.loading = false;
                this.message =
                    (error.response && error.response.data.message) ||
                    error.message ||
                    error.toString();
              }
          );
        }
      }
    }
  };
</script>

<style scoped>
  #login {
    position: relative;
    height: 100%;
    overflow: hidden;
    background-image: url("../assets/images/bg-mob.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: rgba(0, 0, 0, 0.73);
    background-blend-mode: multiply;
    color: rgba(255, 255, 255, 0.73);
    text-align: center;
  }
  .login-wrapper {
    position: absolute;
    bottom: 25%;
    padding:2rem;
  }
  label {
    font-weight: bold;
  }

</style>

