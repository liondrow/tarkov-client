<template>
  <div id="main-screen" class="h-100">
    <div class="preloader preloader-full" v-show="loading">
      <img src="../assets/images/loader.gif" alt="" width="50px">
    </div>
    <div class="container h-100">
      <div class="row">
        <back-btn/>
        <div class="col wallet-wrapper my-5">
          <router-link to="wallet">
            <i class="fa-solid fa-ruble-sign"></i> {{ wallet }}
          </router-link>
        </div>
      </div>
      <h1 class="text-center">Барахолка <i class="fa-solid fa-arrows-rotate" @click="getMarketLots"></i></h1>
      <div class="quest-list mt-3">
        <div class="accordion" id="accordionQuests" v-if="lotsCount > 0">
          <div class="accordion-item" v-for="(lot, idx) in lots">
            <h2 class="accordion-header" id="heading{{idx}}">
              <button class="accordion-button collapsed" v-bind:class="{ collapsed: idx !== 0 }" type="button"
                      data-bs-toggle="collapse" :data-bs-target="'#collapse' + idx" aria-expanded="true"
                      aria-controls="collapse{{idx}}">
                {{ lot.item }}
              </button>
            </h2>
            <div :id="'collapse' + idx" class="accordion-collapse collapse" :aria-labelledby="'heading' + idx"
                 data-bs-parent="#accordionQuests">
              <div class="accordion-body">
                <div class="row mb-2">
                  <div class="col-3">Продавец:</div>
                  <div class="col-9 fw-bold">{{ lot.seller }}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-3">Цена:</div>
                  <div class="col-9 fw-bold">{{ lot.price }}</div>
                </div>
                <div class="row mb-2">
                  <button class="mx-auto col-6 btn tarkov-dark-btn" @click="confirmToBuy(lot.id)">Купить</button>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div v-if="!lotsCount" class="text-center my-3" style="font-size:1.5rem;">Нет активных лотов</div>
      </div>

    </div>
  </div>
</template>

<script>
import API from "@/services/api.js";
import BackBtn from "@/components/BackBtn.vue";
import Swal from 'sweetalert2'

export default {
  name: "Market",
  components: {BackBtn},
  data() {
    return {
      wallet: 0,
      loading: false,
      lots: [],
      lotsCount: 0,
      polling: null,
    };
  },
  methods: {
    async confirmToBuy(id) {
      Swal.fire({
        title: "Купить лот?",
        text: "Средства будут списаны с вашего счета",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Да",
        cancelButtonText: "Нет"
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleBuyLot(id)
        }
      });
    },
    async handleBuyLot(id) {
      await API.post('market_buy', {lotId: id})
          .then((response) => {
                if (response.data.status && response.data.buyerWalletValue) {
                  this.wallet = response.data.buyerWalletValue;
                  this.getMarketLots();
                }
                this.loading = false;
              },
              error => {
                this.loading = false;
                Swal.fire({
                  title: "Ошибка!",
                  text: error.message,
                  icon: 'error',
                  confirmButtonColor: "#9a8866"
                })
              });
    },
    async getMarketLots() {
      this.loading = true;
      await API.get('market')
          .then((response) => {
            this.lots = response.data
            this.lotsCount = Object.keys(response.data).length
            this.loading = false
          })
    }
  },
  computed: {
    invoiceCount() {
      return this.lotsCount;
    }
  },
  async mounted() {
    await this.getMarketLots();
    await API.get('wallet')
        .then((response) => {
          this.wallet = response.data
        });
    this.loading = false
  },
  beforeDestroy() {
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
  --bs-accordion-btn-focus-box-shadow: 0 0 0 0.05rem rgba(154, 136, 102, 0.53);
}

.accordion-body {
  background-color: #00000059;
  color: #ffffffad;
}

.accordion-body .col-3 {
  font-weight: bold;
}

.quest-btn-wrapper {
  font-size: 1.3rem;
}

.quest-list {
  padding: 5px;
  background: rgba(0, 0, 0, 0.33);
  border-radius: 15px;
  max-height: 60%;
  overflow-y: auto;
}
</style>
