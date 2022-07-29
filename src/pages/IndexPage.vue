<template>
  <q-page class="flex justify-center items-start q-mt-xl">
    <div class="row justify-evenly q-col-gutter-xs-md">
      <div class="col-md-3 col-12">
        <MatchResult v-if="lastResult" :date="lastResult.time" :match="lastResult" :title="'Dernier Résultat'" />
      </div>
      <div class="col-md-3 col-12">
        <MatchResult v-if="nextMatch" :date="nextMatch.time" :match="nextMatch" :title="'Prochain Match'" />
      </div>
    </div>
    <div class="row">
      <q-table v-model:pagination="pagination" :columns="columns" :loading="loading" :rows="rows" title="Leaderboard"
               @request="onRequest">

      </q-table>
    </div>

  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import MatchResult from "./MatchResult.vue";
import { getSchedule } from "src/getOddsApiData";
import { collection, getDocs } from "firebase/firestore";
import { db } from "boot/firebaseConnection";
import axios from "axios";


export default defineComponent({
  setup() {
    const rows = ref([]);
    const loading = ref(false);
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 3,
      rowsNumber: 10
    });

    function getDataFromDB() {
      return getAllUsers();
    }

    function getRowsNumberCount(filter, data) {
      if (!filter) {
        return originalRows.length;
      }
      let count = 0;
      originalRows.forEach(treat => {
        if (treat.name.includes(filter)) {
          ++count;
        }
      });
      return count;
    }

    function onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      loading.value = true;
    }
  },
  name: "IndexPage",
  components: { MatchResult },
  data: () => {
    return {
      data: "test",
      lastResult: null,
      nextMatch: null,
      columns: [
        {
          name: "name",
          label: "Nom",
          sortable: true,
          field: "name",
          required: true
        },
        {
          name: "coins",
          label: "Money",
          sortable: true,
          field: "coins",
          required: true
        },
        {
          name: "correct",
          label: "Corrects",
          sortable: true,
          field: "correct",
          required: true
        },
        {
          name: "wrong",
          label: "Ratés",
          sortable: true,
          field: "wrong",
          required: true
        }
      ]
    };
  },
  methods: {
    getNextMatch(matchs) {
      const today = new Date();
      let nextMatch = null;
      for (let match of matchs) {
        if (match.time < today)
          continue;
        nextMatch = match;
        break;
      }
      return nextMatch;
    },
    async getResults() {
      const querySnapshot = await getDocs(collection(db, "results"));
      const res = [];
      querySnapshot.forEach((doc) => {
        res.push(doc.data());
      });
      return res;
    }
  },
  async mounted() {
    if (sessionStorage.getItem("oddsApiData") === null || sessionStorage.getItem("oddsApiData") === "null") {
      const getOddsApiData = await axios.get("https://europe-west1-violence-qatar2022.cloudfunctions.net/getOddsApiData");
      sessionStorage.setItem("oddsApiData", JSON.stringify(getOddsApiData.data));
    }
    const oddsApiData = JSON.parse(sessionStorage.getItem("oddsApiData"));
    const schedule = getSchedule(oddsApiData);
    this.nextMatch = this.getNextMatch(schedule);

    const rawResults = await this.getResults();
    const results = Object.entries(rawResults);
    for (let result of results) {
      result[1].time = new Date(result[1].time);
    }
    results.sort((a, b) => a[1].time.getTime() - b[1].time.getTime());
    this.lastResult = results[0][1];

  }
});
</script>
<style lang="scss" scoped>
.row {
  width: 80%
}
</style>
