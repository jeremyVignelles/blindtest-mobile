import { createApp } from 'vue'
import { Quasar } from 'quasar'
import quasarLang from 'quasar/lang/fr'
import { createPinia } from 'pinia'
import App from './App.vue'
import socket from '@/plugins/socket'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/dist/quasar.css'

const pinia = createPinia()
const app = createApp(App)

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  config: {
    dark: 'auto'
  },
  lang: quasarLang
})

app.use(pinia)

app.mount('#app')

app.use(socket)
