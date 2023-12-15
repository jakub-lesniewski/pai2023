<template>
    <div>
        <h1>Control Panel</h1>
        <br/>

        <v-card>
        <v-card-title>
            <v-btn variant="elevated" color="default" @click="refreshSessions" icon="mdi-refresh" density="compact"></v-btn>
            Sessions
        </v-card-title>
        <v-card-text>
            <v-table density="compact" hover>
            <thead>
                <tr>
                <th class="text-left">
                    sessionid
                </th>
                <th class="text-left">
                    user
                </th>
                <th class="text-left">
                    roles
                </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(session, key, index) in sessions" :key="index">
                <td>{{ key }}</td>
                <td>{{ session.passport && session.passport.user }}</td>
                <td>{{ session.roles }}</td>
                </tr>
            </tbody>
            <template #top>
                
            </template>
        </v-table>
        </v-card-text>
        </v-card>
        <v-card>
        <v-card-title>
            <v-btn variant="elevated" color="default" @click="refreshSockets" icon="mdi-refresh" density="compact"></v-btn>
            Sockets
        </v-card-title>

        <v-card-text>
            <v-table density="compact" hover>
            <thead>
                <tr>
                <th class="text-left">
                    sessionid
                </th>
                <th class="text-left">
                    address
                </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(socket, key, index) in sockets" :key="index">
                <td>{{ socket.sessionid }}</td>
                <td>{{ socket.from.family + '/' + socket.from.address + ':' + socket.from.port }}</td>
                </tr>
            </tbody>
            <template #top>
                
            </template>
        </v-table>
        </v-card-text>
        </v-card>

    </div>
</template>
  
<script>
import { watch } from 'vue'

export default {
    name: 'ControlPanel',
    props: [ 'user', 'websocket', 'eventSet' ],
    data() {
        return {
            sessions: {},
            sockets: []
        }
    },
    methods: {
        refreshSessions() {
            fetch('/control/sessions', { method: 'GET' })
            .then(res => res.json())
            .then(data => { 
                if(data.error) throw new Error(data.error)
                this.sessions = data 
            })
            .catch(err => console.error(err.message))
        },
        refreshSockets() {
            this.websocket.send(JSON.stringify({ event: 'QUERY_CLIENTS' }))
        }
    },
    mounted() {
        this.refreshSessions()
        this.refreshSockets()

        watch(() => this.eventSet.QUERY_CLIENTS, () => {
            this.sockets = this.eventSet.QUERY_CLIENTS.clients
        })

    }
}
</script>
  
<style scoped>
</style>