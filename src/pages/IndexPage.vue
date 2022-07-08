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
      api.get('/getOdds', {params: {country1: "Senegal", country2: "Netherlands"}}).then( response => {
        this.data = response.data.data
      })
    }
  }
})
</script>
