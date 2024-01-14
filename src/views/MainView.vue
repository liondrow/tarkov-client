<template>
  <div id="login">
    <div class="container login-wrapper">
      <h1>Главный экран</h1>
      <button type="submit" class="btn btn-primary tarkov-dark-btn my-3" v-on:click="logout()" >Выйти</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('auth/logout', this.user).then(
          () => {
            this.$router.push('/login');
          });
    }
  }
};
</script>

<style scoped>

</style>
