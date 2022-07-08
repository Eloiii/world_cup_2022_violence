<template>
  <q-page class="flex flex-center">
    <q-btn @click="getData">
      Clique
    </q-btn>
    {{ data }}
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'IndexPage',
  data : () => {
    return {
      data : "test"
    }
  },
  methods : {
    getData() {
      api.get('/getUser', {params: {username: "Eloi"}}).then( response => {
        console.log(response);
        this.data = response.data
      })
    }
  }
})
</script>
