<template>
    <v-card variant="text">
        <v-card-title>Chat</v-card-title>
        <v-card-text>
            <v-list>
                <v-list-item v-for="(event, index) in posts" :key="index" :subtitle="event.username" :class="getItemClass(event)">
                {{ event.message }}
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-card-actions>
            <v-text-field variant="solo" label="Message" v-model="message"></v-text-field>
            <v-btn variant="elevated" color="success" @click="send">Send</v-btn>
        </v-card-actions>
    </v-card>
</template>
  
<script>
export default {
    name: 'ChatView',
    props: [ 'user' ],
    data() {
        return {
            connection: null,
            message: '',
            posts: []
        }
    },
    methods: {
        send() {
            this.connection.send(JSON.stringify({
                event: 'POST',
                username: this.user.username || 'not-logged-in',
                message: this.message
            }))    
        },
        getItemClass(event) {
            return event.username == this.user.username ? 'toRight' : 'toLeft'
        }
    },
    mounted() {
        this.connection = new WebSocket('ws://' + window.location.host + '/websocket')
        this.connection.onopen = () => {
            console.log('Websocket connection established')
            this.connection.send(JSON.stringify({
                event: 'CONNECTION',
                username: this.user.username || 'not-logged-in'
            }))
        }
        this.connection.onmessage = (event) => {
            let data = {}
            try {
                data = JSON.parse(event.data)
            } catch(err) {
                console.error(err.message, event.data)
                return
            }
            if(data.event == 'POST') this.posts.push(data)
        }
    }    
}
</script>
  
<style scoped>
.toLeft { text-align: left; }
.toRight { text-align: right; }
</style>