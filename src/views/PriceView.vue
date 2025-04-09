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
      <h1 class="text-center">Прайс</h1>
      <div class="quest-list mt-3">
        <div class="accordion" id="accordionPrice" v-if="priceListCount > 0">
          <div class="accordion-item" v-for="(priceEl, idx) in priceList">
            <h2 class="accordion-header" id="heading{{idx}}">
              <button class="accordion-button" v-bind:class="{ collapsed: idx !== 0 }" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + idx" aria-expanded="true" aria-controls="collapse{{idx}}">
                {{ priceEl.name }}
              </button>
            </h2>
            <div :id="'collapse' + idx" class="accordion-collapse collapse" v-bind:class="{ show: idx === 0 }" :aria-labelledby="'heading' + idx" data-bs-parent="#accordionPrice">
              <div class="accordion-body">
                <table class="table table-dark table-striped table-bordered align-middle">
                  <thead class="table-dark">
                  <tr>
                    <th>Название</th>
                    <th>Прапор</th>
                    <th>Терапевт</th>
                    <th>Барахольщик</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item) in priceEl.items">
                    <td>{{ item.name }}</td>
                    <td>{{ item.praporPrice }}</td>
                    <td>{{ item.terapevtPrice }}</td>
                    <td>{{ item.baraholshikPrice }}</td>
                  </tr>
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        </div>
        <div v-if="!priceListCount" class="text-center my-3" style="font-size:1.5rem;">Нет предметов</div>
      </div>

    </div>
  </div>
</template>

<script>
import API from "@/services/api.js";
import BackBtn from "@/components/BackBtn.vue";
export default {
  name: "Price",
  components: {BackBtn},
  data() {
    return {
      wallet: 0,
      loading: false,
      priceList: [],
      priceListCount: 0,
      polling: null,
    };
  },
  computed: {
    invoiceCount() {
      return this.priceListCount;
    }
  },
  methods: {
    async getPriceList() {
      this.loading = true;
      await API.get('items')
          .then((response) => {
            this.priceList = response.data
            this.priceListCount = Object.keys(response.data).length
            this.loading = false
          })
    }
  },
  async mounted() {
    await this.getPriceList()
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
    font-size:1.3rem;
  }
  .quest-list {
    padding:5px;
    background: rgba(0, 0, 0, 0.33);
    border-radius: 15px;
    max-height: 60%;
    overflow-y: auto;
  }
</style>
