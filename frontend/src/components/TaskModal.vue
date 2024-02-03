<template>
  <div>
    <v-card>
      <v-card-title>{{ id ? 'Edit' : 'Create' }} project</v-card-title>
      <v-card-text>
        <v-form v-model="isProjectValid">
          <v-text-field variant="solo" label="Name" v-model="project.name" :rules="[ rules.required ]"></v-text-field>
          <div class="flex-container">
            <v-text-field variant="solo" label="Shortcut" v-model="project.shortcut" :rules="[ rules.required ]"></v-text-field>
            <v-color-picker mode="rgb" v-model="project.color" hide-canvas hide-inputs></v-color-picker>
          </div>
          <v-text-field variant="solo" type="date" label="Start date" v-model="project.startDate" :rules="[ rules.validStartDate ]"></v-text-field>

          <div class="flex-container">
            <v-btn variant="text" size="xx-small" rounded="false" icon="mdi-image-filter-center-focus" @click="centerView"></v-btn>
            Location (click or drag to set)
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="success" @click="add" :disabled="!isProjectValid" v-if="!id">Add</v-btn>
        <v-btn variant="elevated" color="success" @click="modify" :disabled="!isProjectValid" v-if="id">Modify</v-btn>
        <v-btn variant="elevated" color="error" @click="remove" v-if="id">Remove</v-btn>
        <v-btn variant="elevated" color="warning" @click="cancel">Cancel</v-btn>
        <v-btn variant="elevated" color="success" @click="openTask">Open task</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="confirmation" width="auto">
      <ConfirmationDialog :question="'Are you sure to delete \'' + project.name + '\' ?'" @ok="removeReal" @cancel="confirmation = false"/>
    </v-dialog>
  </div>
</template>

<script>
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";

export default {
  name: "TaskModal",
  components: {ConfirmationDialog}
}
</script>
<style scoped>

</style>