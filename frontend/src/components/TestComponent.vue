<template>
  <v-card class="card" variant="outlined">
    <v-card-title>TestComponent</v-card-title>
    <v-card-text>
      <v-text-field type="number" v-model="x" variant="underlined" label="Input"/>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn color="primary" variant="elevated" @click="send">Send</v-btn>
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
        body: JSON.stringify({ test: this.x }) })
        .then((res) => {
          res.json()
            .then((data) => {
              this.x = data.test
            })
            .catch((err) => (err.message))
        })
        .catch((err) => (err.message))
    }
  },
  data() {
    return {
      x: -1
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
