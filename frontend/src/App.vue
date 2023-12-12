<template>
  <v-snackbar v-model="preparation" vertical color="white" location="center" timeout="-1">
    <div>
      Connecting to backend...
    </div>
    <v-progress-linear v-if="preparation" size="50" color="primary" indeterminate></v-progress-linear>
  </v-snackbar>

  <v-snackbar v-model="generalProblem" color="error" location="center" multi-line timeout="-1">
    <h2>
      Application error
    </h2>
    <div>{{ generalProblemMsg }}</div>
  </v-snackbar>

  <v-app v-if="!preparation && !generalProblem">

    <v-navigation-drawer v-model="showNavigation" expand-on-hover rail permanent>
      
      <v-list density="compact" nav>
        <template v-for="item in navigation" :key="item.title">
          <v-list-item :href="item.href" :prepend-icon="item.icon" :title="item.title" exact v-if="checkIfInRole(user, item.roles)"/>
        </template>
      </v-list>

      <v-divider></v-divider>

      <v-list v-if="user.username">
        <v-list-item
          :prepend-avatar="require('./assets/user.png')"
          :title="user.username"
          :subtitle="user.email"
        >
        </v-list-item>
      </v-list>

      <v-list density="compact" nav>
        <v-list-item key="Login" @click="loginDialog = true" prepend-icon="mdi-login" title="Login" exact v-if="!user.username"/>
        <v-list-item key="Logout" @click="logoutConfirmation = true" prepend-icon="mdi-logout" title="Logout" exact v-if="user.username"/>
      </v-list>

    </v-navigation-drawer>

    <v-main>
      <router-view :user="user"></router-view>
    </v-main>

    <v-dialog v-model="loginDialog" width="25em">
      <Login @cancel="loginDialog = false" @loginFailed="loginDialog = false; loginFailed = true" @loginSuccess="onSuccessfulLogin"/>
    </v-dialog>

    <v-dialog v-model="logoutConfirmation" width="auto">
      <ConfirmationDialog :question="'Are you sure to logout?'" @ok="onLogout" @cancel="logoutConfirmation = false"/>
    </v-dialog>

    <v-snackbar v-model="loginFailed" color="warning" timeout="3000">Login failed</v-snackbar>

  </v-app>
</template>

<script>
import common from './mixins/common'

import Login from './components/Login.vue'
import ConfirmationDialog from './components/ConfirmationDialog.vue'

export default {
  name: 'App',
  components: { Login, ConfirmationDialog },
  mixins: [ common ],
  methods: {
    setUser(data) {
      Object.keys(this.user).forEach(key => delete this.user[key])
      Object.assign(this.user, data)
    },
    onSuccessfulLogin(data) {
      this.loginDialog = false
      this.showNavigation = false
      this.setUser(data)
      this.$router.push('/')
      this.showNavigation = true
    },
    onLogout() {
      this.logoutConfirmation = false
      this.showNavigation = false
      fetch('/auth', { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        this.setUser({})
        this.$router.push('/')
        this.showNavigation = true
      })
      .catch(err => {
        this.generalProblemMsg = err.message
        this.generalProblem = true
      })
    }
  },
  data() {
    return {
      user: {},
      navigation: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard', href: '#/' },
          { title: 'Persons', icon: 'mdi-account-multiple', href: '#/persons', roles: [ 0, 1 ] },
          { title: 'Projects', icon: 'mdi-sitemap-outline', href: '#/projects' },
          { title: 'Chat', icon: 'mdi-chat-processing-outline', href: '#/chat', roles: [ 0, 1 ] }
      ],
      showNavigation: false,
      loginDialog: false,
      loginFailed: false,
      logoutConfirmation: false,
      preparation: true,
      generalProblem: false,
      generalProblemMsg: ''
    }
  },
  mounted() {    
    fetch('/auth', { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      if(data.error) throw new Error(data.error)
      this.setUser(data)
      this.preparation = false
      this.showNavigation = true
    })
    .catch(err => {
      this.preparation = false
      this.generalProblemMsg = err.message
      this.generalProblem = true
    })
  }
}
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  margin: 10px 30px;
}
</style>