<template>
  <v-app>
    
    <v-navigation-drawer expand-on-hover rail permanent>
      
      <v-list density="compact" nav>
        <template v-for="item in navigation" :key="item.title">
          <v-list-item :href="item.href" :prepend-icon="item.icon" :title="item.title" exact/>
        </template>
      </v-list>

      <v-divider></v-divider>

      <v-list v-if="user.username">
        <v-list-item
          :prepend-avatar="require('./assets/logo.png')"
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
      <router-view></router-view>
    </v-main>

    <v-dialog v-model="loginDialog" width="25em">
      <Login @cancel="loginDialog = false" @loginFailed="loginDialog = false; loginFailed = true" @loginSuccess="onSuccessfulLogin"/>
    </v-dialog>

    <v-dialog v-model="logoutConfirmation" width="auto">
      <ConfirmationDialog :question="'Are you sure to logout, ' + user.username + ' ?'" @ok="onLogout" @cancel="logoutConfirmation = false"/>
    </v-dialog>

    <v-snackbar v-model="generalProblem" color="error" timeout="3000">{{ generalProblemMsg }}</v-snackbar>
    <v-snackbar v-model="loginSuccess" color="success" timeout="3000">Welcome on board, {{ user.username }}</v-snackbar>
    <v-snackbar v-model="loginFailed" color="warning" timeout="3000">Login failed</v-snackbar>

  </v-app>
</template>

<script>
import Login from './components/Login.vue'
import ConfirmationDialog from './components/ConfirmationDialog.vue'

export default {
  name: 'App',
  components: { Login, ConfirmationDialog },
  methods: {
    onSuccessfulLogin(data) {
      this.user = data
      this.loginDialog = false
      this.loginSuccess = true
    },
    onLogout() {
      this.logoutConfirmation = false
      fetch('/auth', { method: 'DELETE' })
      .then(res => res.json())
      .then(() => this.user = {})
      .catch(err => {
        this.generalProblemMsg = err.message
        this.generalProblem = true
      })
    }
  },
  data() {
    return {
      navigation: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard', href: '#/' },
          { title: 'Persons', icon: 'mdi-account-multiple', href: '#/persons' }
      ],
      loginDialog: false,
      loginFailed: false,
      loginSuccess: false,
      logoutConfirmation: false,
      generalProblem: false,
      generalProblemMsg: '',
      user: {}
    }
  },
  mounted() {
    fetch('/auth', { method: 'GET' })
    .then(res => res.json())
    .then(body => {
      if(body.error) throw new Error(body.error)
      this.user = body
    })
    .catch(err => {
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