<template>
  <div id="main-screen">
    <div class="preloader preloader-full" v-show="loading">
      <img src="../assets/images/loader.gif" alt="" width="50px">
    </div>
    <div class="container">
      <div class="wallet-wrapper my-5" >
        <router-link to="wallet">
          <i class="fa-solid fa-ruble-sign"></i> {{ wallet }}
        </router-link>

      </div>
      <ul class="col p-0 nav-list">
        <li>
          <router-link to="quests">
            Квесты
          </router-link>
        </li>
        <li>
          <router-link to="wallet">
            Кошелек
          </router-link>
        </li>
       <li>
         <router-link to="profile">
           Барахолка
         </router-link>
       </li>
        <li>
          <router-link to="profile">
            Убежище
          </router-link>
        </li>
        <li>
          <a href="#" v-on:click="logout()">Выход</a>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
import API from "@/services/api.js";
export default {
  name: "Main",
  data() {
    return {
      wallet: 0,
      loading: false
    };
  },
  mounted() {
    this.loading = true;
    API.get('wallet')
        .then((response) => {
          this.wallet = response.data
          this.loading = false
        })
  },
  methods: {
    logout() {
      this.loading = true;
      this.$store.dispatch('auth/logout', this.user).then(
          () => {
            this.loading = false
            this.$router.push('/login');
          });
    }
  }
};
</script>

<style scoped>
  #main-screen {
    position: relative;
    color: rgba(255, 255, 255, 0.73);
    overflow: hidden;
  }
  .wallet-wrapper {
    font-size:2rem;
    text-align: right;
    padding-right: 2rem;
  }
  .nav-list {
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }
  .nav-list li {
    width: 100%;
    padding: 0.5rem 0;
  }
  .nav-list li a {
    font-size:2rem;
    color: rgba(255, 255, 255, 0.73);
  }
</style>
