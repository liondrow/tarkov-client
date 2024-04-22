<template>
  <div id="main-screen">
    <div class="preloader preloader-full" v-show="loading">
      <img src="../assets/images/loader.gif" alt="" width="50px">
    </div>
    <div class="container">
      <back-btn />
      <div class="myUid text-center mt-5">
        <h1>TeamId: <span class="bold-value">{{ teamUid }}</span></h1>
      </div>
      <div class="wallet-value text-center mb-5 mt-3">
        Баланс: <span class="bold-value">{{ wallet }}</span> <i class="fa-solid fa-ruble-sign"></i>
      </div>
      <div class="wallet-form-wrapper">
        <h1 class="text-center">Отправить перевод</h1>
        <form id="walletForm" @submit.prevent="confirmToBuy">
          <div class="mb-3">
            <label for="teamTo" class="form-label">TeamID получателя</label>
            <input type="text" class="form-control" id="teamTo" v-model="walletInvoice.teamTo">
          </div>
          <div class="mb-3">
            <label for="sum" class="form-label">Сумма</label>
            <input type="number" class="form-control" id="sum" v-model="walletInvoice.sum">
          </div>
          <button type="submit" class="btn tarkov-dark-btn" :disabled="loading">Отправить</button>
        </form>
<!--        <div class="error-text text-center" v-if="message">
          {{message}}
        </div>-->
<!--        <div class="success-text text-center" v-if="successMessage">
          {{successMessage}}
        </div>-->
      </div>
      <div class="history-btn-wrapper text-center my-4 text-decoration-underline">
        <router-link to="history">
          История операций
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import API from "@/services/api.js";
import WalletInvoice from "@/models/walletInvoice.js";
import BackBtn from "@/components/BackBtn.vue";

export default {
  name: "Wallet",
  components: {BackBtn},
  data() {
    return {
      wallet: 0,
      teamUid: '',
      message: '',
      polling: null,
      successMessage: '',
      availableTeams: [],
      loading: false,
      walletInvoice: new WalletInvoice('', 0)
    };
  },
  mounted() {
    this.loading = true;
    API.get('user-data')
        .then((response) => {
          this.teamUid = response.data.uid
          this.loading = false
        });
    API.get('wallet_available_teams')
        .then((response) => {
          this.availableTeams = response.data
          this.loading = false
        });
    this.polling = setInterval(() => {
      API.get('wallet')
          .then((response) => {
            this.wallet = response.data
            this.loading = false
          });
    }, 20000)
  },
  created() {
    API.get('wallet')
        .then((response) => {
          this.wallet = response.data
          this.loading = false
        });
  },
  beforeDestroy () {
    clearInterval(this.polling)
  },
  methods: {
    async confirmToBuy() {
      this.$confirm(
          {
            title: 'Отправить перевод?',
            message: 'Средства будут списаны с вашего счета',
            button: {
              yes: 'Подтвердить',
              no: 'Отмена'
            },
            /**
             * Callback Function
             * @param {Boolean} confirm
             */
            callback: confirm => {
              if (confirm) {
                this.sendInvoice()
              }
            }
          }
      )
    },
    async sendInvoice() {
      this.message = '';
      this.successMessage = '';
      this.loading = true;
      if (this.walletInvoice.teamTo === this.teamUid) {
        this.$confirm(
            {
              title: 'Ошибка!',
              message: "Нельзя отправлять перводы самому себе",
              button: {
                no: 'ОК',
              }
            }
        )
        this.loading = false
        return
      }
      if (this.walletInvoice.teamTo || this.walletInvoice.sum) {
        API.post('wallet_invoice', this.walletInvoice).then((response) => {
              this.wallet = response.data.newWalletValue
              this.walletInvoice.sum = 0
              this.walletInvoice.teamTo = ''
              this.$confirm(
              {
                title: 'Успешно!',
                message: 'Перевод успешно отправлен!',
                button: {
                  no: 'ОК',
                }
              })
              this.loading = false;
            }).catch((error) => {
          this.message =
              (error.response && error.response.data.detail) ||
              error.detail ||
              error.toString();
          this.$confirm(
              {
                title: 'Ошибка!',
                message: this.message,
                button: {
                  no: 'ОК',
                }
              }
          )
          this.loading = false;
        })
      } else {
        this.message = 'Заполните все поля!'
        this.loading = false;
      }
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



#walletForm {
  color: rgba(255, 255, 255, 0.73);
  text-align: center;
  padding: 1rem;
}

label {
  font-weight: bold;
}

.wallet-value,
.myUid h1 {
  font-size: 1.5rem;
}

span.bold-value {
  font-weight: bold;
  font-size: 2rem;
}

.wallet-form-wrapper {
  background: rgba(0, 0, 0, 0.33);
  padding: 10px;
  border-radius: 15px;
}
.history-btn-wrapper {
  font-weight: bold;
  font-size:1.5rem;
}
</style>
