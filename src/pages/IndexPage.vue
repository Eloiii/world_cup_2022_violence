<template>
  <q-page class="flex justify-center items-start q-mt-xl">
    <div class="row justify-evenly">
      <div class="col-md-3 col-12">
        <MatchResult v-if="lastResult" :title="'Dernier Résultat'" :date="lastResult.time" :match="lastResult"/>
      </div>
      <div class="col-md-3 col-12">
        <MatchResult v-if="nextMatch" :title="'Prochain Match'" :date="nextMatch.time" :match="nextMatch"/>
      </div>
    </div>

  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import MatchResult from "./MatchResult.vue";
import {getSchedule} from "src/getOddsApiData";
import {api} from "src/boot/axios.js"

export default defineComponent({
  name: 'IndexPage',
  components: { MatchResult },
  data : () => {
    return {
      data : "test",
      lastResult : null,
      nextMatch: null
    }
  },
  methods : {
    getNextMatch(matchs) {
      const today = new Date()
      let nextMatch = null
      for(let match of matchs) {
        if(match.time < today)
          continue
        nextMatch = match
        break
      }
      return nextMatch
    }
  },
  async mounted() {
    const self = this
    const oddsApiData = JSON.parse(sessionStorage.getItem("oddsApiData"))
    const schedule = getSchedule(oddsApiData)
    this.nextMatch = this.getNextMatch(schedule)


    const results = (await api.get('/getResults')).data
    for(let result of results) {
      result.time = new Date(result.time)
    }
    results.sort((a, b) => a.time.getTime() - b.time.getTime())
    this.lastResult = results[0]

  }
})
</script>
<style scoped lang="scss">
.row {
  width: 80%
}
</style>
