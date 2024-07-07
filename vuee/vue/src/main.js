import { createApp } from 'vue'
import { createPinia } from 'pinia'
const app = createApp(App)

import '@/store/navbar.js'
const pinia = createPinia()
app.use(pinia)
import './index.css'
import App from './App.vue'
import router from './routes'

// import Echo from 'laravel-echo';
// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: 'b6a4d2642213ed1fa360',
//     cluster: 'ap2',
//     encrypted: true,
// });
createApp(App).use(router).mount('#app')
