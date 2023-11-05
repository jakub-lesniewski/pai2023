<template>
  <div class="twoinrow">
    <PersonEditor @dataModified="onDataModified" ref="personEditorRef"/>
    <PersonsLister @dataClicked="onDataClicked" ref="personsListerRef"/>
  </div>
  <br/><hr/>
  <div class="footer">Footer</div>
</template>

<script>
import PersonEditor from './components/PersonEditor.vue'
import PersonsLister from './components/PersonsLister.vue'

export default {
  name: 'App',
  components: {
    PersonEditor, PersonsLister
  },
  methods: {
    onDataModified() {
      this.$refs.personsListerRef.retrieve()
    },
    onDataClicked(data) {
      this.$refs.personEditorRef.fill(data)
    }
  }
}
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  margin: 10px 30px;
}
.footer {
  font-size: small;
  text-align: center;
}
.twoinrow {
  gap: 10px;
  display: flex;
}
</style>
