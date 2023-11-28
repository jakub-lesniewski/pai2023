import '@fontsource/roboto/index.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    icons: { iconfont: 'mdi' }    
})

// Router
import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from './components/Dashboard.vue'
import PersonsLister from './components/PersonsLister.vue'
import ProjectsLister from './components/ProjectsLister.vue'

// root properties
const user = {} 

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: Dashboard },
        { path: '/persons', component: PersonsLister, meta: { user } },
        { path: '/projects', component: ProjectsLister, meta: { user } }
    ]
})

createApp(App, { user }).use(vuetify).use(router).mount('#app')