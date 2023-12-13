<template>
    <v-card variant="text">
        <v-card-title>Chat</v-card-title>
        <v-card-text>
            <v-list>
                <v-list-item v-for="(event, index) in posts" :key="index"
                :subtitle="event.sender + ' ' + event.timestamp.slice(11, 16)"
                :class="getItemClass(event)">
                {{ event.message }}
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-card-actions>
            <v-form style="width: 100%;">
                <v-text-field variant="solo" label="Message" v-model="message">
                    <template #append-inner>
                        <v-btn variant="elevated" color="success" @click="send" type="submit">Send</v-btn>
                    </template>
                </v-text-field>
            </v-form>
        </v-card-actions>
    </v-card>
</template>
  
<script>
import { watch } from 'vue'

export default {
    name: 'ChatView',
    props: [ 'user', 'websocket', 'eventSet' ],
    data() {
        return {
            message: '',
            posts: []
        }
    },
    methods: {
        send() {
            this.websocket.send(JSON.stringify({
                event: 'POST',
                message: this.message
            }))    
            this.message = ''
        },
        getItemClass(event) {
            return event.sender == this.user.username ? 'toRight' : 'toLeft'
        }
    },
    mounted() {
        watch(() => this.eventSet.POST, () => {
            this.posts.push(this.eventSet.POST)
        })
    }
}
</script>
  
<style scoped>
.toLeft { text-align: left; }
.toRight { text-align: right; }
</style>