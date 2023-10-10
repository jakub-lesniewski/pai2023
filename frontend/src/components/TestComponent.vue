<template>
  <v-card class="card" variant="outlined">
    <v-card-title>TestComponent</v-card-title>
    <v-card-text>
      <v-text-field type="number" v-model="x" variant="underlined" label="New value"/>
      <v-text-field type="number" v-model="delta" variant="underlined" label="Increment"/>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn color="primary" variant="elevated" @click="send" :disabled="x.length == 0">Send</v-btn>
      <v-btn color="primary" variant="elevated" @click="increment" :disabled="delta.length == 0">Increment</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'TestComponent',
  methods: {
    send() {
      console.log('send', this.x)
      fetch('/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: parseFloat(this.x) }) })
        .then((res) => {
          res.json()
            .then((data) => {
              this.x = data.test
            })
            .catch((err) => console.error(err.message))
        })
        .catch((err) => console.error(err.message))
    },
    increment() {
      console.log('increment', this.delta)
      fetch('/test', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: parseFloat(this.delta) }) })
        .then((res) => {
          res.json()
            .then((data) => {
              this.x = data.test
            })
            .catch((err) => console.error(err.message))
        })
        .catch((err) => console.error(err.message))
    }
  },
  data() {
    return {
      x: '',
      delta: ''
    }
  },
  mounted() {
    console.log('TestComponent mounted')
    fetch('/test', { method: 'GET' })
      .then((res) => {
        res.json()
          .then((data) => {
            this.x = data.test
          })
          .catch((err) => (err.message))
      })
      .catch((err) => console.err(err.message))
  }
}
</script>

<style scoped>
.card {
  width: 400px;
}
</style>
