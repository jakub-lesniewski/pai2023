<template>
  <v-card class="box" variant="outlined">
    <v-card-title>Edit a person</v-card-title>
    <v-card-text>
      <v-form v-model="isPersonValid">
        <v-text-field variant="solo" label="First name" v-model="person.firstName" :rules="[ rules.required ]"></v-text-field>
        <v-text-field variant="solo" label="Last name" v-model="person.lastName" :rules="[ rules.required ]"></v-text-field>
        <v-text-field variant="solo" type="date" label="Birth date" v-model="person.birthDate" :rules="[ rules.validBirthDate ]"></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions class="actions">
      <v-btn variant="elevated" color="success" @click="add" :disabled="!isPersonValid">Add</v-btn>
      <v-btn variant="elevated" color="success" @click="modify" :disabled="!isPersonValid || !selected_id">Modify</v-btn>
      <v-btn variant="elevated" color="error" @click="remove" :disabled="!isPersonValid || !selected_id">Delete</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'PersonEditor',
  emits: [ 'dataModified' ],
  methods: {
    add() {
      fetch('/person', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.person) })
        .then((res) => {
          res.json()
            .then((data) => {
              this.$emit('dataModified', data)
            })
            .catch((err) => alert(err.message))
        })
        .catch((err) => alert(err.message))
    },
    modify() {
      fetch('/person?_id=' + this.selected_id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.person) })
        .then((res) => {
          res.json()
            .then((data) => {
              this.$emit('dataModified', data)
            })
            .catch((err) => alert(err.message))
        })
        .catch((err) => alert(err.message))
    },
    remove() {
      fetch('/person?_id=' + this.selected_id, { method: 'DELETE' })
        .then((res) => {
          res.json()
            .then((data) => {
              this.$emit('dataModified', data)
            })
            .catch((err) => alert(err.message))
        })
        .catch((err) => alert(err.message))
    },
    fill(data) {
      this.selected_id = data._id
      delete data._id
      Object.assign(this.person, data)
    }
  },
  data() {
    return {
      isPersonValid: false,
      rules: {
        required: value => !!value || 'empty value is not allowed',
        validBirthDate: value => !isNaN(new Date(value)) || 'valid date required'
      },
      person: {
        firstName: '',
        lastName: '',
        birthDate: new Date().toISOString().slice(0, 10)
      },
      selected_id: null     
    }
  } 
}
</script>

<style scoped>
.box {
  width: 500px;
}
.actions {
  float: right;
}
</style>