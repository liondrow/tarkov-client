import "bootstrap/dist/css/bootstrap.min.css"
import 'sweetalert2/dist/sweetalert2.min.css';
import "bootstrap"
import './assets/css/reset.css'
import './assets/css/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from "@/store/store.js"
import VueSweetalert2 from "vue-sweetalert2";

const app = createApp(App)

app.use(router)
app.use(store)
app.use(VueSweetalert2)

app.mount('#app')
