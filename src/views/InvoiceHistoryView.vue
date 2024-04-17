<template>
  <div id="main-screen">
    <div class="preloader preloader-full" v-show="loading">
      <img src="../assets/images/loader.gif" alt="" width="50px">
    </div>
    <div class="container">
      <div class="row">
        <back-btn />
        <div class="col wallet-wrapper my-5" >
          <router-link to="wallet">
            <i class="fa-solid fa-ruble-sign"></i> {{ wallet }}
          </router-link>
        </div>
      </div>
      <div class="history-list mt-3">
        <ul class="p-3" v-if="invoiceCount > 0">
          <li>
            <div class="row history-table-header my-3">
              <div class="col-8">Команда</div>
              <div class="col-4 text-end">Сумма</div>
            </div>
          </li>
          <li v-for="historyInvoice in historyInvoices">
            <div class="row history-row py-2" v-bind:class="{ 'incoming-invoice': historyInvoice.type === 'INCOMING', 'outgoing-invoice': historyInvoice.type === 'OUTGOING' }">
              <div class="col-8"><span class="small" style="font-size:0.9rem;">{{historyInvoice.teamId}}.</span> {{historyInvoice.team}}</div>
              <div class="col-4 text-end">{{ (historyInvoice.type === 'INCOMING') ? "+" : "-" }} {{historyInvoice.sum}} </div>
            </div>
          </li>
        </ul>
        <div v-if="!invoiceCount" class="text-center my-3" style="font-size:1.5rem;">Переводы отсутствуют</div>
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
      historyInvoices: [],
      invoiceCount: 0,
      polling: null,
    };
  },
  computed: {
    invoiceCount() {
      return this.invoiceCount;
    }
  },
  mounted() {
    this.loading = true;
    API.get('invoice_history')
        .then((response) => {
          this.historyInvoices = response.data
          this.invoiceCount = Object.keys(response.data).length
          this.loading = false
        })
    API.get('wallet')
        .then((response) => {
          this.wallet = response.data
          this.loading = false
        });
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
  .history-list {
    padding:5px;
    background: rgba(0, 0, 0, 0.33);
    max-height: 70vh;
    overflow-y: auto;
    border-radius: 15px;
  }
  .history-table-header {
    font-size:1.6rem;
    font-weight: bold;
  }
  .history-row {
    font-size: 1.2rem;
    border: 1px solid ;
  }
  .history-row.incoming-invoice {
    border-color: rgba(74, 119, 67, 0.43);
    background: rgba(74, 119, 67, 0.09);
  }
  .history-row.outgoing-invoice {
    border-color: rgba(169, 105, 105, 0.26);
    background: rgba(126, 45, 45, 0.13);
  }
</style>
