import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './assets/css/reset.css'
import './assets/css/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from "@/store/store.js"

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
