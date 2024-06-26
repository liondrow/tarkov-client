import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './assets/css/reset.css'
import './assets/css/sweetalert.min.css'
import './assets/css/main.css'
import 'vue3-confirm-dialog/style'


import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from "@/store/store.js"
import Vue3ConfirmDialog from 'vue3-confirm-dialog';
import setupInterceptors from '@/services/interceptors.js';

setupInterceptors(store);

const app = createApp(App)

app.use(router)
app.use(store)
app.use(Vue3ConfirmDialog);
app.component('vue3-confirm-dialog', Vue3ConfirmDialog.default)

app.mount('#app')
