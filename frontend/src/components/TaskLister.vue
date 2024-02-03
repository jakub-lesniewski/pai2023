<template>
    <v-card>
      <v-card-title>Tasks</v-card-title>
      <v-card-subtitle>
        Filtering
        <v-row>
          <v-col>
            <v-text-field v-model="search" @input="retrieve" variant="solo" label="Match name"></v-text-field>
          </v-col>
          <!-- <v-col cols="4">
            <v-select v-model="projects" label="Project" multiple chips @update:modelValue="retrieve"
              :items="[ { value: 0, title: 'primary' }, { value: 1, title: 'secondary' }, { value: 2, title: 'high' } ]"
            ></v-select>
          </v-col> -->
          <v-col cols="2">
            <div>Limit</div>
            <v-slider density="compact" v-model="limit" min="5" max="100" step="5" thumb-label @update:modelValue="retrieve"></v-slider>
          </v-col>
          <v-col cols="1">
            <v-btn variant="elevated" color="success" @click="add" v-if="checkIfInRole(user, [ 0 ])">Add</v-btn>
          </v-col>
        </v-row>
      </v-card-subtitle>
      <v-card-text>
        <v-table density="compact" hover>
          <thead>
            <tr>
             <th class="text-left" v-if="this.checkIfInRole(this.user, [ 0 ,1])"></th>
              <th class="text-left">
                Name
              </th>
              <th class="text-left">
                Project name
              </th>
              <th class="text-left">
                Start Date
              </th>
              <th class="text-left">
                End Date
              </th>
              <th class="text-left">
                Performers 
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(task, index) in tasks" :key="index" @click="click(task)">
              <td v-if="this.checkIfInRole(this.user, [ 0 ,1]) && !task.endDate"><input type="checkbox"  v-model="checkedTasks" :value="task._id" @click.stop></td>
              <td v-if="this.checkIfInRole(this.user, [ 0 ,1]) && task.endDate"></td>
              <td>{{ task.name }}</td>
              <td>
                <v-chip v-for="(project, pindex) in task.project" :key="pindex" >
                  {{ project.name }}
                </v-chip>
              </td>
              <td>{{ new Date(task.startDate).toLocaleDateString() }}</td>
              <td v-if="task.endDate">{{ new Date(task.endDate).toLocaleDateString() }}</td>
              <td v-if="!task.endDate">not finished
              </td>
              <td>
                <v-chip v-for="(person, pindex) in task.performers" :key="pindex" >
                  {{ person.firstName +' ' + person.lastName }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="success" v-if="checkedTasks.length" @click="setEndDate()">Set end Date</v-btn>
        <v-btn variant="elevated" color="warning"  v-if="checkedTasks.length" @click="clearCheckBox()">Clear</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="editor" width="50%">
      <TaskEditor :id="id" @dataChanged="retrieve" @cancel="cancel" @dataAccessFailed="onDataAccessFailed"/>
    </v-dialog>

    <v-snackbar v-model="dataAccessError" color="error" timeout="3000">{{ dataAccessErrorMsg }}</v-snackbar>

</template>

<script>
import common from '../mixins/common'

import TaskEditor from './TaskEditor.vue'

export default {
  name: 'TaskLister',
  components: { TaskEditor },
  mixins: [ common ],
  props: [ 'user', 'websocket', 'eventSet' ],
  methods: {
    retrieve() {
      this.id = null
      this.editor = false
      this.checkedTasks = []
      fetch('/task?search=' + this.search + '&limit=' + this.limit, { method: 'GET' })
      .then(res => res.json())
      .then(data => { 
        if(data.error) throw new Error(data.error)
        this.tasks = data 
      })
      .catch(err => this.onDataAccessFailed(err.message))
    },
    clearCheckBox() {
      this.checkedTasks = []
    },
    setEndDate() {
     fetch('/task', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({tasks: this.checkedTasks}) })
        .then(res => res.json())
        .then(data => {
          if(data.error) throw new Error(data.error)
          this.retrieve()
        })
        .catch(err => this.$emit('dataAccessFailed', err.message))
    },
    add() {
      this.id = null
      this.editor = true
    },
    click(row) {
      if(!this.checkIfInRole(this.user, [ 0 ,1])) return
      this.id = row._id
      this.editor = true
    },
    cancel() {
      this.id = null
      this.editor = false
    },
    onDataAccessFailed(data) {
      this.dataAccessErrorMsg = data
      this.dataAccessError = true
    }
  },
  data() {
    return {
      editor: false,
      tasks: [],
      checkedTasks: [], 
      id: null,
      limit: 10,
      search: '',
      education: [ 0, 1, 2 ],
      dataAccessError: false,
      dataAccessErrorMsg: ''
    }
  },
  mounted() {
    this.retrieve()
  } 
}
</script>