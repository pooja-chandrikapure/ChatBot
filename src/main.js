// import { createApp } from 'vue';
// import { createPinia } from 'pinia';
// import './style.css';
// import App from './App.vue';
// import router from './router';
// // import socket from './services/socket';
// import 'ag-grid-community/styles/ag-grid.css'
// import 'ag-grid-community/styles/ag-theme-alpine.css'
// import 'ag-grid-community/styles/ag-theme-quartz.css'
// import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
// ModuleRegistry.registerModules([ AllCommunityModule ]);
// import socket from './services/socket';

// // createApp(App).mount('#app')
// createApp(App)
//   .use(router)
//   .use(createPinia())
//   .mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'

import socket from './services/socket'

ModuleRegistry.registerModules([AllCommunityModule])

const app = createApp(App)

// 🔹 CONNECT SOCKET HERE (only once)
// socket.connect();


app
  .use(router)
  .use(createPinia())
  .mount('#app')
