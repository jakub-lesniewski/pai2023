<template>
    <v-card class="box" variant="outlined">
        <v-card-text>
          <v-select v-model="selectedPerson" :items="persons" :item-title="item => item.lastName + ', ' + item.firstName + ' (born ' + new Date(item.birthDate).toLocaleDateString() + ')'" label="Choose a person" hide-no-data return-object></v-select>
        </v-card-text>
        <v-card-actions class="actions">
          <v-btn variant="elevated" color="success" @click="add">New</v-btn>
          <v-btn variant="elevated" color="success" @click="edit">Modify</v-btn>
          <v-btn variant="elevated" color="error" @click="remove">Delete</v-btn>
        </v-card-actions>
    </v-card>
  
    <v-dialog v-model="dialog" width="30em">
          <v-form v-model="valid" validate-on="blur">
            <v-card>
              <v-card-title>
                <span class="text-h5">Person</span>
              </v-card-title>
              <v-card-subtitle>
                Enter person data
              </v-card-subtitle>
              <v-card-text>
                  <v-container>
                    <v-text-field label="First name" variant="solo" v-model="editedPerson.firstName"></v-text-field>
                    <v-text-field label="Last name" variant="solo" v-model="editedPerson.lastName"></v-text-field>
                    <v-text-field label="Birth date" type="date" variant="solo" v-model="editedPerson.birthDate"></v-text-field>
                  </v-container>
                </v-card-text>
              <v-card-actions class="actions">
                <v-spacer></v-spacer>
                <v-btn size="small" color="success" @click="close(editedPerson)" variant="elevated" :disabled="!valid">Ok</v-btn>
                <v-btn size="small" @click="close(null)" variant="elevated">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>

        <v-dialog v-model="okDialog" width="30em">
            <v-card>
              <v-card-title>
                <span class="text-h5">Delete?</span>
              </v-card-title>
              <v-card-subtitle>
                {{ selectedPerson._id }}
              </v-card-subtitle>
              <v-card-text>
                {{ selectedPerson.lastName + ', ' + selectedPerson.firstName + ' (born ' + new Date(selectedPerson.birthDate).toLocaleDateString() + ')' }}
                </v-card-text>
              <v-card-actions class="actions">
                <v-spacer></v-spacer>
                <v-btn size="small" color="success" @click="realRemove" variant="elevated">Ok</v-btn>
                <v-btn size="small" @click="okDialog = false" variant="elevated">Cancel</v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>

  </template>
    
    <script>
    export default {
      name: 'PersonChooser',
      methods: {
        close(data) {
          console.log(data)
          this.dialog = false
        },
        edit() {
            Object.assign(this.editedPerson, this.selectedPerson)
            this.dialog = true
        },
        add() {
            delete this.editedPerson._id
            this.editedPerson.firstName = ''
            this.editedPerson.lastName = ''
            this.editedPerson.birthDate = new Date().toISOString().slice(0, 10)
            this.dialog = true
        },
        remove() {
            this.okDialog = true
        },
        realRemove() {
            console.log('REMOVE', this.selectedPerson)
            this.okDialog = false
        }
      },
      data() {
        return {
          selectedPerson: null, // osoba wybrana z comboboxa
          editedPerson: {}, // osoba edytowana w dialogu
          persons: [],
          dialog: false,
          okDialog: false,
          valid: true
        }
      },
      mounted() {
        fetch('/person', { method: 'GET' })
          .then((res) => {
            res.json()
              .then((data) => {
                this.persons = data
                if(data.length > 0) this.selectedPerson = this.persons[0]
              })
              .catch(err => console.error(err.message))
          })
          .catch(err => console.error(err.message))
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
