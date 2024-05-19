import { createApp } from 'vue'
import { Quasar } from 'quasar'
import quasarLang from 'quasar/lang/fr'
import { createPinia } from 'pinia'
import App from './App.vue'
import socket from '@/services/socket'

// Import Quasar css
import 'quasar/dist/quasar.css'

const pinia = createPinia()
const app = createApp(App)

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  config: {
    dark: true
  },
  lang: quasarLang
})

app.use(pinia)

app.mount('#app')

app.use(socket)
