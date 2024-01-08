<template>
    <div>
        <v-row>
            <v-col>
                <h1>Dashboard</h1>
            </v-col>
            <v-col>
                <div :class="{ login: true, notLoggedIn: !user.username }">{{ user.username || 'not-logged-in' }}</div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <ProjectChart/>
            </v-col>
            <v-col cols="6">

            </v-col>
        </v-row>    
    </div>
</template>
  
<script>
import ProjectChart from './ProjectChart.vue'

export default {
    name: 'DashboardView',
    components: { ProjectChart },
    props: [ 'user', 'websocket', 'eventSet' ]
}
</script>
  
<style scoped>
.login { text-align: right; }
.notLoggedIn { font-style: italic; }
</style>