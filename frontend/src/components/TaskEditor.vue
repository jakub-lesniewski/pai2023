<template>
  <div>
    <v-card>
      <v-card-title>{{ id ? "Edit" : "Create" }} task</v-card-title>
      <v-card-text>
        <v-form v-model="isPersonValid">
          <v-text-field
            variant="solo"
            label="name"
            v-model="tasks.name"
            :rules="[rules.required]"
          ></v-text-field>
          <v-select
            label="project"
            v-model="tasks.project"
            :items="projects"
            variant="solo"
          ></v-select>
          <v-text-field
            variant="solo"
            type="date"
            label="start date"
            v-model="tasks.startDate"
            :rules="[rules.validStartDate]"
          ></v-text-field>
          <v-text-field
            variant="solo"
            type="date"
            label="end date"
            v-model="tasks.endDate"
            :rules="[rules.validEndDate]"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="elevated"
          color="success"
          @click="add"
          :disabled="!isPersonValid"
          v-if="!id"
          >Add</v-btn
        >
        <v-btn
          variant="elevated"
          color="success"
          @click="modify"
          :disabled="!isPersonValid"
          v-if="id"
          >Modify</v-btn
        >
        <v-btn variant="elevated" color="error" @click="remove" v-if="id"
          >Remove</v-btn
        >
        <v-btn variant="elevated" color="warning" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="confirmation" width="auto">
      <ConfirmationDialog
        :question="
          'Are you sure to delete \'' +
          person.firstName +
          ' ' +
          person.lastName +
          '\' ?'
        "
        @ok="removeReal"
        @cancel="confirmation = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import ConfirmationDialog from "./ConfirmationDialog.vue";

export default {
  name: "TaskEditor",
  props: ["id"],
  components: { ConfirmationDialog },
  emits: ["cancel", "dataChanged", "dataAccessFailed"],
  methods: {
    add() {
      console.log(this.task);
      console.log(JSON.stringify(this.task));
      fetch("/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.task),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          this.$emit("dataChanged");
        })
        .catch((err) => this.$emit("dataAccessFailed", err.message));
    },
    modify() {
      fetch("/task?_id=" + this.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.task),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          this.$emit("dataChanged");
        })
        .catch((err) => this.$emit("dataAccessFailed", err.message));
    },
    remove() {
      this.confirmation = true;
    },
    removeReal() {
      this.confirmation = false;
      fetch("/task?_id=" + this.id, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          this.$emit("dataChanged");
        })
        .catch((err) => this.$emit("dataAccessFailed", err.message));
    },
    cancel() {
      this.$emit("cancel");
    },
  },
  data() {
    return {
      isPersonValid: false,
      rules: {
        required: (value) => !!value || "empty value is not allowed",
        validStartDate: (value) =>
          !isNaN(new Date(value)) || "valid date required",
        validEndDate: (value) =>
          !isNaN(new Date(value)) || "valid date required", // end date > start date if not null
      },
      allPeople: [],
      task: {},
      dialog: false,
      confirmation: false,
      projects: [],
    };
  },
  mounted() {
    fetch("/project", { method: "GET" })
      .then((res) => res.json())
      .then((data) => (this.projects = data))
      .catch((err) => {
        this.$emit("dataAccessFailed", err.message);
        return;
      });
    console.log("this.projects", this.projects);
    if (this.id) {
      fetch("/person?_id=" + this.id, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          Object.assign(this.person, data);
        })
        .catch((err) => this.$emit("dataAccessFailed", err.message));
    } else {
      this.person = {};
    }
  },
};
</script>
