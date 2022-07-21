<template>
  <q-page class="flex justify-center items-start">
    <div class="row justify-evenly">
      <div class="col-md-3 col-12">
        <MatchResult :title="'Dernier Résultat'" :date="date" :country1="country3" :country2="country4"/>
      </div>
      <div class="col-md-3 col-12">
        <MatchResult :title="'Prochain Match'" :date="date" :country1="country1" :country2="country2"/>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { api } from "boot/axios";
import MatchResult from "./MatchResult.vue";
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'IndexPage',
  components: { MatchResult },
  data : () => {
    return {
      data : "test",
      date: new Date(),
      country1: {
        name: "Belgique",
        score: "?"
      },
      country2: {
        name: "Belgique",
        score: "?"
      },
      country3: {
        name: "Belgique",
        score: "5"
      },
      country4: {
        name: "Belgique",
        score: "7"
      }
    }
  },
  methods : {
    getData() {
      api.get('/getUser', {params: {username: "Eloi"}}).then( response => {
        this.data = response.data
      })
    }
  }
})
</script>
<style scoped lang="scss">


.row {
  width: 80%
}
</style>
