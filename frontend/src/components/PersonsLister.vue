<template>
  <v-card class="box" variant="outlined">
    <v-card-title>Persons</v-card-title>
    <v-card-text>
      <v-table density="compact" hover>
        <thead>
          <tr>
            <th>
              <v-chip variant="outlined" size="x-small" append-icon="mdi-check" @click="removeSelection">x</v-chip>
            </th>
            <th class="text-left">
              First name
            </th>
            <th class="text-left">
              Last name
            </th>
            <th class="text-left">
              Birth date
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(person, index) in persons" :key="index" @click="click(person)">
            <td><v-chip variant="text" v-show="person._selected" size="x-small" append-icon="mdi-check"></v-chip></td>
            <td>{{ person.firstName }}</td>
            <td>{{ person.lastName }}</td>
            <td>{{ new Date(person.birthDate).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'PersonsLister',
  emits: [ 'dataClicked' ],
  methods: {
    retrieve() {
      fetch('/person', {
        method: 'GET' })
        .then((res) => {
          res.json()
            .then((data) => {
              this.persons = data
              this.removeSelection()
            })
            .catch(err => console.error(err.message))
        })
        .catch(err => console.error(err.message))
    },
    click(data) {
      this.removeSelection()
      data._selected = true
      this.$emit('dataClicked', data)
    },
    removeSelection() {
      for(let each of this.persons) delete each._selected
      this.$emit('dataClicked', {})
    }
  },
  data() {
    return {
      persons: []
    }
  },
  mounted() {
    this.retrieve()
  } 
}
</script>

<style scoped>
.box {
  width: 500px;
}
</style>