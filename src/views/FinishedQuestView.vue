<template>
  <div id="main-screen" class="h-100">
    <div class="preloader preloader-full" v-show="loading">
      <img src="../assets/images/loader.gif" alt="" width="50px">
    </div>
    <div class="container h-100">
      <div class="row">
        <back-btn />
        <div class="col wallet-wrapper my-5" >
          <router-link to="wallet">
            <i class="fa-solid fa-ruble-sign"></i> {{ wallet }}
          </router-link>
        </div>
      </div>
      <h1 class="text-center">Завершенные квесты</h1>
      <div class="quest-list mt-3">
        <div class="accordion" id="accordionQuests" v-if="questsCount > 0">
          <div class="accordion-item" v-for="(quest, idx) in quests">
            <h2 class="accordion-header" :id="'heading' + idx">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + idx" aria-expanded="true" aria-controls="collapseOne">
                {{ quest.name }}
              </button>
            </h2>
            <div :id="'collapse' + idx" class="accordion-collapse collapse" :aria-labelledby="'heading' + idx" data-bs-parent="#accordionQuests">
              <div class="accordion-body">
                <h3 class="finished-quest-status">ЗАВЕРШЕНО</h3>
                <div class="row mb-2">
                  <div class="col-3">Персонаж: </div>
                  <div class="col-9">{{ quest.target }}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-3">Описание: </div>
                  <div class="col-9" v-html="quest.description"></div>
                </div>
                <div class="row mb-2">
                  <div class="col-3">Награда: </div>
                  <div class="col-9 fw-bold">{{ quest.reward }} <i class="fa-solid fa-ruble-sign"></i> </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!questsCount" class="text-center my-3" style="font-size:1.5rem;">Нет завершенных квестов</div>
      </div>
      <div class="quest-btn-wrapper text-center my-4 text-decoration-underline">
        <router-link to="quests">
          Активные квесты
        </router-link>
      </div>

    </div>
  </div>
</template>

<script>
import API from "@/services/api.js";
import BackBtn from "@/components/BackBtn.vue";
export default {
  name: "History",
  components: {BackBtn},
  data() {
    return {
      wallet: 0,
      loading: false,
      quests: [],
      questsCount: 0,
      polling: null,
    };
  },
  computed: {
    invoiceCount() {
      return this.questsCount;
    }
  },
  async mounted() {
    this.loading = true;
    await API.get('finished_quests')
        .then((response) => {
          this.quests = response.data
          this.questsCount = Object.keys(response.data).length
        })
    await API.get('wallet')
        .then((response) => {
          this.wallet = response.data
        });
    this.loading = false
  },
  beforeDestroy () {
    clearInterval(this.polling)
  }
};
</script>

<style scoped>
  #main-screen {
    position: relative;
    color: rgba(255, 255, 255, 0.73);
    overflow: hidden;
  }
  .accordion {
    --bs-accordion-bg: transparent;
    background-color: #4343438f;
  }
  .accordion-button {
    background-color: #4343438f;
    color: #ffffffcc;
    font-weight: bold;
  }
  .accordion-button::after {
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>") !important;
  }
  .accordion-button:focus {
    --bs-accordion-btn-focus-box-shadow: 0 0 0 0.05rem #9a8866;
  }
  .accordion-body {
    background-color: #00000059;
    color: #ffffffad;
  }
  .accordion-body .col-3 {
    font-weight: bold;
  }
  .quest-btn-wrapper {
    font-size:1.3rem;
  }
  .finished-quest-status {
    font-weight: bold;
    color: rgba(13, 86, 13, 0.73);
    font-size:1.5rem;
  }
  .quest-list {
    padding:5px;
    background: rgba(0, 0, 0, 0.33);
    border-radius: 15px;
    max-height: 60%;
    overflow: scroll;
  }
</style>
